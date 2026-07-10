"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CheckCircle } from "reicon-react";

const STEPS = [
  {
    n: "01",
    title: "Create your form",
    desc: "Drag and drop fields, set question logic, and customise the look in minutes.",
  },
  {
    n: "02",
    title: "Share the link",
    desc: "Send a single URL to anyone — email, Slack, embed it in your site, or use a QR code.",
  },
  {
    n: "03",
    title: "Analyse responses",
    desc: "Watch answers arrive in real time. Export or explore with our built-in charts.",
  },
];

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      style={{
        background: "#f5f0e8",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "96px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 52 }}
        >
          <span className="lp-mono-label" style={{ display: "block", marginBottom: 14, fontSize: 11 }}>
            How it works
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#17171c",
            }}
          >
            From idea to live form in 3 steps
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 0,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                padding: "40px 32px",
                borderRight: i < STEPS.length - 1 ? "1px solid #e5e7eb" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 11,
                  color: "#93939f",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: 20,
                }}
              >
                {step.n}
              </span>
              <div
                style={{
                  width: 28,
                  height: 1,
                  background: "#17171c",
                  marginBottom: 20,
                }}
              />
              <h3 style={{ fontSize: 18, fontWeight: 500, color: "#17171c", lineHeight: 1.3, marginBottom: 10 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: "#616161", lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  {
    quote: "Formly cut our survey setup time from hours to minutes. The conversational flow is exactly what our audience needs.",
    author: "Sarah K.",
    role: "Head of Research, Acme",
    initials: "SK",
  },
  {
    quote: "We switched to Formly and never looked back. Better analytics and the free plan covers everything we need.",
    author: "Marcus T.",
    role: "Product Lead, Buildco",
    initials: "MT",
  },
  {
    quote: "The drag-and-drop builder is intuitive enough that our non-technical team uses it daily without any training.",
    author: "Priya R.",
    role: "Ops Manager, Scaleup",
    initials: "PR",
  },
];

function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section style={{ background: "#faf9f5", padding: "96px 0", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 48 }}
        >
          <span className="lp-mono-label" style={{ display: "block", marginBottom: 14, fontSize: 11 }}>
            What teams say
          </span>
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#17171c",
            }}
          >
            Trusted by thousands of teams
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: "#f5f0e8",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 28,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  lineHeight: 1,
                  color: "#d9d9dd",
                  marginBottom: 16,
                  fontFamily: "Georgia, serif",
                }}
              >
                &ldquo;
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#212121", marginBottom: 24 }}>
                {q.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#17171c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {q.initials}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#17171c", lineHeight: 1.3 }}>{q.author}</p>
                  <p style={{ fontSize: 12, color: "#93939f" }}>{q.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="lp-green-band" style={{ padding: "100px 32px" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}
      >
        <span
          className="lp-mono-label"
          style={{
            display: "inline-block",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 20,
            fontSize: 11,
          }}
        >
          Get started
        </span>

        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            marginBottom: 20,
          }}
        >
          Start building better forms today
        </h2>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 440,
            margin: "0 auto 40px",
          }}
        >
          Free forever. No credit card. Your first form is live in under a minute.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="lp-btn-white lp-beam-btn" style={{ padding: "14px 36px", fontSize: 15 }}>
            Get started free
          </Link>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 36px",
              fontSize: 15,
              fontWeight: 400,
              color: "rgba(255,255,255,0.65)",
              textDecoration: "none",
              borderRadius: 9999,
              border: "1.5px solid rgba(255,255,255,0.2)",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.65)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Sign in
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            justifyContent: "center",
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {["Free forever plan", "Unlimited forms", "Export anytime"].map((t) => (
            <span
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <CheckCircle size={12} color="rgba(255,255,255,0.5)" />
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function CTASection() {
  return (
    <>
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
