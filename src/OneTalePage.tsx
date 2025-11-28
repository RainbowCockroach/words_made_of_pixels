import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import showdown from "showdown";
import LanguageSelector from "./LanguageSelector";
import "./OneTalePage.css";
import type { Tale, TalesData, CollectionsData } from "./types";

const OneTalePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tale, setTale] = useState<Tale | null>(null);
  const [taleContent, setTaleContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [parentCollection, setParentCollection] = useState<string | null>(null);

  const getBackLink = () => {
    return parentCollection ? `/collection/${parentCollection}` : "/";
  };

  useEffect(() => {
    const converter = new showdown.Converter();
    const loadTale = async () => {
      if (!slug) return;

      try {
        // Parse the slug to get base slug and language
        // slug format: "tale-slug-language" or just "tale-slug"
        const parts = slug.split("-");
        const language = parts[parts.length - 1];
        const baseSlug = parts.slice(0, -1).join("-");

        // Load tale metadata
        const talesResponse = await fetch(
          "/words_made_of_pixels/tales/_tales.json"
        );
        const talesData: TalesData = await talesResponse.json();
        const taleInfo = talesData[baseSlug];

        if (!taleInfo) {
          setTale(null);
          setTaleContent("Tale not found");
          setLoading(false);
          return;
        }

        // Get only languages available for this specific tale
        setAvailableLanguages(taleInfo.language.sort());

        // Check if the requested language is available
        if (!taleInfo.language.includes(language)) {
          setTale(null);
          setTaleContent("Tale not available in requested language");
          setLoading(false);
          return;
        }

        setTale(taleInfo);

        // Load collections data to find parent collection
        try {
          const collectionsResponse = await fetch(
            "/words_made_of_pixels/tales/_collections.json"
          );
          const collectionsData: CollectionsData =
            await collectionsResponse.json();

          // Find which collection contains this tale
          const parentCollectionSlug = Object.keys(collectionsData).find(
            (collectionSlug) =>
              collectionsData[collectionSlug].tales.includes(baseSlug)
          );

          setParentCollection(parentCollectionSlug || null);
        } catch (error) {
          console.error("Error loading collections:", error);
          setParentCollection(null);
        }

        // Load tale content
        const contentResponse = await fetch(
          `/words_made_of_pixels/tales/${slug}.md`
        );

        if (!contentResponse.ok) {
          throw new Error(
            `Failed to fetch tale content: ${contentResponse.status}`
          );
        }

        const markdown = await contentResponse.text();
        const html = converter.makeHtml(markdown);
        setTaleContent(html);
      } catch (error) {
        console.error("Error loading tale:", error);
        setTaleContent("Error loading tale content");
      } finally {
        setLoading(false);
      }
    };

    loadTale();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tale) {
    return (
      <div>
        <Link to={getBackLink()}>← Back</Link>
        <div>Not found</div>
      </div>
    );
  }

  const getLanguageFromSlug = (slug: string) => {
    const parts = slug.split("-");
    return parts[parts.length - 1];
  };

  const currentLanguage = slug ? getLanguageFromSlug(slug) : "vi";
  const title = tale
    ? tale.title[currentLanguage] ||
      tale.title["en"] ||
      Object.values(tale.title)[0]
    : "";

  const handleLanguageChange = (newLanguage: string) => {
    if (slug && tale) {
      const parts = slug.split("-");
      const baseSlug = parts.slice(0, -1).join("-");
      const targetLanguage = tale.language.includes(newLanguage)
        ? newLanguage
        : "vi";
      navigate(`/tale/${baseSlug}-${targetLanguage}`);
    }
  };

  return (
    <div className="one-tale-page">
      <Link to={getBackLink()}>← Back</Link>
      <h1>{title}</h1>
      <p className="tale-meta">
        {tale.author} ({new Date(tale.lastUpdated).toLocaleDateString()})
      </p>
      <div
        className="tale-content"
        dangerouslySetInnerHTML={{ __html: taleContent }}
      />

      <LanguageSelector
        languages={availableLanguages}
        selectedLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
};

export default OneTalePage;
