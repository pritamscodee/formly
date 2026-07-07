"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Answer {
  id: string;
  fieldId: string;
  value: string;
}

interface Submission {
  id: string;
  channelId: string | null;
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
  options: { id: string; label: string }[];
}

interface FormData {
  id: string;
  title: string;
  fields: Field[];
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelFilter, setChannelFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
          })),
        });
      }
      setSubmissions(submissionsData || []);
      setChannels(channelsData || []);
    }).finally(() => setLoading(false));
  }, [id, router]);

  const filteredSubmissions = channelFilter
    ? submissions.filter((s) => s.channelId === channelFilter)
    : submissions;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!form) return null;

  const getFieldAnswers = (fieldId: string): string[] => {
    return filteredSubmissions
      .map((s) => s.answers.find((a) => a.fieldId === fieldId)?.value)
      .filter(Boolean) as string[];
  };

  const getChartData = (field: Field) => {
    const answers = getFieldAnswers(field.id);
    const counts: Record<string, number> = {};
    answers.forEach((a) => {
      try { const parsed = JSON.parse(a); counts[parsed] = (counts[parsed] || 0) + 1; }
        catch { counts[a] = (counts[a] || 0) + 1; }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex h-13 max-w-4xl items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/forms" className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="truncate text-sm font-medium tracking-tight text-foreground">{form.title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href={`/forms/${id}/edit`} className="inline-flex h-7 items-center justify-center gap-1.5 rounded-lg px-2 sm:px-2.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="sm:hidden">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredSubmissions.length} response{filteredSubmissions.length !== 1 ? "s" : ""}
              {channelFilter ? " (filtered)" : ""}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Channel filter */}
        {channels.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Channel:</span>
            <button
              onClick={() => setChannelFilter(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                channelFilter === null
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChannelFilter(ch.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  channelFilter === ch.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {ch.name} ({ch._count.submissions})
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-5">
          {form.fields.map((field) => {
            const chartData = getChartData(field);
            return (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle>{field.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <div className="h-52 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 8,
                              border: "1px solid var(--color-border)",
                              background: "var(--color-card)",
                            }}
                          />
                          <Bar dataKey="value" fill="var(--color-foreground)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No responses yet</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSubmissions.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-medium tracking-tight text-foreground">Individual Responses</h2>
            <div className="flex flex-col gap-2">
              {filteredSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/forms/${id}/results/${sub.id}${channelFilter ? `?channel=${channelFilter}` : ""}`}
                  className="block rounded-lg border border-border bg-card p-4 no-underline transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Response from {new Date(sub.createdAt).toLocaleString()}
                      {sub.channelId && (
                        <span className="ml-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px]">
                          {channels.find((c) => c.id === sub.channelId)?.name || "Unknown"}
                        </span>
                      )}
                    </span>
                    <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="var(--color-muted-foreground)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
