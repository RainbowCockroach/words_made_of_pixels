import { useNavigate } from "react-router-dom";
import FolderIcon from "./FolderIcon";
import LanguageSelector from "./LanguageSelector";
import type { TalesData, CollectionsData } from "./types";

interface CollectionsListPageProps {
  tales: TalesData;
  collections: CollectionsData;
  selectedLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (lang: string) => void;
}

export default function CollectionsListPage({
  tales,
  collections,
  selectedLanguage,
  availableLanguages,
  onLanguageChange,
}: CollectionsListPageProps) {
  const navigate = useNavigate();

  const getCollectionFolders = () => {
    const folders: Array<{
      slug: string;
      name: string;
      isStandalone: boolean;
    }> = [];

    // Add collections that have tales in the selected language
    Object.entries(collections).forEach(([slug, collection]) => {
      const hasLanguage = collection.language.includes(selectedLanguage);
      const hasTalesInLanguage = collection.tales.some((taleSlug) => {
        const tale = tales[taleSlug];
        return tale && tale.language.includes(selectedLanguage);
      });

      if (hasLanguage && hasTalesInLanguage) {
        const name =
          collection.name[selectedLanguage] ||
          collection.name["en"] ||
          Object.values(collection.name)[0];
        folders.push({ slug, name, isStandalone: false });
      }
    });

    // Check if there are standalone tales in selected language
    const taleToCollection: { [taleSlug: string]: string } = {};
    Object.entries(collections).forEach(([collectionSlug, collection]) => {
      collection.tales.forEach((taleSlug) => {
        taleToCollection[taleSlug] = collectionSlug;
      });
    });

    const hasStandaloneTales = Object.entries(tales).some(([slug, tale]) => {
      return (
        !taleToCollection[slug] && tale.language.includes(selectedLanguage)
      );
    });

    if (hasStandaloneTales) {
      folders.push({
        slug: "standalone",
        name: "Standalone things",
        isStandalone: true,
      });
    }

    return folders;
  };

  const folders = getCollectionFolders();

  return (
    <div>
      <h1>Disjointed tales of pixels</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {folders.map(({ slug, name }) => (
          <FolderIcon
            key={slug}
            name={name}
            onClick={() => navigate(`/collection/${slug}`)}
          />
        ))}
      </div>

      <LanguageSelector
        languages={availableLanguages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
}
