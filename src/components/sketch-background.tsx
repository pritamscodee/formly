"use client";

/* ── Hand-drawn / sketch SVG decorative elements inspired by Claude's organic illustration style ── */

function SquiggleLine({
  color = "#c96442",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.4, ...style }}
    >
      <path
        d="M2 12c8-6 16 6 24 0s16-6 24 0 16 6 24 0 16-6 24 0 16 6 24 0"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function DoodleCircle({
  color = "#141413",
  size = 80,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const r = size / 2 - 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.35, ...style }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="4 6"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r * 0.6}
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="2 8"
        fill="none"
      />
    </svg>
  );
}

function DoodleDots({
  color = "#c96442",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="100"
      height="60"
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.4, ...style }}
    >
      {[
        [10, 10],
        [30, 8],
        [55, 12],
        [80, 6],
        [90, 28],
        [70, 40],
        [45, 35],
        [20, 42],
        [5, 35],
        [40, 52],
        [65, 55],
        [85, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + (i % 3) * 0.4} fill={color} />
      ))}
    </svg>
  );
}

function HandDrawnArrow({
  color = "#141413",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="80"
      height="60"
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.35, ...style }}
    >
      <path
        d="M2 48c12-6 20-18 30-24s18-8 28-10c4-1 10-2 16-2"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 6c4 6 8 8 10 10"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 6c-2 4-4 8-4 10"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Sparkle({
  color = "#c96442",
  size = 40,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.35, ...style }}
    >
      <path
        d={`M${c} 2v${size - 4}M2 ${c}h${size - 4}`}
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d={`M${c * 0.3} ${c * 0.3}l${c * 0.8} ${c * 0.8}M${c * 1.7} ${c * 0.3}l-${c * 0.8} ${c * 0.8}`}
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WavyBand({
  color = "#141413",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path
        d="M2 20c10-8 20 8 30 0s20-8 30 0 20 8 30 0 20-8 30 0 20 8 30 0 20-8 30 0"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M2 30c10-6 20 6 30 0s20-6 30 0 20 6 30 0 20-6 30 0 20 6 30 0"
        stroke={color}
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
    </svg>
  );
}

