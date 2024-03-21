import { useState } from "react";

import style from "./searchFunction.module.css";

export default function SearchFunction() {
  const [streams] = useState([]);

  const searchStreaming = async (e) => {
    e.preventDefault();

    const url =
      "https://api.watchmode.com/v1/sources/?apiKey=unwb8JLwwmPPn4n85XoWSfONMETX2o6pUvNleq0L";

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
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
      <div className="card-list">{streams.map((name) => name.results)}</div>
    </>
  );
}
