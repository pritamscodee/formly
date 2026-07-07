"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

const ANSWERS = ["Design", "Engineering", "Product", "Growth", "Operations"];

function FormMockup() {
  return (
    <div className="lp-console" style={{ maxWidth: 540, width: "100%" }}>
      <div
        style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span
            key={c}
            style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }}
          />
        ))}
        <div
          style={{
            marginLeft: 10,
            flex: 1,
            height: 24,
            borderRadius: 4,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            formly.app/s/team-survey
          </span>
        </div>
      </div>

      <div style={{ padding: "28px 28px 24px" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 14,
          }}
        >
          Question 2 of 6
        </p>

        <h3
          style={{
            fontSize: 20,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            marginBottom: 6,
          }}
        >
          What team are you in?
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            marginBottom: 20,
            lineHeight: 1.4,
          }}
        >
          Select the option that best describes you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {ANSWERS.map((ans, i) => (
            <motion.div
              key={ans}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.35 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                border: i === 1
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                background: i === 1 ? "rgba(255,255,255,0.06)" : "transparent",
                cursor: "default",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: i === 1
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "1px solid rgba(255,255,255,0.15)",
                  background: i === 1 ? "rgba(255,255,255,0.9)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 9,
                  fontWeight: 600,
                  color: i === 1 ? "#17171c" : "rgba(255,255,255,0.3)",
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: i === 1 ? "#ffffff" : "rgba(255,255,255,0.55)",
                }}
              >
                {ans}
              </span>
              {i === 1 && (
                <svg
                  style={{ marginLeft: "auto", flexShrink: 0 }}
                  width={14}
                  height={14}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8l4 4 6-6"
                    stroke="#ffffff"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              color: "#17171c",
              borderRadius: 9999,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "default",
            }}
          >
            OK <span style={{ marginLeft: 4, opacity: 0.4 }}>↵</span>
          </button>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>press Enter ↵</span>
        </div>
      </div>

      <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          style={{
            height: "100%",
            background: "rgba(255,255,255,0.3)",
            transformOrigin: "left",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const LOGOS = [
  "Notion", "Stripe", "Linear", "Vercel", "Figma",
  "Slack", "Airtable", "Loom", "Retool", "Supabase",
  "Notion", "Stripe", "Linear", "Vercel", "Figma",
  "Slack", "Airtable", "Loom", "Retool", "Supabase",
];

function DotGrid() {
  return (
    <div
      className="lp-dot-grid"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.35,
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#faf9f5",
        overflow: "hidden",
        paddingTop: 140,
        paddingBottom: 0,
      }}
    >
      <DotGrid />

      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(155,96,170,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        <motion.div {...fadeUp(0)} style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <span className="lp-chip-coral">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ff7759",
                display: "inline-block",
                animation: "lp-pulse 1.8s ease-in-out infinite",
              }}
            />
            The smarter way to build forms
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="lp-hero-display"
          style={{
            textAlign: "center",
            color: "#17171c",
            maxWidth: 860,
            margin: "0 auto 20px",
          }}
        >
          Forms that feel like{" "}
          <em style={{ fontStyle: "normal", color: "#ff7759" }}>conversations</em>
        </motion.h1>

        <motion.p
          {...fadeUp(0.16)}
          className="lp-body-large"
          style={{
            textAlign: "center",
            maxWidth: 500,
            margin: "0 auto 48px",
          }}
        >
          Build beautiful, interactive forms with drag-and-drop ease. Collect
          responses, analyze results — no code required.
        </motion.p>

        <motion.div
          {...fadeUp(0.24)}
          style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}
        >
          <Link href="/register" className="lp-btn-primary lp-beam-btn" style={{ padding: "14px 34px", fontSize: 15 }}>
            Get started free
          </Link>
          <Link href="/login" className="lp-btn-outline" style={{ padding: "14px 34px", fontSize: 15 }}>
            View demo
          </Link>
        </motion.div>

        <motion.p
          {...fadeUp(0.3)}
          style={{ textAlign: "center", fontSize: 12, color: "#93939f", marginBottom: 80 }}
        >
          No credit card required · Free forever plan · Setup in 60 seconds
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}
        >
          <FormMockup />
        </motion.div>
      </div>

      <div
        style={{
          marginTop: 80,
          borderTop: "1px solid #e5e7eb",
          padding: "36px 0",
          overflow: "hidden",
        }}
      >
        <p
          className="lp-mono-label"
          style={{ textAlign: "center", marginBottom: 24, fontSize: 11, color: "#93939f" }}
        >
          Trusted by teams at
        </p>
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="lp-marquee" style={{ display: "flex", gap: 64, width: "max-content" }}>
            {LOGOS.map((name, i) => (
              <span
                key={i}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#c4c4cc",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
