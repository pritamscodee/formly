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
        <div className="mx-auto flex h-13 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Link href={`/forms/${id}/results`} className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
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

      <main className="mx-auto max-w-4xl px-6 py-8">
        <Card>
          <CardContent className="p-0">
            {form.fields.map((field, i) => {
              const answer = submission.answers.find((a) => a.fieldId === field.id);
              let displayValue = "";
              if (answer) {
                try { displayValue = JSON.parse(answer.value); } catch { displayValue = answer.value; }
                if (Array.isArray(displayValue)) displayValue = displayValue.join(", ");
              }
              return (
                <div
                  key={field.id}
                  className={`px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {field.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground">
                    {displayValue || <span className="italic text-muted-foreground/40">No answer</span>}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
