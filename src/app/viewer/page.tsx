"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";

function ViewerContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const name = searchParams.get("name") || "Document";
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setError("No document URL provided");
      setLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let cleanup = () => {};
    let NutrientViewer: typeof import("@nutrient-sdk/viewer").default | null = null;

    (async () => {
      try {
        NutrientViewer = (await import("@nutrient-sdk/viewer")).default;
        NutrientViewer.unload(container);
        container.innerHTML = "";

        const proxyUrl = `${window.location.origin}/api/proxy-file?url=${encodeURIComponent(url)}`;

        const sessionRes = await fetch("/api/nutrient-session", { method: "POST" });
        if (!sessionRes.ok) throw new Error(`Session creation failed: ${sessionRes.status}`);
        const { jwt } = await sessionRes.json();

        await NutrientViewer.load({
          container,
          baseUrl: `${window.location.protocol}//${window.location.host}/`,
          session: jwt,
          document: proxyUrl,
        });

        setLoading(false);

        cleanup = () => {
          try { NutrientViewer?.unload(container); } catch {}
          container.innerHTML = "";
        };
      } catch (err) {
        console.error("Nutrient error:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
        setLoading(false);
      }
    })();

    return () => {
      cleanup();
    };
  }, [url]);

  if (!url) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground">No document URL provided.</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }} className="flex flex-col bg-background">
      <header className="flex h-10 items-center gap-3 border-b border-border px-4 shrink-0">
        <Link href="javascript:history.back()" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-medium truncate">{name}</h1>
        {loading && (
          <span className="text-xs text-muted-foreground ml-2">Loading...</span>
        )}
      </header>

      <div className="flex-1 min-h-0">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <p>{error}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#ff7759] hover:underline">
              Download instead
            </a>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </div>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading viewer...</p>
      </div>
    }>
      <ViewerContent />
    </Suspense>
  );
}
