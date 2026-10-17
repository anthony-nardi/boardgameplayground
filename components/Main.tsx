import Link from "next/link";
import GameArt, { GameKey } from "./GameArt";
import classes from "./Main.module.css";

// The card games live in their own app. In development it can be pointed
// at a local checkout via .env.development; production uses the deployed URL.
const HIGH_SOCIETY_URL =
  process.env.NEXT_PUBLIC_HIGH_SOCIETY_URL ??
  "https://high-society-c4ff4.web.app";

type Game = {
  key: GameKey;
  title: string;
  tagline: string;
  description: string;
  players: string;
  designer: string;
  length: string;
  tags: string[];
  accent: string;
  href: string;
};

const games: Game[] = [
  {
    key: "tzaar",
    title: "TZAAR",
    tagline: "Capture, stack, outthink.",
    description:
      "An abstract duel on a hexagonal board. Every turn you must capture, then choose to capture again or strengthen a stack. Lose all of one piece type and you lose the game.",
    players: "2 players",
    designer: "Kris Burm",
    length: "20 min",
    tags: ["Abstract", "Minimax bot", "Local"],
    accent: "#4f8fdc",
    href: "/tzaar",
  },
  {
    key: "family-inc",
    title: "Family Inc.",
    tagline: "Push your luck, rob the family.",
    description:
      "Draw chips from the pile for as long as your nerve holds. Stop to keep them and steal matching chips from your rivals; bust and they're gone. First to 100 wins.",
    players: "2–7 players",
    designer: "Reiner Knizia",
    length: "20 min",
    tags: ["Push your luck", "Expectimax bots", "Online"],
    accent: "#2ecc71",
    href: `${HIGH_SOCIETY_URL}/family-inc`,
  },
  {
    key: "high-society",
    title: "High Society",
    tagline: "Spend big. Just not the most.",
    description:
      "Bid your money cards on luxuries and dodge the misfortunes. The highest score wins, but whoever has the least money left at the end is out, no matter what they own.",
    players: "3–5 players",
    designer: "Reiner Knizia",
    length: "25 min",
    tags: ["Bidding", "Maxn bots", "Online"],
    accent: "#d9b44a",
    href: `${HIGH_SOCIETY_URL}/high-society`,
  },
  {
    key: "no-thanks",
    title: "No Thanks!",
    tagline: "Every card is a point. Points are bad.",
    description:
      "Take the card and the chips on it, or pay a chip to pass it on. Runs of consecutive cards only count their lowest card, and every chip you keep is a point off.",
    players: "3–7 players",
    designer: "Thorsten Gimmler",
    length: "15 min",
    tags: ["Push your luck", "Maxn bots", "Online"],
    accent: "#e74c3c",
    href: `${HIGH_SOCIETY_URL}/no-thanks`,
  },
  {
    key: "razzia",
    title: "Razzia!",
    tagline: "Bid for loot. Watch the police.",
    description:
      "Gangsters divide the city over three rounds of auctions. Reveal loot onto the table and call an auction when it's worth it, because the seventh police raid ends the round with everything still on the table lost.",
    players: "3–5 players",
    designer: "Reiner Knizia",
    length: "45 min",
    tags: ["Auction", "Maxn bots", "Online"],
    accent: "#e67e22",
    href: `${HIGH_SOCIETY_URL}/razzia`,
  },
  {
    key: "zertz",
    title: "ZÈRTZ",
    tagline: "The board shrinks. The marbles jump.",
    description:
      "Place a marble, remove a ring, and the hexagon closes in. Captures are compulsory and chain together. Collect three of each colour, or four white, five gray or six black.",
    players: "2 players",
    designer: "Kris Burm",
    length: "20 min",
    tags: ["Abstract", "Negamax bot", "Online"],
    accent: "#9b59b6",
    href: `${HIGH_SOCIETY_URL}/zertz`,
  },
  {
    key: "yinsh",
    title: "YINSH",
    tagline: "Rings move. Markers flip.",
    description:
      "Every move leaves a marker behind and flips whatever the ring jumps. Line up five of your colour to score a ring, but each ring you score is one fewer to play with. Three wins.",
    players: "2 players",
    designer: "Kris Burm",
    length: "30 min",
    tags: ["Abstract", "Negamax bot", "Online"],
    accent: "#4f8fdc",
    href: `${HIGH_SOCIETY_URL}/yinsh`,
  },
  {
    key: "dvonn",
    title: "DVONN",
    tagline: "Stack up. Cut off. Collapse.",
    description:
      "Fill the board, then jump stacks onto each other: a stack moves exactly as far as it is tall. Anything that loses touch with the three red DVONN pieces falls away. Control the most pieces when nobody can move.",
    players: "2 players",
    designer: "Kris Burm",
    length: "30 min",
    tags: ["Abstract", "Negamax bot", "Online"],
    accent: "#e0583f",
    href: `${HIGH_SOCIETY_URL}/dvonn`,
  },
  {
    key: "gipf",
    title: "GIPF",
    tagline: "Push in. Line up four. Take them back.",
    description:
      "The game that started the project, in its basic form. Push pieces onto the board from the edge, shoving whatever is in the way. Four in a row come back to you, and anything touching them of the other colour is captured. Run your opponent out of pieces.",
    players: "2 players",
    designer: "Kris Burm",
    length: "30 min",
    tags: ["Abstract", "Negamax bot", "Online"],
    accent: "#f2c14e",
    href: `${HIGH_SOCIETY_URL}/gipf`,
  },
  {
    key: "lyngk",
    title: "LYNGK",
    tagline: "Claim two colours. Stack five.",
    description:
      "The last game of the project, and a blend of all the others. Nobody owns anything at first: claim two colours, slide stacks onto the first piece they meet, link through your own colour, and take off every stack of five different colours topped by yours.",
    players: "2 players",
    designer: "Kris Burm",
    length: "30 min",
    tags: ["Abstract", "Negamax bot", "Online"],
    accent: "#2e9e5b",
    href: `${HIGH_SOCIETY_URL}/lyngk`,
  },
  {
    key: "for-sale",
    title: "For Sale",
    tagline: "Buy low. Sell high.",
    description:
      "Two quick halves. First bid for properties, from a cardboard box to a tower, paying half your bid to drop out. Then sell them for cheques: the best property on the table takes the biggest cheque. Richest player wins.",
    players: "3–6 players",
    designer: "Stefan Dorra",
    length: "20 min",
    tags: ["Auction", "Maxn bot", "Online"],
    accent: "#e8a33d",
    href: `${HIGH_SOCIETY_URL}/for-sale`,
  },
  {
    key: "shangri-la",
    title: "The Bridges of Shangri-La",
    tagline: "Masters, students, crumbling bridges.",
    description:
      "Seed the villages with masters, train students, then send every student in a village over a bridge that breaks behind them. Arrive from the stronger village and rivals are sent home. When the last bridge falls, the most masters wins.",
    players: "3–4 players",
    designer: "Leo Colovini",
    length: "45 min",
    tags: ["Area control", "Maxn bot", "Online"],
    accent: "#c9a46b",
    href: `${HIGH_SOCIETY_URL}/shangri-la`,
  },
];

