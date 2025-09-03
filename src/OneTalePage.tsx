import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import showdown from "showdown";
import "./OneTalePage.css";

interface Tale {
  title: string;
  author: string;
  year: number;
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
        // Load tale metadata
        const talesResponse = await fetch("/words_made_of_pixels/tales/_tales.json");
        const talesData: TalesData = await talesResponse.json();
        const taleInfo = talesData[slug];
        
        if (!taleInfo) {
          setTale(null);
          setTaleContent("Tale not found");
          setLoading(false);
          return;
        }

        setTale(taleInfo);

        // Load tale content
        const contentResponse = await fetch(`/words_made_of_pixels/tales/${slug}.md`);
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
        <Link to="/">← Back to tales</Link>
        <div>Tale not found</div>
      </div>
    );
  }

  return (
    <div className="one-tale-page">
      <Link to="/">← Back to tales</Link>
      <h1>{tale.title}</h1>
      <p className="tale-meta">by {tale.author} ({tale.year})</p>
      <div 
        className="tale-content" 
        dangerouslySetInnerHTML={{ __html: taleContent }} 
      />
    </div>
  );
};

export default OneTalePage;
