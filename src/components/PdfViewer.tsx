"use client";

import React, { useEffect, useRef, useState } from "react";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let NutrientViewer: typeof import("@nutrient-sdk/viewer").default | null = null;

    (async () => {
      try {
        NutrientViewer = (await import("@nutrient-sdk/viewer")).default;

        if (loadedRef.current) {
          NutrientViewer.unload(container);
        }
        container.innerHTML = "";

        const proxyUrl = `${window.location.origin}/api/proxy-file?url=${encodeURIComponent(url)}`;

        const sessionRes = await fetch("/api/nutrient-session", { method: "POST" });
        if (!sessionRes.ok) throw new Error(`Session creation failed: ${sessionRes.status}`);
        const { jwt } = await sessionRes.json();

        if (cancelled) return;

        await NutrientViewer.load({
          container,
          baseUrl: `${window.location.protocol}//${window.location.host}/`,
          session: jwt,
          document: proxyUrl,
        });

        if (!cancelled) loadedRef.current = true;
      } catch (err) {
        console.error("Nutrient error:", err);
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load PDF");
      }
    })();

    return () => {
      cancelled = true;
      if (NutrientViewer && container) {
        try { NutrientViewer.unload(container); } catch {}
        container.innerHTML = "";
        loadedRef.current = false;
      }
    };
  }, [url]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
        <p>{error}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#ff7759] hover:underline">
          Download instead
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
}
