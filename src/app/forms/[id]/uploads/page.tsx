"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SquareArrowUpRight02Icon } from "@hugeicons/core-free-icons";
import PdfViewer from "@/components/PdfViewer";

interface Upload {
  url: string;
  name: string;
  type: string;
  bytes: number;
  submittedAt: string;
  submissionId: string;
  respondentEmail: string | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function getIcon(type: string) {
  if (type.startsWith("image/")) return "🖼";
  if (type === "application/pdf") return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  return "📁";
}

export default function FormUploadsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Upload | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then((res) => {
        if (res.status === 401) { router.push("/login"); return null; }
        return res.json();
      })
      .then((data) => { if (data) setFormTitle(data.title); });
  }, [id, router]);

  useEffect(() => {
    fetch(`/api/forms/${id}/uploads`)
      .then((res) => {
        if (res.status === 401) { router.push("/login"); return []; }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUploads(data);
          if (data.length > 0) setSelected(data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  return (
    <div className="h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden">
      <header className="flex h-12 items-center gap-2 sm:gap-3 border-b border-border px-3 sm:px-4 shrink-0">
        <Link href={`/forms/${id}/edit`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="sm:hidden">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">&larr; Back</span>
        </Link>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <h1 className="text-sm font-semibold truncate min-w-0">{formTitle}</h1>
        <span className="text-xs text-muted-foreground hidden sm:inline">· Uploaded Docs</span>
        <span className="ml-auto text-xs text-muted-foreground shrink-0">{uploads.length} file{uploads.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="sm:hidden ml-1 p-1 rounded text-muted-foreground hover:text-foreground"
        >
          <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {showSidebar ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className={`${showSidebar ? "flex" : "hidden"} sm:flex w-full sm:w-72 shrink-0 overflow-y-auto border-r border-border absolute sm:relative z-10 sm:z-0 bg-background`}>
          {loading ? (
            <div className="p-4 space-y-3 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : uploads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm px-4 text-center">
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mb-2 opacity-40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              No uploads yet
            </div>
          ) : (
            <div className="p-2 space-y-1 w-full">
              {uploads.map((upload, i) => (
                <button
                  key={`${upload.submissionId}-${i}`}
                  onClick={() => { setSelected(upload); setShowSidebar(false); }}
                  className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                    selected === upload
                      ? "bg-[#ff7759]/10 text-[#ff7759] border border-[#ff7759]/20"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg mt-0.5 shrink-0">{getIcon(upload.type)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{upload.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatBytes(upload.bytes)} · {new Date(upload.submittedAt).toLocaleDateString()}
                      </p>
                      {upload.respondentEmail && (
                        <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{upload.respondentEmail}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {selected ? (
            <>
              <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate">{selected.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{formatBytes(selected.bytes)}</span>
                </div>
                <a
                  href={`/viewer?url=${encodeURIComponent(selected.url)}&name=${encodeURIComponent(selected.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-[#ff7759] hover:underline shrink-0 ml-2"
                >
                  <span className="hidden sm:inline">Open in new tab</span>
                  <HugeiconsIcon icon={SquareArrowUpRight02Icon} size={14} />
                </a>
              </div>
              <div className="flex-1 min-h-0">
                {selected.type.startsWith("image/") ? (
                  <img
                    key={selected.url}
                    src={selected.url}
                    alt={selected.name}
                    className="w-full h-full object-contain"
                  />
                ) : selected.type === "application/pdf" ? (
                  <PdfViewer key={selected.url} url={selected.url} />
                ) : (
                  <iframe
                    key={selected.url}
                    src={selected.url}
                    className="w-full h-full border-0"
                    title={selected.name}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              {loading ? "Loading..." : "Select a file to preview"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
