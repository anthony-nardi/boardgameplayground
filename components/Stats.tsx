import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import classes from "./Main.module.css";
import styles from "./Stats.module.css";

/*
 * Who has been playing what, and how they finished: read from the public
 * leaderboard endpoint the game server exposes. Names are the short form
 * the tables use, never full addresses.
 */

export const LEADERBOARD_URL =
  process.env.NEXT_PUBLIC_LEADERBOARD_URL ||
  "https://us-central1-high-society-c4ff4.cloudfunctions.net/leaderboard";

export type Row = {
  name: string;
  played: number;
  wins: number;
  /** Finishing places 1st to 6th+, as counts. */
  places: number[];
  lastPlayedAt: number;
};

export type Leaderboard = {
  generatedAt: number;
  overall: Row[];
  games: { name: string; title: string; played: number; rows: Row[] }[];
};

const ORDINAL = ["1st", "2nd", "3rd", "4th", "5th", "6th+"];

export function placesText(places: number[]) {
  const parts = places
    .map((n, i) => (n ? `${ORDINAL[i]} ×${n}` : ""))
    .filter(Boolean);
  return parts.length ? parts.join(" · ") : "–";
}

export function winRate(row: Row) {
  return row.played ? Math.round((100 * row.wins) / row.played) : 0;
}

function Board({ rows, caption }: { rows: Row[]; caption: string }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th className={styles.num}>Played</th>
            <th className={styles.num}>Won</th>
            <th className={styles.num}>Win rate</th>
            <th>Places</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.name}>
              <td className={styles.rank}>{i + 1}</td>
              <td className={styles.name}>{row.name}</td>
              <td className={styles.num}>{row.played}</td>
              <td className={styles.num}>{row.wins}</td>
              <td className={styles.num}>{winRate(row)}%</td>
              <td className={styles.places}>
                {row.places.length ? placesText(row.places) : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Stats({ initial }: { initial?: Leaderboard | null }) {
  const [data, setData] = useState<Leaderboard | null>(initial ?? null);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<string>("overall");

  useEffect(() => {
    let cancelled = false;
    fetch(LEADERBOARD_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`The leaderboard answered ${r.status}.`);
        return r.json() as Promise<Leaderboard>;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const game = useMemo(
    () => data?.games.find((g) => g.name === picked),
    [data, picked],
  );
  const totalPlays = useMemo(
    () => data?.games.reduce((n, g) => n + g.played, 0) ?? 0,
    [data],
  );

  return (
    <main className={classes.page}>
      <div className={classes.blob1} aria-hidden="true" />
      <div className={classes.blob2} aria-hidden="true" />
      <div className={classes.blob3} aria-hidden="true" />

      <section className={classes.hero}>
        <p className={classes.eyebrow}>Board Game Playground</p>
        <h1 className={classes.title}>
          Who plays what.
          <br />
          <span className={classes.titleAccent}>And who wins.</span>
        </h1>
        <p className={classes.lead}>
          Every finished game is counted for the people at the table: plays,
          wins and finishing places, per game. Bots are not ranked.
        </p>
        <div className={classes.heroActions}>
          <Link href="/" className={classes.secondary}>
            Back to the games
          </Link>
        </div>
      </section>

      <section className={styles.section} id="stats">
        {error ? (
          <p className={styles.note}>Could not load the figures: {error}</p>
        ) : !data ? (
          <p className={styles.note}>Loading the figures…</p>
        ) : data.overall.length === 0 ? (
          <p className={styles.note}>
            No finished games yet. Play one through and come back.
          </p>
        ) : (
          <>
            <ul className={classes.facts}>
              <li>
                <strong>{data.overall.length}</strong> player
                {data.overall.length === 1 ? "" : "s"}
              </li>
              <li>
                <strong>{totalPlays}</strong> game{totalPlays === 1 ? "" : "s"}{" "}
                finished
              </li>
              <li>
                <strong>{data.games.length}</strong> title
                {data.games.length === 1 ? "" : "s"} played
              </li>
            </ul>

            <div className={styles.picker} role="tablist" aria-label="Game">
              <button
                type="button"
                role="tab"
                aria-selected={picked === "overall"}
                className={`${styles.pick} ${picked === "overall" ? styles.pickOn : ""}`}
                onClick={() => setPicked("overall")}
              >
                All games
              </button>
              {data.games.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  role="tab"
                  aria-selected={picked === g.name}
                  className={`${styles.pick} ${picked === g.name ? styles.pickOn : ""}`}
                  onClick={() => setPicked(g.name)}
                >
                  {g.title}
                  <span className={styles.pickCount}>{g.played}</span>
                </button>
              ))}
            </div>

            {picked === "overall" || !game ? (
              <Board
                rows={data.overall}
                caption="Every game together, most wins first"
              />
            ) : (
              <Board
                rows={game.rows}
                caption={`${game.title}: ${game.played} game${game.played === 1 ? "" : "s"} finished, most wins first`}
              />
            )}
            <p className={styles.note}>
              Figures as of {new Date(data.generatedAt).toLocaleString()}. Games
              against bots count; a shared win counts as a win for each winner.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
