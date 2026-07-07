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
      style={{ position: "absolute", opacity: 0.15, ...style }}
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
      style={{ position: "absolute", opacity: 0.08, ...style }}
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
      style={{ position: "absolute", opacity: 0.12, ...style }}
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
        <circle key={i} cx={x} cy={y} r={1.5 + Math.random() * 1} fill={color} />
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
      style={{ position: "absolute", opacity: 0.1, ...style }}
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
      style={{ position: "absolute", opacity: 0.1, ...style }}
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
      style={{ position: "absolute", opacity: 0.06, ...style }}
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
      style={{ position: "absolute", opacity: 0.07, ...style }}
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

/* ══════════════════════════════════════════
   SketchBackground — composes all elements
   ══════════════════════════════════════════ */
export function SketchBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Hero area doodles */}
      <SquiggleLine color="#c96442" style={{ top: "18%", left: "5%" }} />
      <SquiggleLine color="#141413" style={{ top: "22%", right: "8%", transform: "rotate(-10deg)" }} />
      <DoodleCircle color="#c96442" size={120} style={{ top: "10%", right: "6%" }} />
      <DoodleDots color="#141413" style={{ top: "35%", left: "3%" }} />
      <HandDrawnArrow color="#141413" style={{ top: "45%", right: "4%" }} />
      <Sparkle color="#c96442" size={50} style={{ top: "8%", left: "15%" }} />

      {/* Features area doodles */}
      <WavyBand color="#141413" style={{ top: "55%", right: "2%" }} />
      <Scribble color="#c96442" style={{ top: "60%", left: "2%" }} />
      <DoodleCircle color="#141413" size={90} style={{ top: "65%", right: "10%" }} />
      <Sparkle color="#141413" size={35} style={{ top: "50%", left: "10%" }} />
      <SquiggleLine color="#c96442" style={{ top: "70%", left: "6%", transform: "rotate(5deg)" }} />

      {/* CTA area doodles */}
      <HandDrawnArrow color="#c96442" style={{ top: "82%", right: "6%", transform: "rotate(180deg)" }} />
      <DoodleDots color="#141413" style={{ top: "78%", left: "4%" }} />
      <WavyBand color="#141413" style={{ top: "88%", left: "3%" }} />
      <Scribble color="#c96442" style={{ top: "85%", right: "3%" }} />
      <DoodleCircle color="#141413" size={60} style={{ top: "75%", right: "2%" }} />
    </div>
  );
}
