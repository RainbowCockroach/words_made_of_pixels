import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import showdown from "showdown";
import "./OneTalePage.css";

interface Tale {
  title: { [language: string]: string };
  author: string;
  lastUpdated: string;
  language: string[];
}

interface TalesData {
  [key: string]: Tale;
}

const OneTalePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tale, setTale] = useState<Tale | null>(null);
  const [taleContent, setTaleContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

        // Check if the requested language is available
        if (!taleInfo.language.includes(language)) {
          setTale(null);
          setTaleContent("Tale not available in requested language");
          setLoading(false);
          return;
        }

        setTale(taleInfo);

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
        <Link to="/">← Back</Link>
        <div>Not found</div>
      </div>
    );
  }

  const getLanguageFromSlug = (slug: string) => {
    const parts = slug.split("-");
    return parts[parts.length - 1];
  };

  const currentLanguage = slug ? getLanguageFromSlug(slug) : "en";
  const title = tale
    ? tale.title[currentLanguage] ||
      tale.title["en"] ||
      Object.values(tale.title)[0]
    : "";

  return (
    <div className="one-tale-page">
      <Link to="/">← Back</Link>
      <h1>{title}</h1>
      <p className="tale-meta">
        {tale.author} ({new Date(tale.lastUpdated).toLocaleDateString()})
      </p>
      <div
        className="tale-content"
        dangerouslySetInnerHTML={{ __html: taleContent }}
      />
    </div>
  );
};

export default OneTalePage;
