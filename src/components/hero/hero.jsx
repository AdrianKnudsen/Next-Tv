import style from "./hero.module.css";

export default function Hero() {
  return (
    <>
      <h1 className={style.headerText}>
        <span className={style.find}>Find</span>{" "}
        <span className={style.your}>your</span>
        <br />
        <span className={style.tv}>next Tv</span>
        <br />
        <span className={style.adventure}>Adventure</span>
      </h1>
    </>
  );
}
