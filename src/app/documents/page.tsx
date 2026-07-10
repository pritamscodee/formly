"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Grid, List, FileText, Upload, Chart2, ChevronRight, Clock, Eye } from "reicon-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
  fieldCount: number;
  hasFileUpload: boolean;
  fileUploadCount: number;
  fieldTypes: string[];
}

type ViewMode = "grid" | "list";
type FilterTab = "all" | "published" | "draft" | "uploads";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => {
        if (res.status === 401) { router.push("/login"); return null; }
        return res.json();
      })
      .then((data) => { if (data) setDocuments(data); })
      .finally(() => setLoading(false));
  }, [router]);

  const filteredDocs = useMemo(() => {
    let filtered = documents;
    if (activeTab === "published") filtered = filtered.filter((d) => d.published);
    if (activeTab === "draft") filtered = filtered.filter((d) => !d.published);
    if (activeTab === "uploads") filtered = filtered.filter((d) => d.hasFileUpload);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    return filtered;
  }, [documents, activeTab, searchQuery]);

  const stats = useMemo(() => ({
    total: documents.length,
    published: documents.filter((d) => d.published).length,
    drafts: documents.filter((d) => !d.published).length,
    withUploads: documents.filter((d) => d.hasFileUpload).length,
    totalSubmissions: documents.reduce((sum, d) => sum + d.submissionCount, 0),
    totalFiles: documents.reduce((sum, d) => sum + d.fileUploadCount, 0),
  }), [documents]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex h-13 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/forms" className="inline-flex items-center gap-2 no-underline">
              <div className="flex size-6 items-center justify-center rounded-md bg-foreground">
                <span className="text-[11px] font-bold text-background">F</span>
              </div>
              <span className="text-sm font-medium tracking-tight text-foreground">Formly</span>
            </Link>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Documents</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/forms")}>
              My Forms
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Documents</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            All your published forms and their submissions in one place.
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="py-3">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-foreground/10">
                <FileText size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{stats.total}</p>
                <p className="text-[11px] text-muted-foreground">Total Forms</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <Eye size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{stats.published}</p>
                <p className="text-[11px] text-muted-foreground">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Chart2 size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{stats.totalSubmissions}</p>
                <p className="text-[11px] text-muted-foreground">Submissions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Upload size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{stats.withUploads}</p>
                <p className="text-[11px] text-muted-foreground">With Uploads</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and view controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms..."
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex size-7 items-center justify-center rounded-md transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex size-7 items-center justify-center rounded-md transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-1">
          {([
            { key: "all", label: "All", count: stats.total },
            { key: "published", label: "Published", count: stats.published },
            { key: "draft", label: "Drafts", count: stats.drafts },
            { key: "uploads", label: "With Uploads", count: stats.withUploads },
          ] as { key: FilterTab; label: string; count: number }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {filteredDocs.length === 0 ? (
          <div className="mt-16 text-center">
            <div className="mb-4 flex justify-center">
              <FileText size={40} className="text-muted-foreground/40" />
            </div>
            <h2 className="mb-1.5 text-lg font-medium text-foreground">
              {searchQuery ? "No matching forms" : "No forms yet"}
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search" : "Create your first form to get started"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/forms/${doc.id}/edit`}
                className="group block no-underline"
              >
                <Card className="transition-all hover:border-foreground/30 hover:shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${doc.published ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {doc.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      {doc.hasFileUpload && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                          <Upload size={10} />
                          {doc.fileUploadCount}
                        </span>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-[#ff7759] transition-colors text-base">
                      {doc.title}
                    </CardTitle>
                    {doc.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">{doc.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{doc.submissionCount} submission{doc.submissionCount !== 1 ? "s" : ""}</span>
                      <span>{doc.fieldCount} field{doc.fieldCount !== 1 ? "s" : ""}</span>
                      <span className="ml-auto flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/forms/${doc.id}/edit`}
                className="group block no-underline"
              >
                <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-foreground/30 hover:shadow-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText size={18} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-foreground group-hover:text-[#ff7759] transition-colors">
                        {doc.title}
                      </h3>
                      <div className={`size-1.5 rounded-full shrink-0 ${doc.published ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                      {doc.hasFileUpload && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 shrink-0">
                          <Upload size={8} />
                          Uploads
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {doc.description || `${doc.fieldCount} fields · ${doc.submissionCount} submissions`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                    <span className="hidden sm:inline">{doc.submissionCount} responses</span>
                    <span className="hidden sm:inline">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
