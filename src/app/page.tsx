"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { CTASection } from "@/components/cta-section";
import { SketchBackground } from "@/components/sketch-background";

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",
        transition: "background 0.2s, border-color 0.2s, backdrop-filter 0.2s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#17171c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>F</span>
          </div>
          <span style={{ color: "#17171c", fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>
            Formly
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="lp-nav-links">
          {["Features", "Pricing", "Blog"].map((item) => (
            <Link
              key={item}
              href="#"
              style={{
                color: "#616161",
                fontSize: 14,
                fontWeight: 400,
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#17171c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#616161")}
            >
              {item}
            </Link>
          ))}
        </nav>
        <style>{`
          @media (max-width: 768px) {
            .lp-nav-links { display: none !important; }
          }
        `}</style>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/login"
            style={{ color: "#616161", fontSize: 14, fontWeight: 400, textDecoration: "none", padding: "8px 4px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#17171c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#616161")}
          >
            Log in
          </Link>
          <Link href="/register" className="lp-btn-primary lp-beam-btn" style={{ padding: "9px 22px", fontSize: 14 }}>
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer style={{ background: "#17171c", color: "#ffffff" }}>
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "60px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32 }}>
          <div style={{ maxWidth: 420 }}>
            <p className="lp-mono-label" style={{ color: "#ff7759", marginBottom: 12, fontSize: 11 }}>
              AI moves fast
            </p>
            <h3 style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.3, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>
              Get the latest on form design, analytics, and product updates.
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, minWidth: 300 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="you@company.com"
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.07)",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button className="lp-btn-white" style={{ padding: "10px 20px", flexShrink: 0, fontSize: 14 }}>
                Subscribe →
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#93939f", lineHeight: 1.4 }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "52px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, marginBottom: 48 }}>
          {[
            { label: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { label: "Resources", links: ["Docs", "API Reference", "Blog", "Status"] },
            { label: "Company", links: ["About", "Careers", "Press", "Contact"] },
            { label: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
          ].map((col) => (
            <div key={col.label}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
                {col.label}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      style={{ color: "#93939f", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#93939f")}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#17171c", fontSize: 10, fontWeight: 700 }}>F</span>
            </div>
            <span style={{ fontSize: 12, color: "#93939f" }}>© 2026 Formly, Inc. All rights reserved.</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Twitter", "GitHub", "LinkedIn"].map((s) => (
              <Link key={s} href="#" style={{ fontSize: 12, color: "#93939f", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#93939f")}>
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="lp-parchment" style={{ minHeight: "100vh", position: "relative" }}>
      <SketchBackground />
      <LandingNav />
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
