"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { CTASection } from "@/components/cta-section";
import { DemoSection } from "@/components/demo-section";
import { SketchBackground } from "@/components/sketch-background";
import { Menu, X, ChevronRight, ArrowRight, Home as HomeIcon, Globe, Send } from "reicon-react";

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    fetch("/api/auth/session").then((r) => r.json()).then((s) => { if (s?.user) setSignedIn(true); }).catch(() => {});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const logoHref = signedIn ? "/forms" : "/";

  return (
    <>
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
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href={logoHref} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="lp-nav-auth-desktop">
            {signedIn ? (
              <Link
                href="/forms"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#17171c",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                <HomeIcon size={16} color="#17171c" />
                Go to dashboard
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>

          <button
            className="lp-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} color="#17171c" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lp-mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
      />

      {/* Mobile slide-out menu */}
      <div className={`lp-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="lp-mobile-menu-header">
          <Link href={logoHref} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} onClick={closeMobile}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: "#17171c", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>F</span>
            </div>
            <span style={{ color: "#17171c", fontSize: 15, fontWeight: 500 }}>Formly</span>
          </Link>
          <button
            onClick={closeMobile}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "none", background: "transparent", cursor: "pointer", borderRadius: 6 }}
            aria-label="Close menu"
          >
            <X size={20} color="#17171c" />
          </button>
        </div>

        <div className="lp-mobile-menu-links">
          {[
            { label: "Features", icon: <Globe size={18} color="#93939f" /> },
            { label: "Pricing", icon: <Globe size={18} color="#93939f" /> },
            { label: "Blog", icon: <Globe size={18} color="#93939f" /> },
          ].map((item) => (
            <Link key={item.label} href="#" onClick={closeMobile}>
              {item.icon}
              {item.label}
              <ChevronRight size={16} color="#d4d4d8" style={{ marginLeft: "auto" }} />
            </Link>
          ))}
        </div>

        <div className="lp-mobile-menu-footer">
          {signedIn ? (
            <Link
              href="/forms"
              className="lp-btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 14 }}
              onClick={closeMobile}
            >
              <HomeIcon size={16} color="#fff" />
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "11px 20px",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#616161",
                  textDecoration: "none",
                  borderRadius: 9999,
                  border: "1.5px solid #d4d4d8",
                  transition: "border-color 0.15s",
                }}
                onClick={closeMobile}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="lp-btn-primary lp-beam-btn"
                style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 14 }}
                onClick={closeMobile}
              >
                Get started free
                <ArrowRight size={16} color="#fff" />
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function LandingFooter() {
  return (
    <footer style={{ background: "#17171c", color: "#ffffff" }}>
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32 }}>
          <div style={{ maxWidth: 420, flex: "1 1 280px" }}>
            <p className="lp-mono-label" style={{ color: "#ff7759", marginBottom: 12, fontSize: 11 }}>
              AI moves fast
            </p>
            <h3 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 400, lineHeight: 1.3, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>
              Get the latest on form design, analytics, and product updates.
            </h3>
          </div>
          <div className="lp-footer-newsletter" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, minWidth: 300, flex: "1 1 300px" }}>
            <div className="lp-footer-newsletter-row" style={{ display: "flex", gap: 8 }}>
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
                  minWidth: 0,
                }}
              />
              <button className="lp-btn-white" style={{ padding: "10px 20px", flexShrink: 0, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
                Subscribe <Send size={14} color="#17171c" />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#93939f", lineHeight: 1.4 }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "52px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="lp-footer-links-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginBottom: 48 }}>
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
                      style={{ color: "#93939f", fontSize: 14, textDecoration: "none", transition: "color 0.15s", display: "inline-flex", alignItems: "center", gap: 4 }}
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
          className="lp-footer-bottom"
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
        <DemoSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
