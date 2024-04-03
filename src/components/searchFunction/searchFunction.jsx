import { useState } from "react";
import { apiKey } from "../../../key.js";

import style from "./searchFunction.module.css";

export default function SearchFunction() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchResponse = await fetch(
        `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(
          query
        )}`
      );
      const searchData = await searchResponse.json();
      if (searchData.title_results && searchData.title_results.length > 0) {
        const titleId = searchData.title_results[0].id;

        const sourcesResponse = await fetch(
          `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${apiKey}`
        );
        const sourcesData = await sourcesResponse.json();
        setResults(sourcesData);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={style.form} onSubmit={handleSearch}>
        <input
          className={style.input}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={style.button} type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className={style.results}>
        {results.map((option, index) => (
          <div key={index} className={style.resultItem}>
            <h3>{option.name}</h3>
            <p>
              Type: {option.type}, Region: {option.region}
            </p>
            <p>
              Seasons: {option.seasons ? option.seasons : "N/A"}, Episodes:{" "}
              {option.episodes ? option.episodes : "N/A"}
            </p>
            {option.web_url && (
              <a
                href={option.web_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on {option.name}
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
