import { useParams, useNavigate } from "react-router-dom";
import TextFileIcon from "./TextFileIcon";
import LanguageSelector from "./LanguageSelector";
import type { TalesData, CollectionsData } from "./types";

interface TalesListPageProps {
  tales: TalesData;
  collections: CollectionsData;
  selectedLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (lang: string) => void;
}

export default function TalesListPage({
  tales,
  collections,
  selectedLanguage,
  availableLanguages,
  onLanguageChange,
}: TalesListPageProps) {
  const { collectionSlug } = useParams<{ collectionSlug: string }>();
  const navigate = useNavigate();

  const handleTaleSelect = (taleSlug: string) => {
    const tale = tales[taleSlug];
    const hasLanguage = tale?.language.includes(selectedLanguage);
    const fileSlug = hasLanguage
      ? `${taleSlug}-${selectedLanguage}`
      : `${taleSlug}-vi`;
    navigate(`/tale/${fileSlug}`);
  };

  const getTalesInCollection = () => {
    if (collectionSlug === "standalone") {
      // Get standalone tales
      const taleToCollection: { [taleSlug: string]: string } = {};
      Object.entries(collections).forEach(([collectionSlug, collection]) => {
        collection.tales.forEach((taleSlug) => {
          taleToCollection[taleSlug] = collectionSlug;
        });
      });

      return Object.entries(tales)
        .filter(
          ([slug, tale]) =>
            !taleToCollection[slug] &&
            tale.language.includes(selectedLanguage)
        )
        .map(([slug, tale]) => ({ slug, tale }));
    }

    // Get tales from specific collection
    const collection = collections[collectionSlug || ""];
    if (!collection) return [];

    return collection.tales
      .map((slug) => ({ slug, tale: tales[slug] }))
      .filter(({ tale }) => tale && tale.language.includes(selectedLanguage));
  };

  const collectionTales = getTalesInCollection();
  const collection = collections[collectionSlug || ""];
  const collectionName =
    collectionSlug === "standalone"
      ? "Standalone things"
      : collection?.name[selectedLanguage] ||
        collection?.name["en"] ||
        Object.values(collection?.name || {})[0] ||
        "";

  return (
    <div>
      <button onClick={() => navigate("/")}>← Back</button>
      <h1>{collectionName}</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {collectionTales.map(({ slug, tale }) => {
          const title = tale.title[selectedLanguage] || tale.title["en"];
          const displayName = `${title} - ${tale.author} (${new Date(
            tale.lastUpdated
          ).getFullYear()})`;

          return (
            <TextFileIcon
              key={slug}
              name={displayName}
              onClick={() => handleTaleSelect(slug)}
            />
          );
        })}
      </div>

      <LanguageSelector
        languages={availableLanguages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
}
