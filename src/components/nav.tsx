"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function PublicNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(229,231,235,0.4)",
        background: "rgba(250,249,245,0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          height: 60,
          maxWidth: 1200,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
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
            }}
          >
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>F</span>
          </div>
          <span style={{ color: "#17171c", fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>
            Formly
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              height: 34,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              padding: "0 12px",
              fontSize: 14,
              color: "#616161",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#17171c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#616161")}
          >
            Log in
          </Link>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              height: 34,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9999,
              padding: "0 18px",
              fontSize: 14,
              fontWeight: 500,
              background: "#17171c",
              color: "#ffffff",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2c2c35")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#17171c")}
          >
            Sign up free
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AppNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(229,231,235,0.4)",
        background: "rgba(250,249,245,0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          height: 52,
          maxWidth: 1200,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 5,
              background: "#17171c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>F</span>
          </div>
          <span style={{ color: "#17171c", fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em" }}>
            Formly
          </span>
        </Link>
          <button
            onClick={() => authClient.signOut({ callbackUrl: "/" })}
            style={{
              fontSize: 14,
              color: "#616161",
              textDecoration: "none",
              transition: "color 0.15s",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#17171c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#616161")}
          >
            Sign out
          </button>
      </div>
    </header>
  );
}
