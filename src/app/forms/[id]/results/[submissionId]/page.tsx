"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Answer {
  id: string;
  fieldId: string;
  value: string;
}

interface Field {
  id: string;
  type: string;
  title: string;
  options: { id: string; label: string }[];
}

interface Submission {
  id: string;
  createdAt: string;
  answers: Answer[];
}

interface FormData {
  id: string;
  title: string;
  fields: Field[];
}

export default function SubmissionDetailPage() {
  const { id, submissionId } = useParams<{ id: string; submissionId: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/forms/${id}`).then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      }),
      fetch(`/api/submissions/${submissionId}`).then((r) => r.json()),
    ]).then(([formData, subData]) => {
      if (formData) {
        setForm({
          ...formData,
          fields: (formData.fields || []).map((f: Record<string, unknown>) => ({
            ...f,
            options: typeof f.options === "string" ? JSON.parse(f.options as string) : f.options || [],
          })),
        });
      }
      setSubmission(subData);
    }).finally(() => setLoading(false));
  }, [id, submissionId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!form || !submission) return null;

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex h-12 sm:h-13 max-w-4xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/forms/${id}/results`} className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-sm font-medium tracking-tight text-foreground">Response Detail</h1>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(submission.createdAt).toLocaleString()}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <Card>
          <CardContent className="p-0">
            {form.fields.map((field, i) => {
              const answer = submission.answers.find((a) => a.fieldId === field.id);
              let displayValue: string | { url: string; name: string; type: string; bytes: number } | string[] = "";
              if (answer) {
                try {
                  const parsed = JSON.parse(answer.value);
                  if (parsed && typeof parsed === "object" && parsed.url) {
                    displayValue = parsed;
                  } else if (Array.isArray(parsed)) {
                    displayValue = parsed;
                  } else {
                    displayValue = String(parsed);
                  }
                } catch { displayValue = answer.value; }
              }
              return (
                <div
                  key={field.id}
                  className={`px-4 sm:px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {field.title}
                  </h3>
                  {field.type === "file_upload" && typeof displayValue === "object" && "url" in displayValue ? (
                    <div className="flex items-center gap-3 mt-1">
                      {displayValue.type?.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={displayValue.url}
                          alt={displayValue.name}
                          className="size-16 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted-foreground">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <a
                          href={displayValue.type?.startsWith("image/") ? displayValue.url : `/viewer?url=${encodeURIComponent(displayValue.url)}&name=${encodeURIComponent(displayValue.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground underline underline-offset-2 hover:text-[#ff7759] transition-colors"
                        >
                          {displayValue.name}
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {displayValue.bytes < 1024 ? `${displayValue.bytes} B` :
                           displayValue.bytes < 1048576 ? `${(displayValue.bytes / 1024).toFixed(1)} KB` :
                           `${(displayValue.bytes / 1048576).toFixed(1)} MB`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-foreground">
                      {Array.isArray(displayValue) ? displayValue.join(", ") : (typeof displayValue === "string" && displayValue ? displayValue : <span className="italic text-muted-foreground/40">No answer</span>)}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
