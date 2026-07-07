"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

function MiniBarChart() {
  const bars = [35, 55, 42, 78, 60, 90, 70, 82];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 4,
        height: 56,
        marginTop: 20,
        padding: "0 2px",
      }}
    >
      {bars.map((h, i) => (
        <motion.div
          key={i}
          style={{
            flex: 1,
            borderRadius: 2,
            background: i === 5 ? "#17171c" : "#e5e7eb",
            transformOrigin: "bottom",
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: "easeOut" }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ height: `${h}%` }} />
        </motion.div>
      ))}
    </div>
  );
}

function ChatBubbles() {
  const msgs = [
    { text: "What's your biggest challenge?", dir: "left" },
    { text: "Finding quality candidates ✓", dir: "right" },
    { text: "Got it! One more question…", dir: "left" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: m.dir === "right" ? 8 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.14 }}
          style={{ display: "flex", justifyContent: m.dir === "right" ? "flex-end" : "flex-start" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: m.dir === "left" ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
              background: m.dir === "right" ? "#17171c" : "#f0f0f0",
              color: m.dir === "right" ? "#fff" : "#17171c",
              fontSize: 12,
              lineHeight: 1.4,
              maxWidth: "82%",
            }}
          >
            {m.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function FieldTypes() {
  const types = [
    { label: "Short text", color: "#edfce9", text: "#003c33" },
    { label: "Multiple choice", color: "#f1f5ff", text: "#071829" },
    { label: "Rating", color: "#fff8f0", text: "#c2410c" },
    { label: "File upload", color: "#fdf4ff", text: "#9b60aa" },
    { label: "Date picker", color: "#f0f9ff", text: "#0369a1" },
    { label: "Dropdown", color: "#f9fafb", text: "#374151" },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 16 }}>
      {types.map((t) => (
        <span
          key={t.label}
          style={{
            padding: "4px 10px",
            borderRadius: 9999,
            background: t.color,
            color: t.text,
            fontSize: 11,
            fontWeight: 500,
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}

type FeatureCardData = {
  tag: string;
  title: string;
  desc: string;
  wide?: boolean;
  decoration?: React.ReactNode;
  icon: React.ReactNode;
};

const FEATURES: FeatureCardData[] = [
  {
    tag: "Builder",
    title: "Drag & drop form builder",
    desc: "Add, reorder, and customise fields visually. What you see is exactly what respondents get.",
    wide: false,
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#17171c" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    tag: "Conversation",
    title: "One question at a time",
    desc: "Typeform-inspired flow shows a single question per step. Completion rates jump up to 3× versus traditional forms.",
    wide: true,
    decoration: <ChatBubbles />,
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#17171c" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    tag: "Analytics",
    title: "Real-time response tracking",
    desc: "Beautiful charts, completion funnel, drop-off analysis — all updating live as responses come in.",
    wide: false,
    decoration: <MiniBarChart />,
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#17171c" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    tag: "Fields",
    title: "14 question types",
    desc: "Short text, long text, multiple choice, rating, NPS, file upload, date, dropdown, and more.",
    wide: false,
    decoration: <FieldTypes />,
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#17171c" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    tag: "Team",
    title: "Collaborate with your team",
    desc: "Share forms with teammates, assign roles, and manage responses together in one workspace.",
    wide: false,
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#17171c" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    tag: "Export",
    title: "Export & API",
    desc: "Download CSV / JSON anytime or connect your stack via the REST API. Your data, always portable.",
    wide: false,
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#17171c" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

function FeatureCard({ f, index }: { f: FeatureCardData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        gridColumn: f.wide ? "span 2" : "span 1",
        background: "#faf9f5",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 28,
        cursor: "default",
      }}
      whileHover={{ borderColor: "#b0b0b8" }}
    >
      <span className="lp-mono-label" style={{ display: "block", marginBottom: 14, fontSize: 11 }}>
        {f.tag}
      </span>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#f5f0e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {f.icon}
        </div>
        <h3 className="lp-feature-heading" style={{ color: "#17171c", paddingTop: 8 }}>
          {f.title}
        </h3>
      </div>

      <p className="lp-body" style={{ fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>

      {f.decoration && <div>{f.decoration}</div>}
    </motion.div>
  );
}

const STATS = [
  { value: "3×", label: "Higher completion" },
  { value: "14", label: "Field types" },
  { value: "60s", label: "To first form" },
  { value: "∞", label: "Free responses" },
];

export function FeaturesSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  return (
    <section
      style={{
        background: "#faf9f5",
        padding: "100px 0 88px",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ maxWidth: 620, marginBottom: 60 }}
        >
          <span className="lp-mono-label" style={{ display: "block", marginBottom: 14, fontSize: 11, color: "#93939f" }}>
            Everything you need
          </span>
          <h2 className="lp-section-heading" style={{ color: "#17171c", marginBottom: 16 }}>
            Build forms people{" "}
            <span style={{ color: "#ff7759" }}>actually want</span> to fill out
          </h2>
          <p className="lp-body-large" style={{ color: "#616161", maxWidth: 480 }}>
            Formly brings together Typeform-style conversation design with
            powerful analytics — in a builder anyone can use.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.tag} f={f} index={i} />
          ))}
        </div>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: 60,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "32px 28px",
                borderLeft: i > 0 ? "1px solid #e5e7eb" : "none",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: "#17171c",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </span>
              <span style={{ fontSize: 13, color: "#93939f", lineHeight: 1.4 }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
