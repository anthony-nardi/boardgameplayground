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
    key: "acquire",
    title: "Acquire",
    tagline: "Build chains. Buy shares. Cash in the merger.",
    description:
      "Sid Sackson's classic. Tiles grow hotel chains across the board, you buy their stock, and when a big chain swallows a small one the majority and minority holders collect. Call the end when a chain is huge, and the richest wins.",
    players: "2–6 players",
    designer: "Sid Sackson",
    length: "60 min",
    tags: ["Economic", "Planner bot", "Online"],
    accent: "#1fb6c9",
    href: `${HIGH_SOCIETY_URL}/acquire`,
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
  {
    key: "clans",
    title: "Clans",
    tagline: "Herd the huts. Hide your colours.",
    description:
      "Leo Colovini's game of secret clans. Move whole groups of huts until a group stands alone and becomes a village; every clan in it scores its size, with bonuses and bans that shift each epoch. You lead one clan in secret, so help it quietly and starve the rest.",
    players: "2–4 players",
    designer: "Leo Colovini",
    length: "30 min",
    tags: ["Hidden roles", "Judgement bot", "Online"],
    accent: "#6b8f3a",
    href: `${HIGH_SOCIETY_URL}/clans`,
  },
  {
    key: "condottiere",
    title: "Condottiere",
    tagline: "Hire mercenaries. Take Italy.",
    description:
      "Dominique Ehrhard's card battles for the cities of Renaissance Italy. Play mercenaries into your line, turn the fight with winter, drummers and bishops, and know when to pass. Five regions, or three that touch, and you rule.",
    players: "2–6 players",
    designer: "Dominique Ehrhard",
    length: "45 min",
    tags: ["Card battles", "Judgement bot", "Online"],
    accent: "#8c2f2f",
    href: `${HIGH_SOCIETY_URL}/condottiere`,
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
    key: "ecosystem",
    title: "Ecosystem",
    tagline: "Draft a habitat, four by five.",
    description:
      "Matt Simpson's card drafter. Keep one, place it, pass the rest: bees by meadows, trout by streams, foxes far from wolves. Twenty cards make your ecosystem, and the more kinds of life that score in it, the bigger the bonus.",
    players: "2–6 players",
    designer: "Matt Simpson",
    length: "20 min",
    tags: ["Drafting", "Judgement bot", "Online"],
    accent: "#6fb24f",
    href: `${HIGH_SOCIETY_URL}/ecosystem`,
  },
  {
    key: "coral-reef",
    title: "Ecosystem: Coral Reef",
    tagline: "Draft a reef, keep the food web fed.",
    description:
      "The Great Barrier Reef edition of Ecosystem. Keep one, place it, pass the rest: groupers by krill, clownfish by coral and plankton, eels lurking by coral, whales turning a neighbour facedown. Producers, prey and predators each score, and the weakest of the three is added again.",
    players: "2–6 players",
    designer: "Matt Simpson & Steve Schlepphorst",
    length: "20 min",
    tags: ["Drafting", "Judgement bot", "Online"],
    accent: "#4fb3c9",
    href: `${HIGH_SOCIETY_URL}/coral-reef`,
  },
  {
    key: "savanna",
    title: "Ecosystem: Savanna",
    tagline: "Draft the Serengeti. Hunters flip their prey.",
    description:
      "The Serengeti edition of Ecosystem. Keep one, place it, pass the rest: giraffes by trees, zebras on grassland, gazelles in numbers, cheetahs and lions flipping prey at scoring time for the hyenas and vultures to feed on.",
    players: "2–6 players",
    designer: "Matt Simpson, Steve Schlepphorst & Daniel Dávalos",
    length: "20 min",
    tags: ["Drafting", "Judgement bot", "Online"],
    accent: "#e8a04a",
    href: `${HIGH_SOCIETY_URL}/savanna`,
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
    key: "fuji-flush",
    title: "Fuji Flush",
    tagline: "Push it through or flush it.",
    description:
      "Friedemann Friese's ten-minute card game. Lay a card in front of you: a higher number flushes it down the drain, an equal one joins forces with it. Survive a round and the card is gone for good. First to empty their hand wins, teams and all.",
    players: "3–8 players",
    designer: "Friedemann Friese",
    length: "10 min",
    tags: ["Cards", "Judgement bot", "Online"],
    accent: "#4f78c2",
    href: `${HIGH_SOCIETY_URL}/fuji-flush`,
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
    key: "medici",
    title: "Medici",
    tagline: "Three days of auctions on the Florentine docks.",
    description:
      "Knizia's classic: the auctioneer turns over one to three cards, everyone bids once with the auctioneer last, and the buyer loads the lot. Each evening the richest ships and the biggest buyers of each commodity are paid, and your florins are your score.",
    players: "2–6 players",
    designer: "Reiner Knizia",
    length: "45 min",
    tags: ["Auction", "Judgement bot", "Online"],
    accent: "#f2c25c",
    href: `${HIGH_SOCIETY_URL}/medici`,
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
    key: "push",
    title: "PUSH",
    tagline: "One more card. Just one more.",
    description:
      "Turn cards over into three columns, never two of a number or a colour together, and stop before one fits nowhere. Take a column, let the others take the rest, and protect your colours before the die comes for them.",
    players: "2–6 players",
    designer: "Prospero Hall",
    length: "20 min",
    tags: ["Push your luck", "Judgement bot", "Online"],
    accent: "#e8c23a",
    href: `${HIGH_SOCIETY_URL}/push`,
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
    key: "ride-the-rails",
    title: "Ride the Rails",
    tagline: "Buy the share. Lay the track. Sell the ticket.",
    description:
      "John Bohrer's hour-long train game. Six railroads open across a hex map of America. Each round take a share, lay track, and carry a passenger city to city; every railroad it rides pays its shareholders. Richest after six rounds wins.",
    players: "3–5 players",
    designer: "John Bohrer",
    length: "60 min",
    tags: ["Trains", "Economic", "Online"],
    accent: "#2e8b57",
    href: `${HIGH_SOCIETY_URL}/ride-the-rails`,
  },
  {
    key: "tigris",
    title: "Tigris & Euphrates",
    tagline: "Four spheres. The weakest counts.",
    description:
      "Reiner Knizia's civilisation classic. Seat your king, priest, farmer and trader beside temples, grow kingdoms along the two rivers, fight revolts with temples and wars with supporters, raise monuments and gather treasures. At the end only your lowest sphere counts.",
    players: "2–4 players",
    designer: "Reiner Knizia",
    length: "90 min",
    tags: ["Strategy", "Judgement bot", "Online"],
    accent: "#c9a24a",
    href: `${HIGH_SOCIETY_URL}/tigris`,
  },
  {
    key: "twixt",
    title: "TwixT",
    tagline: "Knight's moves, border to border.",
    description:
      "Alex Randolph's connection classic. Peg holes on a 24 by 24 board; pegs a knight's move apart link up, and links never cross. Red joins top to bottom, Black left to right, with the swap rule to keep the first move honest.",
    players: "2 players",
    designer: "Alex Randolph",
    length: "30 min",
    tags: ["Connection", "Search bot", "Online"],
    accent: "#d64545",
    href: `${HIGH_SOCIETY_URL}/twixt`,
  },
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
          Twenty-four board games.
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
          <Link href="/stats" className={classes.secondary}>
            Statistics
          </Link>
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
            <strong>24</strong> games
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
          Stefan Dorra, Ride the Rails by John Bohrer. This is a fan project for
          practice and play.
        </p>
      </footer>
    </main>
  );
}
