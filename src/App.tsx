import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    </div>
  );
}

export default App;
