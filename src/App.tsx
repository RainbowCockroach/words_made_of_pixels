import { useState, useEffect } from "react";
import showdown from "showdown";

interface Tale {
  title: string;
  author: string;
  year: number;
}

interface TalesData {
  [key: string]: Tale;
}

function App() {
  const [tales, setTales] = useState<TalesData>({});
  const [selectedTale, setSelectedTale] = useState<string>("");
  const [taleContent, setTaleContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const converter = new showdown.Converter();

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

  const handleTaleSelect = async (taleSlug: string) => {
    setSelectedTale(taleSlug);
    setLoading(true);

    try {
      const response = await fetch(
        `/words_made_of_pixels/tales/${taleSlug}.md`
      );
      const markdown = await response.text();
      const html = converter.makeHtml(markdown);
      setTaleContent(html);
    } catch (error) {
      console.error("Error loading tale content:", error);
      setTaleContent("Error loading tale content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Disjointed tales of pixels</h1>

      <div>
        <ul>
          {Object.entries(tales).map(([slug, tale]) => (
            <li key={slug}>
              <button onClick={() => handleTaleSelect(slug)}>
                {tale.title} by {tale.author} ({tale.year})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTale && (
        <div>
          <h2>{tales[selectedTale]?.title}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: taleContent }} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
