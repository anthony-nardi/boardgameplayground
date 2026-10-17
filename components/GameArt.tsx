/*
 * One illustration per game, all drawn in the same 320×200 frame with a
 * dark panel and the game's accent colour, so the cards read as a set.
 */

export type GameKey =
  | "tzaar"
  | "family-inc"
  | "high-society"
  | "no-thanks"
  | "razzia";

const INK = "#0f131a";
const CREAM = "#f6edd0";

function Frame({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      width="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id={`glow-${accent.replace("#", "")}`} cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill={INK} />
      <rect width="320" height="200" fill={`url(#glow-${accent.replace("#", "")})`} />
      {children}
    </svg>
  );
}

/** A card with a tilt and a soft shadow, used by several illustrations. */
function PlayingCard({
  x,
  y,
  rotate,
  fill,
  stroke,
  children,
}: {
  x: number;
  y: number;
  rotate: number;
  fill: string;
  stroke: string;
  children?: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x="-40" y="-58" width="80" height="116" rx="8" fill="#000" opacity="0.35" transform="translate(4 6)" />
      <rect x="-40" y="-58" width="80" height="116" rx="8" fill={fill} stroke={stroke} strokeWidth="4" />
      {children}
    </g>
  );
}

function Tzaar() {
  // A corner of the hexagonal board with real piece artwork on it.
  const dots: [number, number][] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      dots.push([40 + col * 36 + (row % 2) * 18, 30 + row * 31]);
    }
  }
  return (
    <Frame accent="#4f8fdc">
      <g stroke="#2a3340" strokeWidth="1.5">
        {dots.map(([x, y], i) =>
          i % 8 < 7 ? <line key={`h${i}`} x1={x} y1={y} x2={x + 36} y2={y} /> : null
        )}
        {dots.map(([x, y], i) =>
          i < 40 ? <line key={`d${i}`} x1={x} y1={y} x2={x + 18} y2={y + 31} /> : null
        )}
      </g>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#3b475a" />
      ))}
      <image href="/gold_tzaar.png" x="60" y="36" width="64" height="64" />
      <image href="/blue_tzarra.png" x="150" y="74" width="60" height="60" />
      <image href="/brown_tott.png" x="212" y="30" width="56" height="56" />
      <image href="/blue_tzaar.png" x="96" y="112" width="64" height="64" />
      <image href="/gold_tott.png" x="226" y="118" width="54" height="54" />
    </Frame>
  );
}

function Chip({ x, y, colour, value }: { x: number; y: number; colour: string; value: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="30" fill="#000" opacity="0.35" transform="translate(3 5)" />
      <circle r="30" fill={colour} stroke="#fff" strokeWidth="4" strokeDasharray="12 10" />
      <circle r="19" fill="#fff" opacity="0.92" />
      <text y="7" textAnchor="middle" fontSize="20" fontWeight="800" fill={colour} fontFamily="Georgia, serif">
        {value}
      </text>
    </g>
  );
}

function FamilyInc() {
  return (
    <Frame accent="#2ecc71">
      <Chip x={70} y={120} colour="#c0392b" value="10" />
      <Chip x={125} y={95} colour="#2980b9" value="7" />
      <Chip x={180} y={125} colour="#27ae60" value="3" />
      <Chip x={235} y={92} colour="#8e44ad" value="5" />
      {/* Diamond */}
      <g transform="translate(262 52)">
        <path d="M-26 -6 L-12 -22 L12 -22 L26 -6 L0 26 Z" fill="#000" opacity="0.35" transform="translate(3 5)" />
        <path d="M-26 -6 L-12 -22 L12 -22 L26 -6 L0 26 Z" fill="#7fe6ff" stroke="#e8fbff" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-26 -6 L26 -6 M-12 -22 L0 26 L12 -22 M-12 -22 L-6 -6 M12 -22 L6 -6" stroke="#e8fbff" strokeWidth="2" fill="none" opacity="0.8" />
      </g>
      <text x="40" y="52" fontSize="28" fontWeight="900" fill={CREAM} fontFamily="Georgia, serif" opacity="0.9">
        100
      </text>
      <text x="40" y="70" fontSize="11" fill={CREAM} opacity="0.6" fontFamily="sans-serif" letterSpacing="2">
        TO WIN
      </text>
    </Frame>
  );
}

