import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CollectionsListPage from "./CollectionsListPage";
import TalesListPage from "./TalesListPage";
import OneTalePage from "./OneTalePage";
import type { TalesData, CollectionsData } from "./types";

export default function App() {
  const [tales, setTales] = useState<TalesData>({});
  const [collections, setCollections] = useState<CollectionsData>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>("vi");

  useEffect(() => {
    Promise.all([
      fetch("/words_made_of_pixels/tales/_tales.json").then((r) => r.json()),
      fetch("/words_made_of_pixels/tales/_collections.json").then((r) =>
        r.json()
      ),
    ])
      .then(([talesData, collectionsData]: [TalesData, CollectionsData]) => {
        setTales(talesData);
        setCollections(collectionsData);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

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

  const availableLanguages = getAvailableLanguages();
  const sharedProps = {
    tales,
    collections,
    selectedLanguage,
    availableLanguages,
    onLanguageChange: setSelectedLanguage,
  };

  return (
    <Routes>
      <Route path="/" element={<CollectionsListPage {...sharedProps} />} />
      <Route
        path="/collection/:collectionSlug"
        element={<TalesListPage {...sharedProps} />}
      />
      <Route path="/tale/:slug" element={<OneTalePage />} />
    </Routes>
  );
}
