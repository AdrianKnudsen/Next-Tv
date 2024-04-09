import { useState } from "react";

import style from "./searchFunction.module.css";

export default function SearchFunction() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.API_KEY;

  const fetchTitleDetails = async (titleId) => {
    const url = `https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=${apiKey}&append_to_response=sources`;
    const response = await fetch(url);
    const detailsData = await response.json();
    return detailsData; // This includes the title details and sources.
  };

  // Function to handle the search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = `http://localhost:8000/search?query=${encodeURIComponent(
        query
      )}`;
      const autocompleteResponse = await fetch(backendUrl);
      const autocompleteData = await autocompleteResponse.json();

      if (autocompleteData.results && autocompleteData.results.length > 0) {
        const detailedResults = await Promise.all(
          autocompleteData.results.map(async (title) => {
            const details = await fetchTitleDetails(title.id);
            return { ...title, ...details };
          })
        );

        setResults(detailedResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
        {results.map((item, index) => (
          <div key={index} className={style.resultItem}>
            {/* Section for title and poster */}
            <div className={style.titleAndPoster}>
              <h3>{item.title}</h3>
              {item.image_url && (
                <img
                  className={style.poster}
                  src={item.image_url}
                  alt={`Poster for ${item.name}`}
                />
              )}
            </div>

            {/* Section for the rest of the information */}
            <div className={style.details}>
              <p>Type: {item.type}</p>
              <p>
                Genre: {item.genre_names ? item.genre_names.join(", ") : " "}
              </p>
              <div className={style.availableOn}>
                Available on:
                <ul>
                  {item.sources &&
                    item.sources
                      .filter((source) => source.type === "sub")
                      .reduce((unique, source) => {
                        if (!unique.some((u) => u.name === source.name)) {
                          unique.push(source);
                        }
                        return unique;
                      }, [])
                      .map((source, sIndex) => (
                        <li key={sIndex} className={style.streamingService}>
                          {source.name} -{" "}
                          <a
                            href={source.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Watch
                          </a>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
