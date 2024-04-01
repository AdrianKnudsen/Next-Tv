import { useState } from "react";
import { apiKey } from "../../../key.js";

import style from "./searchFunction.module.css";

export default function SearchFunction() {
  const [streams, setStreams] = useState([]);

  const searchStreaming = async (e) => {
    e.preventDefault();

    const url = `https://api.watchmode.com/v1/sources/?apiKey=${apiKey}`;

    const fetchData = async (url) => {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);

      setStreams(result);
    };

    fetchData(url);
  };

  return (
    <>
      <form className={style.form} onSubmit={searchStreaming}>
        <input
          className={style.input}
          type="text"
          name="query"
          placeholder="Search"
        />
        <button className={style.button} type="submit">
          Search
        </button>
      </form>
      <div className={style.cardList}>
        {streams.map((stream, index) => (
          <div key={index} className={style.card}>
            {stream.image_url}
          </div>
        ))}
      </div>
    </>
  );
}
