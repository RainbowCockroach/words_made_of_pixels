import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Tale {
  title: string;
  author: string;
  year: number;
  collection?: {
    name: string;
    order: number;
  };
}

interface TalesData {
  [key: string]: Tale;
}

function App() {
  const [tales, setTales] = useState<TalesData>({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching tales...");
    fetch("/words_made_of_pixels/tales/_tales.json")
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data: TalesData) => {
        console.log("Tales data:", data);
        setTales(data);
      })
      .catch((error) => console.error("Error loading tales:", error));
  }, []);

  const handleTaleSelect = (taleSlug: string) => {
    navigate(`/tale/${taleSlug}`);
  };

  const groupedTales = () => {
    const collections: { [key: string]: Array<{ slug: string; tale: Tale }> } =
      {};
    const standalone: Array<{ slug: string; tale: Tale }> = [];

    Object.entries(tales).forEach(([slug, tale]) => {
      if (tale.collection) {
        if (!collections[tale.collection.name]) {
          collections[tale.collection.name] = [];
        }
        collections[tale.collection.name].push({ slug, tale });
      } else {
        standalone.push({ slug, tale });
      }
    });

    Object.values(collections).forEach((collection) => {
      collection.sort(
        (a, b) =>
          (a.tale.collection?.order || 0) - (b.tale.collection?.order || 0)
      );
    });

    return { collections, standalone };
  };

  const { collections, standalone } = groupedTales();

  return (
    <div>
      <h1>Disjointed tales of pixels</h1>

      <div>
        {Object.entries(collections).map(([collectionName, tales]) => (
          <div key={collectionName}>
            <h2>{collectionName}</h2>
            <ul>
              {tales.map(({ slug, tale }) => (
                <li key={slug}>
                  <button onClick={() => handleTaleSelect(slug)}>
                    {tale.title} by {tale.author} ({tale.year})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {standalone.length > 0 && (
          <div>
            <h2>Disjointed Tales</h2>
            <ul>
              {standalone.map(({ slug, tale }) => (
                <li key={slug}>
                  <button onClick={() => handleTaleSelect(slug)}>
                    {tale.title} by {tale.author} ({tale.year})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
