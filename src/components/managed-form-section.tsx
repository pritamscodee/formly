"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Envelope, Download, FilePdf, MessageCircle2,
  LinkCircle, Chart2, Clock, Eye, Qr,
  FileText, Download2, EnvelopeCheck,
  Award, Send, CheckCircle, ChevronRight,
} from "reicon-react";

/* ─── Decoration: Gmail auto-send email ─── */
function GmailDecoration() {
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "14px 16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EA4335", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Envelope size={13} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#17171c" }}>Formly Auto-Send</div>
            <div style={{ fontSize: 10, color: "#93939f" }}>New response &middot; CSV attached</div>
          </div>
          <span style={{ fontSize: 10, color: "#93939f", flexShrink: 0 }}>2m</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 6, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
          <Download2 size={12} color="#93939f" />
          <span style={{ fontSize: 11, color: "#616161" }}>team-survey-responses.csv</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#93939f" }}>2.4 KB</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Decoration: Export file cards ─── */
function ExportDecoration() {
  const items = [
    { icon: <FileText size={16} color="#6366f1" />, label: "responses.csv", size: "2.4 KB", color: "#eef2ff" },
    { icon: <FilePdf size={16} color="#d94f35" />, label: "report.pdf", size: "18 KB", color: "#fef2f2" },
  ];
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          style={{
            flex: 1,
            padding: "14px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            textAlign: "center",
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: item.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#17171c" }}>{item.label}</div>
            <div style={{ fontSize: 10, color: "#93939f" }}>{item.size}</div>
          </div>
          <Download2 size={12} color="#d4d4d8" />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Decoration: Channel tracking pills + QR ─── */
function ChannelDecoration() {
  const channels = [
    { name: "Gmail", color: "#EA4335" },
    { name: "WhatsApp", color: "#25D366" },
    { name: "QR Code", color: "#17171c" },
    { name: "Direct", color: "#6366f1" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
      {channels.map((ch, i) => (
        <motion.div
          key={ch.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.07 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: 12,
            fontWeight: 500,
            color: "#17171c",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
          {ch.name}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Decoration: Analytics bar chart ─── */
function AnalyticsDecoration() {
  const bars = [
    { h: 40, label: "M" }, { h: 68, label: "T" }, { h: 55, label: "W" },
    { h: 88, label: "T" }, { h: 96, label: "F", accent: true }, { h: 62, label: "S" },
  ];
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
        {bars.map((b, i) => (
          <motion.div
            key={i}
            style={{ flex: 1, borderRadius: 3, background: "#e5e7eb", transformOrigin: "bottom" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: "easeOut" }}
          >
            <div style={{ height: `${b.h}%`, background: b.accent ? "#ff7759" : "#17171c", borderRadius: 3 }} />
          </motion.div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
        {bars.map((b, i) => (
          <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: b.accent ? "#ff7759" : "#93939f", fontWeight: b.accent ? 500 : 400 }}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Decoration: WhatsApp message preview ─── */
function WhatsAppDecoration() {
  const msgs = [
    { text: "New response from Sarah K.", align: "flex-start" as const, bg: "#fff", color: "#17171c" },
    { text: "Rating: 5/5\nComment: Great tool!", align: "flex-end" as const, bg: "#dcf8c6", color: "#17171c" },
  ];
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ background: "#e5ddd5", borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.15 }}
            style={{
              alignSelf: m.align,
              maxWidth: "80%",
              padding: "8px 12px",
              borderRadius: 8,
              background: m.bg,
              fontSize: 12,
              lineHeight: 1.5,
              color: m.color,
              boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
              whiteSpace: "pre-line",
            }}
          >
            {m.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Decoration: Timer countdown ─── */
function TimerDecoration() {
  return (
    <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {["02", "45", "3"].map((seg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{
              width: 36,
              height: 40,
              borderRadius: 6,
              background: "#17171c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            {seg}
          </motion.div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 10, color: "#93939f", letterSpacing: "0.05em", textTransform: "uppercase" }}>min</span>
        <span style={{ fontSize: 10, color: "#93939f", letterSpacing: "0.05em", textTransform: "uppercase" }}>sec</span>
        <span style={{ fontSize: 10, color: "#93939f", letterSpacing: "0.05em", textTransform: "uppercase" }}>ms</span>
      </div>
    </div>
  );
}

/* ─── Decoration: Quality score ring ─── */
function QualityDecoration() {
  return (
    <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
      {[
        { score: 92, label: "Quality", color: "#1a7a4c" },
        { score: 87, label: "Complete", color: "#6366f1" },
        { score: 78, label: "Timely", color: "#ff7759" },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `3px solid ${s.color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.score}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Decoration: Submission rows ─── */
function SubmissionDecoration() {
  const rows = [
    { name: "Sarah K.", time: "2m ago", status: "complete", email: "sarah@..." },
    { name: "James L.", time: "5m ago", status: "complete", email: "james@..." },
    { name: "Maya R.", time: "1m ago", status: "partial", email: "maya@..." },
  ];
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6 }}>
      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 6,
            background: "#fff",
            border: "1px solid #f0f0f0",
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#17171c", flexShrink: 0 }}>
            {r.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#17171c" }}>{r.name}</div>
            <div style={{ fontSize: 10, color: "#93939f" }}>{r.email}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <span style={{ fontSize: 10, color: "#93939f" }}>{r.time}</span>
            <span style={{
              fontSize: 9, fontWeight: 500,
              color: r.status === "complete" ? "#1a7a4c" : "#ff7759",
              padding: "1px 6px", borderRadius: 9999,
              background: r.status === "complete" ? "#edfce9" : "#fff5f3",
            }}>{r.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Feature card type ─── */
type ManagedFeature = {
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  span?: number;
  decoration?: React.ReactNode;
  accent?: string;
};

const FEATURES: ManagedFeature[] = [
  {
    tag: "Email Automation",
    title: "Gmail auto-send on every response",
    desc: "Connect Gmail once. Each new submission triggers an email with CSV or PDF attached — zero manual work.",
    icon: <EnvelopeCheck size={20} color="#17171c" />,
    span: 2,
    decoration: <GmailDecoration />,
    accent: "#EA4335",
  },
  {
    tag: "Export",
    title: "CSV & PDF export",
    desc: "Download formatted spreadsheets or styled reports anytime.",
    icon: <Download size={20} color="#17171c" />,
    span: 1,
    decoration: <ExportDecoration />,
    accent: "#6366f1",
  },
  {
    tag: "Distribution",
    title: "Channel tracking & QR codes",
    desc: "Each channel gets a unique tracked URL and QR code.",
    icon: <LinkCircle size={20} color="#17171c" />,
    span: 1,
    decoration: <ChannelDecoration />,
    accent: "#25D366",
  },
  {
    tag: "Analytics",
    title: "Live response analytics",
    desc: "Bar charts update in real-time. Filter by channel and drill into submissions.",
    icon: <Chart2 size={20} color="#17171c" />,
    span: 1,
    decoration: <AnalyticsDecoration />,
    accent: "#ff7759",
  },
  {
    tag: "Timer",
    title: "Form timer & expiry controls",
    desc: "Set time limits per form and auto-expire after a date.",
    icon: <Clock size={20} color="#17171c" />,
    span: 1,
    decoration: <TimerDecoration />,
    accent: "#f59e0b",
  },
  {
    tag: "WhatsApp",
    title: "WhatsApp Business integration",
    desc: "Send response summaries via WhatsApp Cloud API. Supports templates and plain-text messages automatically.",
    icon: <MessageCircle2 size={20} color="#17171c" />,
    span: 2,
    decoration: <WhatsAppDecoration />,
    accent: "#25D366",
  },
  {
    tag: "Quality",
    title: "Response quality scoring",
    desc: "Auto-scored for completeness and quality.",
    icon: <Award size={20} color="#17171c" />,
    span: 1,
    decoration: <QualityDecoration />,
    accent: "#1a7a4c",
  },
  {
    tag: "Submissions",
    title: "Individual drill-down",
    desc: "Click into any response for full details, timestamps, and source.",
    icon: <Eye size={20} color="#17171c" />,
    span: 3,
    decoration: <SubmissionDecoration />,
    accent: "#6366f1",
  },
];

/* ─── Card component ─── */
function ManagedFeatureCard({ feature, index }: { feature: ManagedFeature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        gridColumn: `span ${feature.span ?? 1}`,
        background: "#faf9f5",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "24px 24px 28px",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      whileHover={{
        borderColor: "#c8c8ce",
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            background: "#f5f0e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {feature.icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="lp-mono-label" style={{ fontSize: 10, color: feature.accent || "#93939f" }}>
            {feature.tag}
          </span>
          <h3 className="lp-feature-heading" style={{ color: "#17171c" }}>
            {feature.title}
          </h3>
        </div>
      </div>

      <p className="lp-body" style={{ fontSize: 14, lineHeight: 1.6 }}>
        {feature.desc}
      </p>

      {feature.decoration}
    </motion.div>
  );
}

/* ─── Section export ─── */
export function ManagedFormSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section
      className="lp-managed-section"
      style={{
        background: "#ffffff",
        padding: "88px 0 96px",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ maxWidth: 640, marginBottom: 48 }}
        >
          <span
            className="lp-mono-label"
            style={{ display: "block", marginBottom: 14, fontSize: 11, color: "#93939f" }}
          >
            Managed forms
          </span>
          <h2 className="lp-section-heading" style={{ color: "#17171c", marginBottom: 16 }}>
            We manage the{" "}
            <span style={{ color: "#ff7759" }}>heavy lifting</span>{" "}
            so you don&apos;t have to
          </h2>
          <p className="lp-body-large" style={{ color: "#616161", maxWidth: 520 }}>
            From auto-sending emails to real-time analytics, Formly handles every
            piece of the form workflow — so you can focus on what the answers tell you.
          </p>
        </motion.div>

        <div
          className="lp-managed-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {FEATURES.map((f, i) => (
            <ManagedFeatureCard key={f.tag} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