function Scribble({
  color = "#141413",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path
        d="M10 10c20-8 30 0 40 10s-10 30-20 30S10 40 15 25c3-10 15-15 25-5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function DoodleTriangle({
  color = "#c96442",
  size = 70,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path
        d={`M${s / 2} 4L${s - 4} ${s - 4}H4Z`}
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DoodleCross({
  color = "#141413",
  size = 50,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path
        d={`M${s * 0.2} ${s * 0.2}l${s * 0.6} ${s * 0.6}M${s * 0.8} ${s * 0.2}l-${s * 0.6} ${s * 0.6}`}
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function DoodleZigzag({
  color = "#c96442",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="140"
      height="30"
      viewBox="0 0 140 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path
        d="M2 26l10-20 10 20 10-20 10 20 10-20 10 20 10-20 10 20 10-20 10 20 10-20 10 20"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DoodleCheck({
  color = "#1a7a4c",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="50"
      height="40"
      viewBox="0 0 50 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path
        d="M4 22l14 14 28-30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DoodlePlus({
  color = "#141413",
  size = 36,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.25, ...style }}
    >
      <path
        d={`M${size / 2} ${size * 0.15}v${size * 0.7}M${size * 0.15} ${size / 2}h${size * 0.7}`}
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function DoodleCurve({
  color = "#c96442",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="100"
      height="50"
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.25, ...style }}
    >
      <path
        d="M2 4c12 40 40 44 60 20s20-20 36-12"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Claude-style hand-drawn doodles (loose linework, asterisks, organic strokes) ── */

function ClaudeAsterisk({
  color = "#c96442",
  size = 40,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const s = size;
  const c = s / 2;
  const r = s * 0.38;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.35, ...style }}
    >
      <path d={`M${c - r * 0.3} ${c - r}c${r * 0.4} ${r * 0.3} ${r * 0.2} ${r * 0.8} ${r * 0.3} ${r}`}
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d={`M${c + r * 0.3} ${c - r}c-${r * 0.4} ${r * 0.3} -${r * 0.2} ${r * 0.8} -${r * 0.3} ${r}`}
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d={`M${c - r} ${c - r * 0.3}c${r * 0.5} -${r * 0.1} ${r * 0.8} ${r * 0.2} ${r * 2} ${r * 0.3}`}
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d={`M${c - r} ${c + r * 0.3}c${r * 0.5} ${r * 0.1} ${r * 0.8} -${r * 0.2} ${r * 2} -${r * 0.3}`}
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ClaudeArc({
  color = "#141413",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.25, ...style }}
    >
      <path d="M4 36c14-28 48-30 72-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M4 36c14-26 48-28 72-2" stroke={color} strokeWidth="0.6" strokeLinecap="round" fill="none" opacity={0.4} />
    </svg>
  );
}

function ClaudeSpiral({
  color = "#c96442",
  size = 50,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.25, ...style }}
    >
      <path
        d={`M${s * 0.5} ${s * 0.5}c${s * 0.05} -${s * 0.15} ${s * 0.2} -${s * 0.2} ${s * 0.3} -${s * 0.1}c${s * 0.1} ${s * 0.1} ${s * 0.15} ${s * 0.25} 0 ${s * 0.3}c-${s * 0.15} ${s * 0.05} -${s * 0.3} -${s * 0.05} -${s * 0.35} -${s * 0.2}c-${s * 0.05} -${s * 0.15} ${s * 0.05} -${s * 0.35} ${s * 0.2} -${s * 0.4}c${s * 0.15} -${s * 0.05} ${s * 0.35} ${s * 0.05} ${s * 0.4} ${s * 0.25}`}
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function ClaudeDottedLine({
  color = "#141413",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="120"
      height="20"
      viewBox="0 0 120 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      {[6, 18, 30, 42, 54, 66, 78, 90, 102, 114].map((x, i) => (
        <circle key={i} cx={x} cy={10} r={i === 2 || i === 7 ? 2 : 1.2} fill={color} />
      ))}
    </svg>
  );
}

function ClaudeLeaf({
  color = "#c96442",
  size = 35,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const s = size;
  return (
    <svg
      width={s}
      height={s * 1.4}
      viewBox={`0 0 ${s} ${s * 1.4}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.25, ...style }}
    >
      <path
        d={`M${s * 0.5} ${s * 1.3}c-${s * 0.3} -${s * 0.2} -${s * 0.4} -${s * 0.5} -${s * 0.35} -${s * 0.8}c${s * 0.05} -${s * 0.3} ${s * 0.25} -${s * 0.4} ${s * 0.35} -${s * 0.45}c${s * 0.1} ${s * 0.05} ${s * 0.3} ${s * 0.15} ${s * 0.35} ${s * 0.45}c${s * 0.05} ${s * 0.3} -${s * 0.05} ${s * 0.6} -${s * 0.35} ${s * 0.8}z`}
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path d={`M${s * 0.5} ${s * 0.05}v${s * 0.5}`} stroke={color} strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ClaudeAngle({
  color = "#141413",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.2, ...style }}
    >
      <path d="M6 34c12-6 20-14 26-24" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M6 34h12" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ClaudeDash({
  color = "#c96442",
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="60"
      height="12"
      viewBox="0 0 60 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
    >
      <path d="M2 6h56" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 10" fill="none" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   SketchBackground — composes all elements
   ══════════════════════════════════════════ */
export function SketchBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {/* ── Hero area ── */}
      <SquiggleLine color="#c96442" style={{ top: "12%", left: "5%" }} />
      <SquiggleLine color="#141413" style={{ top: "22%", right: "8%", transform: "rotate(-10deg)" }} />
      <DoodleCircle color="#c96442" size={120} style={{ top: "8%", right: "6%" }} />
      <DoodleDots color="#141413" style={{ top: "35%", left: "3%" }} />
      <HandDrawnArrow color="#141413" style={{ top: "42%", right: "4%" }} />
      <Sparkle color="#c96442" size={50} style={{ top: "5%", left: "15%" }} />
      <DoodleTriangle color="#141413" size={60} style={{ top: "28%", left: "12%" }} />
      <DoodleCross color="#c96442" size={40} style={{ top: "15%", left: "45%" }} />
      <DoodlePlus color="#141413" size={32} style={{ top: "38%", right: "14%" }} />
      <DoodleCurve color="#c96442" style={{ top: "30%", left: "2%" }} />
      <ClaudeAsterisk color="#c96442" size={45} style={{ top: "18%", left: "30%" }} />
      <ClaudeSpiral color="#141413" size={42} style={{ top: "32%", left: "18%" }} />
      <ClaudeLeaf color="#c96442" size={30} style={{ top: "8%", left: "55%" }} />
      <ClaudeAngle color="#141413" style={{ top: "25%", right: "18%" }} />
      <ClaudeDottedLine color="#c96442" style={{ top: "40%", left: "8%" }} />
      <ClaudeArc color="#141413" style={{ top: "15%", right: "25%" }} />
      <ClaudeDash color="#c96442" style={{ top: "35%", left: "50%" }} />

      {/* ── Features area ── */}
      <WavyBand color="#141413" style={{ top: "55%", right: "2%" }} />
      <Scribble color="#c96442" style={{ top: "60%", left: "2%" }} />
      <DoodleCircle color="#141413" size={90} style={{ top: "62%", right: "10%" }} />
      <Sparkle color="#141413" size={35} style={{ top: "48%", left: "10%" }} />
      <SquiggleLine color="#c96442" style={{ top: "70%", left: "6%", transform: "rotate(5deg)" }} />
      <DoodleZigzag color="#141413" style={{ top: "52%", left: "60%" }} />
      <DoodleCheck style={{ top: "58%", right: "5%" }} />
      <DoodleTriangle color="#c96442" size={50} style={{ top: "68%", right: "20%" }} />
      <DoodleDots color="#c96442" style={{ top: "54%", left: "30%" }} />
      <DoodleCross color="#141413" size={45} style={{ top: "73%", left: "20%" }} />
      <DoodlePlus color="#c96442" size={28} style={{ top: "48%", right: "28%" }} />
      <DoodleCurve color="#141413" style={{ top: "65%", right: "2%", transform: "rotate(90deg)" }} />
      <ClaudeAsterisk color="#141413" size={38} style={{ top: "58%", left: "15%" }} />
      <ClaudeArc color="#c96442" style={{ top: "50%", right: "15%" }} />
      <ClaudeSpiral color="#c96442" size={36} style={{ top: "72%", left: "30%" }} />
      <ClaudeLeaf color="#141413" size={28} style={{ top: "55%", left: "45%" }} />
      <ClaudeDash color="#1a7a4c" style={{ top: "66%", left: "8%" }} />
      <ClaudeAngle color="#c96442" style={{ top: "50%", left: "6%" }} />

      {/* ── CTA area ── */}
      <HandDrawnArrow color="#c96442" style={{ top: "80%", right: "6%", transform: "rotate(180deg)" }} />
      <DoodleDots color="#141413" style={{ top: "76%", left: "4%" }} />
      <WavyBand color="#141413" style={{ top: "88%", left: "3%" }} />
      <Scribble color="#c96442" style={{ top: "83%", right: "3%" }} />
      <DoodleCircle color="#141413" size={60} style={{ top: "72%", right: "2%" }} />
      <SquiggleLine color="#141413" style={{ top: "92%", right: "12%", transform: "rotate(15deg)" }} />
      <DoodleTriangle color="#c96442" size={55} style={{ top: "78%", left: "15%" }} />
      <Sparkle color="#c96442" size={30} style={{ top: "86%", left: "8%" }} />
      <DoodleZigzag color="#141413" style={{ top: "74%", left: "50%" }} />
      <DoodleCheck color="#1a7a4c" style={{ top: "90%", left: "50%" }} />
      <DoodleCross color="#c96442" size={35} style={{ top: "82%", left: "35%" }} />
      <DoodlePlus color="#141413" size={30} style={{ top: "95%", right: "20%" }} />
      <DoodleCurve color="#c96442" style={{ top: "76%", left: "28%" }} />
      <ClaudeLeaf color="#c96442" size={32} style={{ top: "85%", left: "5%", transform: "rotate(-15deg)" }} />
      <ClaudeAsterisk color="#141413" size={42} style={{ top: "78%", right: "14%" }} />
      <ClaudeArc color="#c96442" style={{ top: "92%", left: "20%" }} />
      <ClaudeSpiral color="#141413" size={34} style={{ top: "74%", left: "40%" }} />
      <ClaudeDottedLine color="#c96442" style={{ top: "88%", right: "18%" }} />
      <ClaudeAngle color="#1a7a4c" style={{ top: "82%", right: "25%" }} />
      <ClaudeDash color="#141413" style={{ top: "76%", right: "30%" }} />
    </div>
  );
}
