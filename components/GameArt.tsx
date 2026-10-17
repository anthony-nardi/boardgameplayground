/*
 * One illustration per game, all drawn in the same 320×200 frame with a
 * dark panel and the game's accent colour, so the cards read as a set.
 */

export type GameKey =
  | "tzaar"
  | "family-inc"
  | "high-society"
  | "no-thanks"
  | "razzia"
  | "zertz"
  | "yinsh"
  | "dvonn"
  | "gipf"
  | "lyngk"
  | "for-sale"
  | "shangri-la";

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
        <radialGradient
          id={`glow-${accent.replace("#", "")}`}
          cx="30%"
          cy="20%"
          r="80%"
        >
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill={INK} />
      <rect
        width="320"
        height="200"
        fill={`url(#glow-${accent.replace("#", "")})`}
      />
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
      <rect
        x="-40"
        y="-58"
        width="80"
        height="116"
        rx="8"
        fill="#000"
        opacity="0.35"
        transform="translate(4 6)"
      />
      <rect
        x="-40"
        y="-58"
        width="80"
        height="116"
        rx="8"
        fill={fill}
        stroke={stroke}
        strokeWidth="4"
      />
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
          i % 8 < 7 ? (
            <line key={`h${i}`} x1={x} y1={y} x2={x + 36} y2={y} />
          ) : null,
        )}
        {dots.map(([x, y], i) =>
          i < 40 ? (
            <line key={`d${i}`} x1={x} y1={y} x2={x + 18} y2={y + 31} />
          ) : null,
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

function Chip({
  x,
  y,
  colour,
  value,
}: {
  x: number;
  y: number;
  colour: string;
  value: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="30" fill="#000" opacity="0.35" transform="translate(3 5)" />
      <circle
        r="30"
        fill={colour}
        stroke="#fff"
        strokeWidth="4"
        strokeDasharray="12 10"
      />
      <circle r="19" fill="#fff" opacity="0.92" />
      <text
        y="7"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill={colour}
        fontFamily="Georgia, serif"
      >
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
        <path
          d="M-26 -6 L-12 -22 L12 -22 L26 -6 L0 26 Z"
          fill="#000"
          opacity="0.35"
          transform="translate(3 5)"
        />
        <path
          d="M-26 -6 L-12 -22 L12 -22 L26 -6 L0 26 Z"
          fill="#7fe6ff"
          stroke="#e8fbff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M-26 -6 L26 -6 M-12 -22 L0 26 L12 -22 M-12 -22 L-6 -6 M12 -22 L6 -6"
          stroke="#e8fbff"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
      </g>
      <text
        x="40"
        y="52"
        fontSize="28"
        fontWeight="900"
        fill={CREAM}
        fontFamily="Georgia, serif"
        opacity="0.9"
      >
        100
      </text>
      <text
        x="40"
        y="70"
        fontSize="11"
        fill={CREAM}
        opacity="0.6"
        fontFamily="sans-serif"
        letterSpacing="2"
      >
        TO WIN
      </text>
    </Frame>
  );
}

function HighSociety() {
  return (
    <Frame accent="#d9b44a">
      <PlayingCard x={96} y={116} rotate={-14} fill="#2f6b4f" stroke="#d9b44a">
        <text
          y="12"
          textAnchor="middle"
          fontSize="36"
          fontWeight="800"
          fill="#f3e6b0"
          fontFamily="Georgia, serif"
        >
          25
        </text>
      </PlayingCard>
      <PlayingCard x={160} y={104} rotate={0} fill="#d9b44a" stroke="#6b4226">
        <text
          y="14"
          textAnchor="middle"
          fontSize="40"
          fontWeight="800"
          fill="#6b4226"
          fontFamily="Georgia, serif"
        >
          10
        </text>
        <text
          y="-34"
          textAnchor="middle"
          fontSize="10"
          fill="#6b4226"
          fontFamily="sans-serif"
          letterSpacing="2"
        >
          LUXURY
        </text>
      </PlayingCard>
      <PlayingCard x={226} y={116} rotate={14} fill="#3b5752" stroke="#b4a166">
        <text
          y="12"
          textAnchor="middle"
          fontSize="34"
          fontWeight="800"
          fill="#b4a166"
          fontFamily="Georgia, serif"
        >
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
        <text
          y="14"
          textAnchor="middle"
          fontSize="40"
          fontWeight="800"
          fill="#000"
          fontFamily="Georgia, serif"
        >
          3
        </text>
      </PlayingCard>
      <PlayingCard x={160} y={100} rotate={0} fill={hue(22)} stroke="#fff">
        <text
          y="14"
          textAnchor="middle"
          fontSize="40"
          fontWeight="800"
          fill="#000"
          fontFamily="Georgia, serif"
        >
          22
        </text>
      </PlayingCard>
      <PlayingCard x={232} y={112} rotate={12} fill={hue(35)} stroke="#fff">
        <text
          y="14"
          textAnchor="middle"
          fontSize="40"
          fontWeight="800"
          fill="#000"
          fontFamily="Georgia, serif"
        >
          35
        </text>
      </PlayingCard>
      {/* A stack of red chips */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(40 ${168 - i * 7})`}>
          <ellipse rx="22" ry="8" fill="#b71c1c" />
          <ellipse
            rx="22"
            ry="8"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
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
        <circle
          r="7"
          cx="-16"
          cy="-20"
          fill="#c0392b"
          stroke={INK}
          strokeWidth="2"
        />
        <circle
          r="7"
          cx="16"
          cy="-20"
          fill="#c0392b"
          stroke={INK}
          strokeWidth="2"
        />
        <rect x="-40" y="30" width="80" height="28" rx="6" fill="#c0392b" />
        <text
          y="50"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={CREAM}
          fontFamily="Georgia, serif"
        >
          Bracelet
        </text>
      </PlayingCard>
      {/* Police raid card */}
      <PlayingCard x={160} y={100} rotate={0} fill="#1c1f24" stroke="#e67e22">
        <path
          d="M0 -40 L24 -30 L22 -2 C20 14 10 24 0 28 C-10 24 -20 14 -22 -2 L-24 -30 Z"
          fill={CREAM}
        />
        <path
          d="M0 -24 L5 -12 L18 -11 L8 -3 L11 10 L0 3 L-11 10 L-8 -3 L-18 -11 L-5 -12 Z"
          fill={INK}
        />
        <rect x="-40" y="30" width="80" height="28" rx="6" fill="#e67e22" />
        <text
          y="50"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={CREAM}
          fontFamily="Georgia, serif"
        >
          Police raid
        </text>
      </PlayingCard>
      {/* Money bundle */}
      <g transform="translate(240 118) rotate(10)">
        <rect
          x="-44"
          y="-16"
          width="88"
          height="44"
          rx="6"
          fill="#1b5634"
          transform="translate(6 10)"
        />
        <rect
          x="-44"
          y="-16"
          width="88"
          height="44"
          rx="6"
          fill="#2e8b57"
          stroke="#0f2e1c"
          strokeWidth="2"
        />
        <rect
          x="-44"
          y="-4"
          width="88"
          height="20"
          fill={CREAM}
          opacity="0.95"
        />
        <text
          y="11"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={INK}
          fontFamily="Georgia, serif"
        >
          16,000
        </text>
      </g>
    </Frame>
  );
}

function Zertz() {
  // A shrinking hex of rings with three marbles mid-jump.
  const S = 34;
  const rings: [number, number][] = [];
  const rows = [3, 4, 5, 4, 3];
  rows.forEach((n, row) => {
    for (let i = 0; i < n; i++) {
      rings.push([160 + (i - (n - 1) / 2) * S, 44 + row * S * 0.866]);
    }
  });
  const marble = (x: number, y: number, a: string, b: string) => (
    <g key={`${x}-${y}`}>
      <circle cx={x + 2} cy={y + 3} r="11" fill="#000" opacity="0.45" />
      <circle cx={x} cy={y} r="11" fill={`url(#zertz-${a})`} stroke="#111" />
      <circle cx={x - 4} cy={y - 4} r="3" fill={b} opacity="0.8" />
    </g>
  );
  return (
    <Frame accent="#9b59b6">
      <defs>
        <radialGradient id="zertz-w" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#b9b9b9" />
        </radialGradient>
        <radialGradient id="zertz-g" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#b0b0b0" />
          <stop offset="100%" stopColor="#4f4f4f" />
        </radialGradient>
        <radialGradient id="zertz-b" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
      </defs>
      {rings.map(([x, y], i) =>
        i === 2 || i === 18 ? null : (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="13"
            fill="none"
            stroke="#8d6e63"
            strokeWidth="5"
          />
        ),
      )}
      {marble(160, 103, "w", "#fff")}
      {marble(126, 103, "b", "#777")}
      {marble(194, 103, "g", "#ddd")}
      {marble(143, 73, "b", "#777")}
      <path
        d="M126 92 Q143 60 160 92"
        fill="none"
        stroke="#ffd86b"
        strokeWidth="3"
        strokeDasharray="5 4"
      />
      <path
        d="M160 92 L156 86 M160 92 L166 88"
        stroke="#ffd86b"
        strokeWidth="3"
      />
    </Frame>
  );
}

function Yinsh() {
  // A patch of the lined board: rings, a row of five markers, one ring mid-move.
  const S = 36;
  const H = S * 0.866;
  const pt = (x: number, y: number): [number, number] => [
    160 + S * (x + y / 2) - S * 2.5,
    44 + H * y,
  ];
  const lines: [number, number, number, number][] = [];
  for (let y = 0; y <= 3; y++) {
    const [ax, ay] = pt(0, y);
    const [bx, by] = pt(5, y);
    lines.push([ax, ay, bx, by]);
  }
  for (let x = 0; x <= 5; x++) {
    const [ax, ay] = pt(x, 0);
    const [bx, by] = pt(x - 1, 3);
    lines.push([ax, ay, bx, by]);
    const [cx, cy] = pt(x, 0);
    const [dx, dy] = pt(x + 1, 3);
    lines.push([cx, cy, dx, dy]);
  }
  const marker = (x: number, y: number, white: boolean) => {
    const [px, py] = pt(x, y);
    return (
      <g key={`m${x}-${y}`}>
        <circle cx={px + 1} cy={py + 2} r="9" fill="#000" opacity="0.4" />
        <circle
          cx={px}
          cy={py}
          r="9"
          fill={white ? "#f1f1f1" : "#1a1a1a"}
          stroke={white ? "#999" : "#000"}
        />
      </g>
    );
  };
  const ring = (x: number, y: number, white: boolean, glow = false) => {
    const [px, py] = pt(x, y);
    return (
      <g key={`r${x}-${y}`}>
        <circle
          cx={px + 1}
          cy={py + 3}
          r="14"
          fill="none"
          stroke="#000"
          strokeWidth="6"
          opacity="0.4"
        />
        <circle
          cx={px}
          cy={py}
          r="14"
          fill="none"
          stroke={glow ? "#ffd86b" : white ? "#f1f1f1" : "#1a1a1a"}
          strokeWidth="6"
        />
        <circle
          cx={px}
          cy={py}
          r="14"
          fill="none"
          stroke="#777"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>
    );
  };
  return (
    <Frame accent="#4f8fdc">
      {lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#5b5f6a"
          strokeWidth="1.5"
        />
      ))}
      {[0, 1, 2, 3, 4].map((x) => marker(x, 2, true))}
      {marker(2, 1, false)}
      {marker(4, 0, false)}
      {marker(1, 3, false)}
      {ring(5, 1, false)}
      {ring(0, 1, false)}
      {ring(3, 0, true)}
      {ring(5, 2, true, true)}
      <path
        d={`M${pt(5, 2)[0] - 16} ${pt(5, 2)[1]} L${pt(1, 2)[0] + 14} ${pt(1, 2)[1]}`}
        fill="none"
        stroke="#ffd86b"
        strokeWidth="3"
        strokeDasharray="5 4"
      />
      <path
        d={`M${pt(5, 2)[0] - 16} ${pt(5, 2)[1]} l-8 -5 M${pt(5, 2)[0] - 16} ${pt(5, 2)[1]} l-8 5`}
        stroke="#ffd86b"
        strokeWidth="3"
      />
    </Frame>
  );
}

function Dvonn() {
  // A strip of hex cells with stacks of discs, one red DVONN piece, and a stack mid-jump.
  const S = 40;
  const cell = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 30);
      return `${(cx + S * 0.55 * Math.cos(a)).toFixed(1)},${(cy + S * 0.55 * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  const rows: [number, number, number][] = [
    [0, 2, 6],
    [1, 1, 6],
    [2, 1, 5],
  ];
  const pt = (x: number, y: number): [number, number] => [
    40 + S * (x + y / 2),
    52 + S * 0.866 * y,
  ];
  const cells: [number, number][] = [];
  for (const [y, from, to] of rows)
    for (let x = from; x <= to; x++) cells.push(pt(x, y));
  const stack = (x: number, y: number, colours: string[], glow = false) => (
    <g key={`${x}-${y}`}>
      <circle cx={x + 2} cy={y + 3} r="13" fill="#000" opacity="0.45" />
      {colours.map((c, i) => (
        <circle
          key={i}
          cx={x}
          cy={y - i * 3}
          r="13"
          fill={c}
          stroke={
            glow && i === colours.length - 1
              ? "#ffd86b"
              : c === "#f1f1f1"
                ? "#8a8a8a"
                : "#000"
          }
          strokeWidth={glow && i === colours.length - 1 ? 3 : 1.5}
        />
      ))}
      {colours.length > 1 && (
        <text
          x={x}
          y={y - (colours.length - 1) * 3 + 4}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={colours[colours.length - 1] === "#f1f1f1" ? "#222" : "#fff"}
        >
          {colours.length}
        </text>
      )}
    </g>
  );
  const W = "#f1f1f1";
  const B = "#1a1a1a";
  const R = "#d9342b";
  return (
    <Frame accent="#e0583f">
      {cells.map(([x, y], i) => (
        <polygon
          key={i}
          points={cell(x, y)}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
        />
      ))}
      {stack(...pt(3, 0), [W])}
      {stack(...pt(5, 0), [B, B])}
      {stack(...pt(2, 1), [R])}
      {stack(...pt(3, 1), [W, B, W], true)}
      {stack(...pt(5, 1), [B])}
      {stack(...pt(6, 1), [W])}
      {stack(...pt(2, 2), [B])}
      {stack(...pt(4, 2), [R, W])}
      <path
        d={`M${pt(3, 1)[0] + 14} ${pt(3, 1)[1] - 14} Q${pt(4.5, 1)[0]} ${pt(4, 1)[1] - 50} ${pt(6, 1)[0] - 12} ${pt(6, 1)[1] - 14}`}
        fill="none"
        stroke="#ffd86b"
        strokeWidth="3"
        strokeDasharray="5 4"
      />
      <path
        d={`M${pt(6, 1)[0] - 12} ${pt(6, 1)[1] - 14} l-9 -3 M${pt(6, 1)[0] - 12} ${pt(6, 1)[1] - 14} l-1 9`}
        stroke="#ffd86b"
        strokeWidth="3"
      />
    </Frame>
  );
}

function Gipf() {
  // A hexagon of lines with dots around it, pieces on the lines and one being pushed in.
  const S = 26;
  const pt = (x: number, y: number): [number, number] => [
    160 + S * (x - 4 + (y - 4) / 2),
    100 + S * 0.866 * (y - 4),
  ];
  const ring = (x: number, y: number) =>
    Math.max(Math.abs(x - 4), Math.abs(y - 4), Math.abs(x + y - 8));
  const spots: [number, number][] = [];
  const dots: [number, number][] = [];
  for (let y = 0; y <= 8; y++) {
    for (let x = 0; x <= 8; x++) {
      const r = ring(x, y);
      if (r <= 3) spots.push([x, y]);
      else if (r === 4) dots.push([x, y]);
    }
  }
  const axes: [number, number][] = [
    [1, 0],
    [0, 1],
    [1, -1],
  ];
  const lines: [number, number, number, number][] = [];
  for (const [dx, dy] of axes) {
    for (const [x, y] of spots) {
      if (ring(x - dx, y - dy) <= 3) continue;
      let ex = x;
      let ey = y;
      while (ring(ex + dx, ey + dy) <= 3) {
        ex += dx;
        ey += dy;
      }
      const [ax, ay] = pt(x - dx, y - dy);
      const [bx, by] = pt(ex + dx, ey + dy);
      lines.push([ax, ay, bx, by]);
    }
  }
  const piece = (x: number, y: number, white: boolean, glow = false) => {
    const [px, py] = pt(x, y);
    return (
      <g key={`${x}-${y}`}>
        <circle cx={px + 1.5} cy={py + 2} r="9" fill="#000" opacity="0.45" />
        <circle
          cx={px}
          cy={py}
          r="9"
          fill={white ? "#f1f1f1" : "#1a1a1a"}
          stroke={glow ? "#ffd86b" : white ? "#8a8a8a" : "#000"}
          strokeWidth={glow ? 2.5 : 1}
        />
      </g>
    );
  };
  return (
    <Frame accent="#f2c14e">
      {lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
        />
      ))}
      {dots.map(([x, y]) => {
        const [px, py] = pt(x, y);
        return (
          <circle
            key={`d${x}-${y}`}
            cx={px}
            cy={py}
            r="3"
            fill="#f6edd0"
            opacity="0.8"
          />
        );
      })}
      {piece(7, 1, true)}
      {piece(7, 4, false)}
      {piece(4, 7, true)}
      {piece(1, 7, false)}
      {piece(1, 4, true)}
      {piece(4, 1, false)}
      {piece(2, 4, true)}
      {piece(3, 4, true)}
      {piece(4, 4, true, true)}
      {piece(5, 4, false)}
      {piece(0, 4, true, true)}
      <path
        d={`M${pt(0, 4)[0] + 11} ${pt(0, 4)[1]} L${pt(1, 4)[0] - 12} ${pt(1, 4)[1]}`}
        stroke="#ffd86b"
        strokeWidth="3"
      />
      <path
        d={`M${pt(1, 4)[0] - 12} ${pt(1, 4)[1]} l-7 -4 M${pt(1, 4)[0] - 12} ${pt(1, 4)[1]} l-7 4`}
        stroke="#ffd86b"
        strokeWidth="3"
      />
    </Frame>
  );
}

function Lyngk() {
  // Five colours and a joker on a lined board, one stack of five mid-build.
  const S = 36;
  const pt = (x: number, y: number): [number, number] => [
    160 + S * (x - 3 + (y - 2) / 2),
    100 + S * 0.866 * (y - 2),
  ];
  const rows: [number, number, number][] = [
    [0, 2, 5],
    [1, 1, 5],
    [2, 0, 6],
    [3, 0, 5],
    [4, 0, 4],
  ];
  const spots: [number, number][] = [];
  for (const [y, from, to] of rows)
    for (let x = from; x <= to; x++) spots.push([x, y]);
  const C = {
    R: "#d9342b",
    B: "#2f6fd6",
    G: "#2e9e5b",
    K: "#1a1a1a",
    I: "#f3e9d2",
    J: "#ffffff",
  };
  const stack = (x: number, y: number, colours: string[], glow = false) => {
    const [px, py] = pt(x, y);
    return (
      <g key={`${x}-${y}`}>
        <circle cx={px + 2} cy={py + 3} r="12" fill="#000" opacity="0.45" />
        {colours.map((c, i) => (
          <circle
            key={i}
            cx={px}
            cy={py - i * 3}
            r="12"
            fill={c}
            stroke={
              glow && i === colours.length - 1 ? "#ffd86b" : "rgba(0,0,0,0.6)"
            }
            strokeWidth={glow && i === colours.length - 1 ? 3 : 1}
          />
        ))}
        {colours.length > 1 && (
          <text
            x={px}
            y={py - (colours.length - 1) * 3 + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={
              colours[colours.length - 1] === C.I ||
              colours[colours.length - 1] === C.J
                ? "#222"
                : "#fff"
            }
          >
            {colours.length}
          </text>
        )}
      </g>
    );
  };
  return (
    <Frame accent="#2e9e5b">
      {spots.map(([x, y], i) => {
        const [px, py] = pt(x, y);
        return (
          <circle key={i} cx={px} cy={py} r="3" fill="rgba(255,255,255,0.35)" />
        );
      })}
      {[0, 1, 2, 3, 4].map((y) => {
        const row = rows[y];
        const [ax, ay] = pt(row[1], y);
        const [bx, by] = pt(row[2], y);
        return (
          <line
            key={y}
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
        );
      })}
      {stack(2, 0, [C.B])}
      {stack(4, 0, [C.J])}
      {stack(1, 1, [C.G, C.R])}
      {stack(5, 1, [C.K])}
      {stack(0, 2, [C.I])}
      {stack(3, 2, [C.K, C.I, C.B, C.G], true)}
      {stack(6, 2, [C.R])}
      {stack(1, 3, [C.R, C.G], true)}
      {stack(4, 3, [C.B])}
      {stack(2, 4, [C.G])}
      {stack(4, 4, [C.I, C.K])}
      <path
        d={`M${pt(1, 3)[0] + 12} ${pt(1, 3)[1] - 10} Q${pt(2, 2.5)[0]} ${pt(2, 2)[1] - 40} ${pt(3, 2)[0] - 10} ${pt(3, 2)[1] - 22}`}
        fill="none"
        stroke="#ffd86b"
        strokeWidth="3"
        strokeDasharray="5 4"
      />
      <path
        d={`M${pt(3, 2)[0] - 10} ${pt(3, 2)[1] - 22} l-9 -2 M${pt(3, 2)[0] - 10} ${pt(3, 2)[1] - 22} l-3 9`}
        stroke="#ffd86b"
        strokeWidth="3"
      />
    </Frame>
  );
}

function ForSale() {
  // A row of property cards rising from a cardboard box to a tower, and a cheque fanned beside them.
  const card = (
    x: number,
    y: number,
    n: number,
    sky: string,
    children: React.ReactNode,
  ) => (
    <g key={n} transform={`translate(${x} ${y})`}>
      <rect
        x="2"
        y="3"
        width="62"
        height="86"
        rx="6"
        fill="#000"
        opacity="0.4"
      />
      <rect
        width="62"
        height="86"
        rx="6"
        fill="#f6f1e6"
        stroke="#3a3a3a"
        strokeWidth="1.5"
      />
      <rect x="4" y="4" width="54" height="62" rx="4" fill={sky} />
      <rect x="4" y="54" width="54" height="12" fill="#4f8f4a" />
      {children}
      <rect x="4" y="4" width="18" height="13" rx="3" fill="rgba(0,0,0,0.55)" />
      <text
        x="13"
        y="14"
        textAnchor="middle"
        fontSize="9"
        fontWeight="800"
        fill="#fff"
      >
        {n}
      </text>
      <text
        x="31"
        y="79"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="#3a3a3a"
      >
        No. {n}
      </text>
    </g>
  );
  return (
    <Frame accent="#e8a33d">
      {card(
        22,
        60,
        3,
        "#e5c89a",
        <rect
          x="18"
          y="40"
          width="26"
          height="16"
          fill="#c89b62"
          stroke="#7a5a2e"
        />,
      )}
      {card(
        70,
        48,
        12,
        "#d7ecff",
        <g>
          <rect
            x="16"
            y="36"
            width="30"
            height="20"
            fill="#f1e2c6"
            stroke="#6b4e2e"
          />
          <path d="M13 37 L31 22 L49 37 Z" fill="#b8482f" stroke="#6b4e2e" />
          <rect x="28" y="44" width="7" height="12" fill="#6b4e2e" />
        </g>,
      )}
      {card(
        118,
        36,
        21,
        "#9fb0e3",
        <g>
          <rect
            x="10"
            y="32"
            width="42"
            height="24"
            fill="#f4efe4"
            stroke="#3f3a52"
          />
          <path d="M8 33 L31 18 L54 33 Z" fill="#8c3b3b" stroke="#3f3a52" />
          {[14, 22, 38, 46].map((x) => (
            <rect
              key={x}
              x={x}
              y="36"
              width="4"
              height="20"
              fill="#e0d6c2"
              stroke="#3f3a52"
              strokeWidth="0.8"
            />
          ))}
        </g>,
      )}
      {card(
        166,
        24,
        30,
        "#1b1f3b",
        <g>
          <rect
            x="22"
            y="14"
            width="18"
            height="42"
            fill="#5d6b8f"
            stroke="#1b1f3b"
          />
          <rect
            x="14"
            y="34"
            width="8"
            height="22"
            fill="#46527a"
            stroke="#1b1f3b"
          />
          <rect
            x="40"
            y="28"
            width="8"
            height="28"
            fill="#46527a"
            stroke="#1b1f3b"
          />
          {Array.from({ length: 5 }, (_, r) => (
            <rect
              key={r}
              x="26"
              y={18 + r * 7}
              width="10"
              height="3"
              fill={r % 2 ? "#ffe9a3" : "#9fb6ff"}
            />
          ))}
          <circle cx="12" cy="12" r="1.2" fill="#fff" />
          <circle cx="50" cy="10" r="1" fill="#fff" />
        </g>,
      )}
      <g transform="translate(228 70) rotate(8)">
        <rect
          x="2"
          y="3"
          width="62"
          height="86"
          rx="6"
          fill="#000"
          opacity="0.4"
        />
        <rect
          width="62"
          height="86"
          rx="6"
          fill="#dfeedd"
          stroke="#3a3a3a"
          strokeWidth="1.5"
        />
        <rect
          x="5"
          y="5"
          width="52"
          height="76"
          rx="4"
          fill="none"
          stroke="#4f8a5a"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <text
          x="31"
          y="46"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#2f5e3a"
        >
          $15,000
        </text>
        <path
          d="M12 68 q6 -8 12 0 t12 0"
          fill="none"
          stroke="#2f5e3a"
          strokeWidth="1.2"
        />
      </g>
      <text
        x="160"
        y="178"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#ffd86b"
        letterSpacing="2"
      >
        GOING ONCE
      </text>
    </Frame>
  );
}

function ShangriLa() {
  // Mountain villages joined by rope bridges, one of them just broken.
  const villages: [number, number][] = [
    [160, 36],
    [96, 76],
    [224, 76],
    [60, 130],
    [136, 118],
    [196, 124],
    [260, 132],
    [110, 170],
    [210, 172],
  ];
  const bridges: [number, number, boolean][] = [
    [0, 1, true],
    [0, 2, true],
    [1, 3, true],
    [1, 4, true],
    [2, 5, true],
    [2, 6, true],
    [3, 4, false],
    [4, 5, true],
    [5, 6, true],
    [3, 7, true],
    [4, 7, true],
    [5, 8, true],
    [6, 8, true],
    [7, 8, false],
  ];
  const clans = ["#d9342b", "#2f6fd6", "#e8c23a", "#8e5ad6"];
  return (
    <Frame accent="#c9a46b">
      <path
        d="M0 200 L60 120 L110 170 L160 90 L220 160 L270 110 L320 200 Z"
        fill="rgba(255,255,255,0.05)"
      />
      {bridges.map(([p, q, standing], i) => {
        const [ax, ay] = villages[p];
        const [bx, by] = villages[q];
        return (
          <line
            key={i}
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke={standing ? "#c9a46b" : "rgba(255,255,255,0.18)"}
            strokeWidth={standing ? 3 : 1.5}
            strokeDasharray={standing ? "5 3" : "2 4"}
            strokeLinecap="round"
          />
        );
      })}
      {villages.map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x - 17}
            y={y - 11}
            width="34"
            height="22"
            rx="4"
            fill="#000"
            opacity="0.4"
            transform="translate(1.5 2)"
          />
          <rect
            x={x - 17}
            y={y - 11}
            width="34"
            height="22"
            rx="4"
            fill={i === 3 ? "#6f6a60" : "#f1e4c6"}
            stroke="#3a2a1a"
            strokeWidth="1.2"
          />
          {[0, 1, 2, 3].map((k) => (
            <circle
              key={k}
              cx={x - 12 + k * 8}
              cy={y - 4}
              r="3"
              fill={(i + k) % 3 === 0 ? clans[(i + k) % 4] : "rgba(0,0,0,0.12)"}
              stroke="#222"
              strokeWidth="0.6"
            />
          ))}
          {[0, 1, 2].map((k) => (
            <circle
              key={k}
              cx={x - 8 + k * 8}
              cy={y + 5}
              r="3"
              fill={
                (i + k) % 2 === 0 ? clans[(i + k + 1) % 4] : "rgba(0,0,0,0.12)"
              }
              stroke="#222"
              strokeWidth="0.6"
            />
          ))}
          {i === 3 && (
            <circle
              cx={x + 13}
              cy={y - 8}
              r="3.5"
              fill="#9fb8c8"
              stroke="#2c3e50"
            />
          )}
        </g>
      ))}
      <path
        d="M118 128 Q140 100 162 118"
        fill="none"
        stroke="#ffd86b"
        strokeWidth="3"
        strokeDasharray="5 4"
      />
      <path
        d="M162 118 l-8 -2 M162 118 l-2 8"
        stroke="#ffd86b"
        strokeWidth="3"
      />
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
    case "zertz":
      return <Zertz />;
    case "yinsh":
      return <Yinsh />;
    case "dvonn":
      return <Dvonn />;
    case "gipf":
      return <Gipf />;
    case "lyngk":
      return <Lyngk />;
    case "for-sale":
      return <ForSale />;
    case "shangri-la":
      return <ShangriLa />;
  }
}
