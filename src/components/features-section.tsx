"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageCircle2, Grid, Chart2, LinkCircle,
  Download, Envelope, CheckCircle,
} from "reicon-react";

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
    { text: "What's your biggest challenge?", dir: "left" as const },
    { text: "Finding quality candidates ✓", dir: "right" as const },
    { text: "Got it! One more question…", dir: "left" as const },
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

function ChannelCards() {
  const channels = [
    { name: "Gmail", color: "#EA4335" },
    { name: "WhatsApp", color: "#25D366" },
    { name: "QR Code", color: "#17171c" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
      {channels.map((ch, i) => (
        <motion.div
          key={ch.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: 11,
            fontWeight: 500,
            color: "#17171c",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: ch.color }} />
          {ch.name}
        </motion.div>
      ))}
    </div>
  );
}

function ExportCards() {
  const formats = [
    { label: "CSV", desc: "Spreadsheet" },
    { label: "PDF", desc: "Report" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      {formats.map((f, i) => (
        <motion.div
          key={f.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: 12,
            fontWeight: 500,
            color: "#17171c",
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600 }}>{f.label}</div>
          <div style={{ fontSize: 10, color: "#93939f" }}>{f.desc}</div>
        </motion.div>
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
    tag: "Conversation",
    title: "One question at a time",
    desc: "Show a single focused question per step with animated transitions. Respondents stay engaged and completion rates jump — no overwhelming page-long forms.",
    wide: true,
    decoration: <ChatBubbles />,
    icon: <MessageCircle2 size={20} color="#17171c" />,
  },
  {
    tag: "Builder",
    title: "Drag & drop form builder",
    desc: "Add, reorder, and customise 14 field types visually — from short text and ratings to dropdowns and file uploads. Auto-saves as you build.",
    wide: false,
    decoration: <FieldTypes />,
    icon: <Grid size={20} color="#17171c" />,
  },
  {
    tag: "Analytics",
    title: "Real-time response tracking",
    desc: "See answers aggregated in bar charts per field, filter by distribution channel, and drill into individual submissions — all updating live.",
    wide: false,
    decoration: <MiniBarChart />,
    icon: <Chart2 size={20} color="#17171c" />,
  },
  {
    tag: "Distribution",
    title: "Channel tracking & QR codes",
    desc: "Create tracked distribution channels — WhatsApp, Email, Zoom, or custom. Each gets a unique link and QR code so you know exactly where responses come from.",
    wide: false,
    decoration: <ChannelCards />,
    icon: <LinkCircle size={20} color="#17171c" />,
  },
  {
    tag: "Export",
    title: "CSV & PDF export",
    desc: "Download all responses as a formatted CSV spreadsheet or a styled PDF report anytime. Your data, always portable — no lock-in.",
    wide: false,
    decoration: <ExportCards />,
    icon: <Download size={20} color="#17171c" />,
  },
  {
    tag: "Integrations",
    title: "Gmail & WhatsApp auto-send",
    desc: "Connect your Gmail or WhatsApp Business account once, then enable auto-send per form. Responses are delivered as CSV/PDF attachments the moment they come in.",
    wide: false,
    icon: <Envelope size={20} color="#17171c" />,
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
  { value: "2", label: "Integrations" },
];

export function FeaturesSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  return (
    <section
      className="lp-features-section"
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
            Formly brings together conversational form design with
            powerful analytics and built-in integrations — in a builder anyone can use.
          </p>
        </motion.div>

        <div
          className="lp-features-grid"
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
          className="lp-stats-grid"
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
