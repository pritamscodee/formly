"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronUp, ChevronDown, Download, Search, Filter,
  ArrowLeft, Tablet, CheckCircle, AlertTriangle,
  TrendUp2, Chart2, Eye,
} from "reicon-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateCSV, downloadCSV, generatePDF, downloadPDF } from "@/lib/export";
import {
  analyzeSubmissions,
  formatSmart,
  parseAnswerValue,
  type DataAnalysis,
  type ColumnAnalysis,
} from "@/lib/data-analysis";

interface Answer {
  id: string;
  fieldId: string;
  value: string;
}

interface Submission {
  id: string;
  channelId: string | null;
  respondentEmail: string | null;
  createdAt: string;
  answers: Answer[];
}

interface Channel {
  id: string;
  name: string;
  type: string;
  trackingCode: string;
  _count: { submissions: number };
}

interface Field {
  id: string;
  type: string;
  title: string;
  order: number;
  options: { id: string; label: string }[];
}

interface FormData {
  id: string;
  title: string;
  fields: Field[];
}

type SortDir = "asc" | "desc" | null;

export default function SubmissionsViewerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelFilter, setChannelFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/forms/${id}`).then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      }),
      fetch(`/api/submissions?formId=${id}`).then((r) => r.json()),
      fetch(`/api/forms/${id}/channels`).then((r) => r.ok ? r.json() : []),
    ]).then(([formData, submissionsData, channelsData]) => {
      if (formData) {
        setForm({
          ...formData,
          fields: (formData.fields || []).map((f: Record<string, unknown>) => ({
            ...f,
            options: typeof f.options === "string" ? JSON.parse(f.options as string) : f.options || [],
          })).sort((a: Field, b: Field) => a.order - b.order),
        });
      }
      setSubmissions(submissionsData || []);
      setChannels(channelsData || []);
    }).finally(() => setLoading(false));
  }, [id, router]);

  const filteredSubmissions = useMemo(() => {
    let filtered = channelFilter
      ? submissions.filter((s) => s.channelId === channelFilter)
      : submissions;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => {
        return s.answers.some((a) => parseAnswerValue(a.value).toLowerCase().includes(q));
      });
    }

    if (sortField && sortDir) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = parseAnswerValue(a.answers.find((an) => an.fieldId === sortField)?.value || "");
        const bVal = parseAnswerValue(b.answers.find((an) => an.fieldId === sortField)?.value || "");
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir === "asc" ? aNum - bNum : bNum - aNum;
        }
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    return filtered;
  }, [submissions, channelFilter, searchQuery, sortField, sortDir]);

  const analysis: DataAnalysis | null = useMemo(() => {
    if (!form) return null;
    return analyzeSubmissions(form.fields, filteredSubmissions);
  }, [form, filteredSubmissions]);

  const handleSort = useCallback((fieldId: string) => {
    if (sortField === fieldId) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortField(null); setSortDir(null); }
    } else {
      setSortField(fieldId);
      setSortDir("asc");
    }
  }, [sortField, sortDir]);

  const handleExportCSV = useCallback(() => {
    if (!form) return;
    setExporting("csv");
    const csv = generateCSV(form, filteredSubmissions, channels);
    downloadCSV(form.title, csv);
    setExporting(null);
  }, [form, filteredSubmissions, channels]);

  const handleExportPDF = useCallback(() => {
    if (!form) return;
    setExporting("pdf");
    const doc = generatePDF(form, filteredSubmissions, channels);
    downloadPDF(form.title, doc);
    setExporting(null);
  }, [form, filteredSubmissions, channels]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!form) return null;

  const fields = form.fields;
  const channelMap = new Map(channels.map((c) => [c.id, c.name]));

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex h-12 sm:h-13 max-w-full items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/forms/${id}/edit`} className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft size={16} />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-medium tracking-tight text-foreground">{form.title}</h1>
              <p className="text-[11px] text-muted-foreground">
                {filteredSubmissions.length} response{filteredSubmissions.length !== 1 ? "s" : ""}
                {channelFilter ? ` · ${channelMap.get(channelFilter)}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/forms/${id}/results`} className="inline-flex h-7 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Charts
            </Link>
            {filteredSubmissions.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 rounded-lg px-2 text-xs" onClick={handleExportCSV} disabled={exporting === "csv"}>
                  <Download size={12} />
                  <span className="hidden sm:inline">{exporting === "csv" ? "..." : "CSV"}</span>
                </Button>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 rounded-lg px-2 text-xs" onClick={handleExportPDF} disabled={exporting === "pdf"}>
                  <Download size={12} />
                  <span className="hidden sm:inline">{exporting === "pdf" ? "..." : "PDF"}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border bg-parchment/80 backdrop-blur sticky top-12 sm:top-13 z-40">
        <div className="mx-auto flex max-w-full items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search responses..."
              className="w-full rounded-lg border border-border bg-card pl-8 pr-3 py-1.5 text-xs text-foreground outline-none transition-colors focus:border-foreground"
            />
          </div>
          {channels.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Filter size={12} className="text-muted-foreground shrink-0" />
              <button
                onClick={() => setChannelFilter(null)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  channelFilter === null ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setChannelFilter(ch.id)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    channelFilter === ch.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {ch.name}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              showAnalysis ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Chart2 size={12} className="inline mr-1" />
            Analysis
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Tablet size={40} className="mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No responses yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Share your form to start collecting responses</p>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Analysis Panel */}
            {showAnalysis && analysis && (
              <div className="space-y-3">
                {/* Quality Score + Summary */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Card className="py-3">
                    <CardContent className="flex items-center gap-3 px-4">
                      <div className={`flex size-9 items-center justify-center rounded-lg ${
                        analysis.qualityScore >= 70 ? "bg-emerald-500/10" : analysis.qualityScore >= 40 ? "bg-amber-500/10" : "bg-red-500/10"
                      }`}>
                        {analysis.qualityScore >= 70 ? (
                          <CheckCircle size={18} className="text-emerald-600" />
                        ) : (
                          <AlertTriangle size={18} className={analysis.qualityScore >= 40 ? "text-amber-600" : "text-red-600"} />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground">{analysis.qualityScore}%</p>
                        <p className="text-[11px] text-muted-foreground">Data Quality</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="py-3">
                    <CardContent className="flex items-center gap-3 px-4">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                        <TrendUp2 size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground">{analysis.overallFillRate}%</p>
                        <p className="text-[11px] text-muted-foreground">Completion Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="py-3">
                    <CardContent className="flex items-center gap-3 px-4">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-foreground/10">
                        <Eye size={18} className="text-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground">{analysis.totalRows}</p>
                        <p className="text-[11px] text-muted-foreground">Responses</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Column Insights */}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.columns.map((col) => (
                    <ColumnInsightCard key={col.fieldId} column={col} />
                  ))}
                </div>
              </div>
            )}

            {/* Spreadsheet Table */}
            <div className="inline-flex min-w-full flex-col rounded-lg border border-border overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-12 border-b border-r border-border bg-card px-3 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      #
                    </th>
                    <th className="min-w-[140px] border-b border-r border-border bg-card px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <button onClick={() => { setSortField("_date"); setSortDir(sortField === "_date" && sortDir === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        Date
                        {sortField === "_date" && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </button>
                    </th>
                    <th className="border-b border-r border-border bg-card px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground min-w-[100px]">
                      Channel
                    </th>
                    {fields.map((field) => (
                      <th key={field.id} className="border-b border-r border-border bg-card px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground min-w-[140px]">
                        <button onClick={() => handleSort(field.id)} className="flex items-center gap-1 hover:text-foreground transition-colors text-left w-full">
                          <span className="truncate">{field.title}</span>
                          {sortField === field.id && (sortDir === "asc" ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />)}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub, rowIdx) => {
                    const isSelected = selectedRow === sub.id;
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setSelectedRow(isSelected ? null : sub.id)}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-foreground/5" : "hover:bg-muted/40"}`}
                      >
                        <td className="w-12 border-b border-r border-border bg-card px-3 py-2 text-center text-xs text-muted-foreground font-mono">
                          {rowIdx + 1}
                        </td>
                        <td className="border-b border-r border-border bg-card px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          <span className="ml-1.5 text-muted-foreground/60">
                            {new Date(sub.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td className="border-b border-r border-border bg-card px-3 py-2">
                          {sub.channelId ? (
                            <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {channelMap.get(sub.channelId) || "Unknown"}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          )}
                        </td>
                        {fields.map((field) => {
                          const rawVal = sub.answers.find((a) => a.fieldId === field.id)?.value || "";
                          const col = analysis?.columns.find((c) => c.fieldId === field.id);
                          const dataType = col?.dataType || "text";
                          const displayVal = formatSmart(parseAnswerValue(rawVal), dataType);
                          const isFile = dataType === "file";

                          return (
                            <td key={field.id} className="border-b border-r border-border bg-card px-3 py-2 max-w-[200px]">
                              {isFile ? (
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    try {
                                      const parsed = JSON.parse(rawVal);
                                      if (parsed?.url) {
                                        return (
                                          <>
                                            {parsed.type?.startsWith("image/") ? (
                                              // eslint-disable-next-line @next/next/no-img-element
                                              <img src={parsed.url} alt="" className="size-6 rounded object-cover shrink-0" />
                                            ) : (
                                              <div className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
                                                {parsed.name?.split(".").pop()?.toUpperCase() || "FILE"}
                                              </div>
                                            )}
                                            <a
                                              href={parsed.type?.startsWith("image/") ? parsed.url : `/viewer?url=${encodeURIComponent(parsed.url)}&name=${encodeURIComponent(parsed.name || "File")}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="truncate text-xs text-foreground underline underline-offset-2 hover:text-[#ff7759] transition-colors max-w-[120px]"
                                            >
                                              {parsed.name || "File"}
                                            </a>
                                          </>
                                        );
                                      }
                                    } catch { /* */ }
                                    return <span className="text-xs text-muted-foreground">{displayVal}</span>;
                                  })()}
                                </div>
                              ) : field.type === "rating" || field.type === "opinion_scale" ? (
                                <span className="text-xs whitespace-nowrap">{displayVal}</span>
                              ) : (
                                <span className="text-xs text-foreground leading-relaxed break-words">{displayVal}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="border-t border-r border-border bg-card px-3 py-2 text-center text-[11px] font-medium text-muted-foreground" colSpan={3 + fields.length}>
                      {filteredSubmissions.length} response{filteredSubmissions.length !== 1 ? "s" : ""}
                      {analysis && ` · ${analysis.overallFillRate}% completion · Quality score: ${analysis.qualityScore}%`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColumnInsightCard({ column }: { column: ColumnAnalysis }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-foreground truncate">{column.title}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{column.dataType} · {column.fillRate}% filled</p>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {column.fillRate >= 80 && <CheckCircle size={12} className="text-emerald-500" />}
          {column.fillRate < 50 && <AlertTriangle size={12} className="text-amber-500" />}
        </div>
      </div>

      {column.avg !== null && (
        <p className="text-[11px] text-muted-foreground mb-1">
          {column.dataType === "rating" ? "Avg rating" : "Average"}: <span className="font-medium text-foreground">{column.avg}</span>
          {column.min && column.max && <span className="text-muted-foreground/60"> · Range: {column.min}–{column.max}</span>}
        </p>
      )}

      {column.mode && column.uniqueCount > 1 && (
        <p className="text-[11px] text-muted-foreground mb-1">
          Most common: <span className="font-medium text-foreground">{column.mode}</span>
          {column.distribution[0] && <span className="text-muted-foreground/60"> ({column.distribution[0].percent}%)</span>}
        </p>
      )}

      {column.uniqueCount <= 5 && column.distribution.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {column.distribution.slice(0, 4).map((d) => (
            <span key={d.value} className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {d.value} ({d.count})
            </span>
          ))}
        </div>
      )}

      {column.suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {column.suggestions.map((s, i) => (
            <span key={i} className="inline-block rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
