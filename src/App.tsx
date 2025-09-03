import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Tale {
  title: { [language: string]: string };
  author: string;
  lastUpdated: string;
  language: string[];
}

interface Collection {
  name: { [language: string]: string };
  lastUpdated: string;
  language: string[];
  tales: string[];
}

interface TalesData {
  [key: string]: Tale;
}

interface CollectionsData {
  [key: string]: Collection;
}

function App() {
  const [tales, setTales] = useState<TalesData>({});
  const [collections, setCollections] = useState<CollectionsData>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching tales...");
    Promise.all([
      fetch("/words_made_of_pixels/tales/_tales.json").then((r) => r.json()),
      fetch("/words_made_of_pixels/tales/_collections.json").then((r) =>
        r.json()
      ),
    ])
      .then(([talesData, collectionsData]: [TalesData, CollectionsData]) => {
        console.log("Tales data:", talesData);
        console.log("Collections data:", collectionsData);
        setTales(talesData);
        setCollections(collectionsData);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const handleTaleSelect = (taleSlug: string) => {
    const tale = tales[taleSlug];
    const hasLanguage = tale?.language.includes(selectedLanguage);
    const fileSlug = hasLanguage
      ? `${taleSlug}-${selectedLanguage}`
      : `${taleSlug}-en`;
    navigate(`/tale/${fileSlug}`);
  };

  const getAvailableLanguages = () => {
    const languages = new Set<string>();
    Object.values(tales).forEach((tale) => {
      tale.language.forEach((lang) => languages.add(lang));
    });
    Object.values(collections).forEach((collection) => {
      collection.language.forEach((lang) => languages.add(lang));
    });
    return Array.from(languages).sort();
  };

  const groupedTales = () => {
    const collectionTales: {
      [key: string]: Array<{ slug: string; tale: Tale }>;
    } = {};
    const standalone: Array<{ slug: string; tale: Tale }> = [];

    // Find which tales belong to collections
    const taleToCollection: { [taleSlug: string]: string } = {};
    Object.entries(collections).forEach(([collectionSlug, collection]) => {
      collection.tales.forEach((taleSlug) => {
        taleToCollection[taleSlug] = collectionSlug;
      });
    });

    // Group tales
    Object.entries(tales).forEach(([slug, tale]) => {
      const collectionSlug = taleToCollection[slug];

      if (collectionSlug && collections[collectionSlug]) {
        const collection = collections[collectionSlug];
        const collectionName =
          collection.name[selectedLanguage] ||
          collection.name["en"] ||
          Object.values(collection.name)[0];

        if (!collectionTales[collectionName]) {
          collectionTales[collectionName] = [];
        }
        collectionTales[collectionName].push({ slug, tale });
      } else {
        standalone.push({ slug, tale });
      }
    });

    // Sort collections by tale order as defined in collections
    Object.entries(collectionTales).forEach(([collectionName, tales]) => {
      const collection = Object.values(collections).find(
        (c) =>
          (c.name[selectedLanguage] ||
            c.name["en"] ||
            Object.values(c.name)[0]) === collectionName
      );

      if (collection) {
        tales.sort((a, b) => {
          const aIndex = collection.tales.indexOf(a.slug);
          const bIndex = collection.tales.indexOf(b.slug);
          return aIndex - bIndex;
        });
      }
    });

    return { collections: collectionTales, standalone };
  };

  const { collections: groupedCollections, standalone } = groupedTales();
  const availableLanguages = getAvailableLanguages();

  return (
    <div>
      <h1>Disjointed tales of pixels</h1>

      {availableLanguages.length > 1 && (
        <div style={{ marginBottom: "20px" }}>
          <label>Language: </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        {Object.entries(groupedCollections).map(([collectionName, tales]) => (
          <div key={collectionName}>
            <h3>{collectionName}</h3>
            <ul>
              {tales.map(({ slug, tale }) => {
                const hasSelectedLanguage =
                  tale.language.includes(selectedLanguage);
                const title =
                  tale.title[selectedLanguage] ||
                  tale.title["en"] ||
                  Object.values(tale.title)[0];
                return (
                  <li key={slug}>
                    <button
                      onClick={() => handleTaleSelect(slug)}
                      disabled={!hasSelectedLanguage}
                      style={{ opacity: hasSelectedLanguage ? 1 : 0.5 }}
                    >
                      {title} - {tale.author} (
                      {new Date(tale.lastUpdated).getFullYear()})
                      {!hasSelectedLanguage && (
                        <span>
                          {" "}
                          (Available in:{" "}
                          {tale.language.join(", ").toUpperCase()})
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {standalone.length > 0 && (
          <div>
            <h3>Standalone things</h3>
            <ul>
              {standalone.map(({ slug, tale }) => {
                const hasSelectedLanguage =
                  tale.language.includes(selectedLanguage);
                const title =
                  tale.title[selectedLanguage] ||
                  tale.title["en"] ||
                  Object.values(tale.title)[0];
                return (
                  <li key={slug}>
                    <button
                      onClick={() => handleTaleSelect(slug)}
                      disabled={!hasSelectedLanguage}
                      style={{ opacity: hasSelectedLanguage ? 1 : 0.5 }}
                    >
                      {title} - {tale.author} (
                      {new Date(tale.lastUpdated).getFullYear()})
                      {!hasSelectedLanguage && (
                        <span>
                          {" "}
                          (Available in:{" "}
                          {tale.language.join(", ").toUpperCase()})
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