export function FeaturesCards() {
  return (
    <main className={classes.page}>
      <div className={classes.blob1} aria-hidden="true" />
      <div className={classes.blob2} aria-hidden="true" />
      <div className={classes.blob3} aria-hidden="true" />

      <section className={classes.hero}>
        <p className={classes.eyebrow}>Board Game Playground</p>
        <h1 className={classes.title}>
          Twelve board games.
          <br />
          <span className={classes.titleAccent}>Clever bots. Zero setup.</span>
        </h1>
        <p className={classes.lead}>
          Play in the browser against bots that actually think, or invite
          friends with a link. Sign in with Google, pick a game, and you are at
          the table.
        </p>
        <div className={classes.heroActions}>
          <a href="#games" className={classes.primary}>
            Pick a game
          </a>
          <a
            href="https://github.com/anthony-nardi"
            className={classes.secondary}
            target="_blank"
            rel="noreferrer"
          >
            Source on GitHub
          </a>
        </div>
        <ul className={classes.facts}>
          <li>
            <strong>12</strong> games
          </li>
          <li>
            <strong>Bots</strong> in every one
          </li>
          <li>
            <strong>2–7</strong> players
          </li>
          <li>
            <strong>Free</strong>, no downloads
          </li>
        </ul>
      </section>

      <section id="games" className={classes.grid}>
        {games.map((game, index) => (
          <Link
            key={game.key}
            href={game.href}
            className={classes.card}
            style={
              {
                "--accent": game.accent,
                "--delay": `${index * 70}ms`,
              } as React.CSSProperties
            }
          >
            <div className={classes.art}>
              <GameArt game={game.key} />
              <span className={classes.players}>{game.players}</span>
            </div>
            <div className={classes.body}>
              <h2 className={classes.cardTitle}>{game.title}</h2>
              <p className={classes.tagline}>{game.tagline}</p>
              <p className={classes.description}>{game.description}</p>
              <ul className={classes.tags}>
                {game.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className={classes.meta}>
                <span>
                  {game.designer} · {game.length}
                </span>
                <span className={classes.play}>Play →</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className={classes.footer}>
        <p>
          Bots use minimax-family searches over exactly the information a player
          at the table has. Online games run on a tiny Firebase backend, so the
          first move after a quiet spell can take a moment to wake it up.
        </p>
        <p className={classes.credits}>
          GIPF, TZAAR, ZÈRTZ, YINSH, DVONN and LYNGK are part of the GIPF
          project by Kris Burm. Family Inc., High Society and Razzia! are by
          Reiner Knizia. No Thanks! is by Thorsten Gimmler and For Sale by
          Stefan Dorra. This is a fan project for practice and play.
        </p>
      </footer>
    </main>
  );
}