function HighSociety() {
  return (
    <Frame accent="#d9b44a">
      <PlayingCard x={96} y={116} rotate={-14} fill="#2f6b4f" stroke="#d9b44a">
        <text y="12" textAnchor="middle" fontSize="36" fontWeight="800" fill="#f3e6b0" fontFamily="Georgia, serif">
          25
        </text>
      </PlayingCard>
      <PlayingCard x={160} y={104} rotate={0} fill="#d9b44a" stroke="#6b4226">
        <text y="14" textAnchor="middle" fontSize="40" fontWeight="800" fill="#6b4226" fontFamily="Georgia, serif">
          10
        </text>
        <text y="-34" textAnchor="middle" fontSize="10" fill="#6b4226" fontFamily="sans-serif" letterSpacing="2">
          LUXURY
        </text>
      </PlayingCard>
      <PlayingCard x={226} y={116} rotate={14} fill="#3b5752" stroke="#b4a166">
        <text y="12" textAnchor="middle" fontSize="34" fontWeight="800" fill="#b4a166" fontFamily="Georgia, serif">
          2x
        </text>
      </PlayingCard>
    </Frame>
  );
}

function NoThanks() {
  const hue = (n: number) => `hsl(${210 - ((n - 3) / 32) * 210}, 100%, 50%)`;
  return (
    <Frame accent="#e74c3c">
      <PlayingCard x={88} y={112} rotate={-12} fill={hue(3)} stroke="#fff">
        <text y="14" textAnchor="middle" fontSize="40" fontWeight="800" fill="#000" fontFamily="Georgia, serif">
          3
        </text>
      </PlayingCard>
      <PlayingCard x={160} y={100} rotate={0} fill={hue(22)} stroke="#fff">
        <text y="14" textAnchor="middle" fontSize="40" fontWeight="800" fill="#000" fontFamily="Georgia, serif">
          22
        </text>
      </PlayingCard>
      <PlayingCard x={232} y={112} rotate={12} fill={hue(35)} stroke="#fff">
        <text y="14" textAnchor="middle" fontSize="40" fontWeight="800" fill="#000" fontFamily="Georgia, serif">
          35
        </text>
      </PlayingCard>
      {/* A stack of red chips */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(40 ${168 - i * 7})`}>
          <ellipse rx="22" ry="8" fill="#b71c1c" />
          <ellipse rx="22" ry="8" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" />
        </g>
      ))}
    </Frame>
  );
}

function Razzia() {
  return (
    <Frame accent="#e67e22">
      {/* Jewel card */}
      <PlayingCard x={92} y={112} rotate={-12} fill="#1c1f24" stroke="#c0392b">
        <circle r="22" cy="-6" fill="none" stroke={CREAM} strokeWidth="9" />
        <circle r="7" cx="-16" cy="-20" fill="#c0392b" stroke={INK} strokeWidth="2" />
        <circle r="7" cx="16" cy="-20" fill="#c0392b" stroke={INK} strokeWidth="2" />
        <rect x="-40" y="30" width="80" height="28" rx="6" fill="#c0392b" />
        <text y="50" textAnchor="middle" fontSize="13" fontWeight="700" fill={CREAM} fontFamily="Georgia, serif">
          Bracelet
        </text>
      </PlayingCard>
      {/* Police raid card */}
      <PlayingCard x={160} y={100} rotate={0} fill="#1c1f24" stroke="#e67e22">
        <path d="M0 -40 L24 -30 L22 -2 C20 14 10 24 0 28 C-10 24 -20 14 -22 -2 L-24 -30 Z" fill={CREAM} />
        <path d="M0 -24 L5 -12 L18 -11 L8 -3 L11 10 L0 3 L-11 10 L-8 -3 L-18 -11 L-5 -12 Z" fill={INK} />
        <rect x="-40" y="30" width="80" height="28" rx="6" fill="#e67e22" />
        <text y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill={CREAM} fontFamily="Georgia, serif">
          Police raid
        </text>
      </PlayingCard>
      {/* Money bundle */}
      <g transform="translate(240 118) rotate(10)">
        <rect x="-44" y="-16" width="88" height="44" rx="6" fill="#1b5634" transform="translate(6 10)" />
        <rect x="-44" y="-16" width="88" height="44" rx="6" fill="#2e8b57" stroke="#0f2e1c" strokeWidth="2" />
        <rect x="-44" y="-4" width="88" height="20" fill={CREAM} opacity="0.95" />
        <text y="11" textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily="Georgia, serif">
          16,000
        </text>
      </g>
    </Frame>
  );
}

export default function GameArt({ game }: { game: GameKey }) {
  switch (game) {
    case "tzaar":
      return <Tzaar />;
    case "family-inc":
      return <FamilyInc />;
    case "high-society":
      return <HighSociety />;
    case "no-thanks":
      return <NoThanks />;
    case "razzia":
      return <Razzia />;
  }
}
