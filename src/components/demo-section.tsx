"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { VideoPlayer } from "@/components/video-player";

export function DemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      style={{
        background: "#faf9f5",
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
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span className="lp-mono-label" style={{ display: "block", marginBottom: 14, fontSize: 11 }}>
            Demo
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
            See Formly in action
          </h2>
          <p
            className="lp-body-large"
            style={{
              maxWidth: 500,
              margin: "16px auto 0",
            }}
          >
            Watch how easy it is to build a conversational form from scratch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <VideoPlayer src="/demo.mp4" />
        </motion.div>
      </div>
    </section>
  );
}
