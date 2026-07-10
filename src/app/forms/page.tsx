"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EditIcon,
  ShareIcon,
  DeleteIcon,
  FileIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShareDialog } from "@/components/ShareDialog";
import { authClient } from "@/lib/auth-client";

interface FormListItem {
  id: string;
  title: string;
  description: string;
  published: boolean;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { submissions: number };
}

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/forms")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setForms(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function createForm() {
    setCreating(true);
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const form = await res.json();
    setCreating(false);
    router.push(`/forms/${form.id}/edit`);
  }

  async function deleteForm(id: string) {
    if (!confirm("Delete this form forever?")) return;
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    setForms((prev) => prev.filter((f) => f.id !== id));
  }

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
        <div className="mx-auto flex h-13 max-w-5xl items-center justify-between px-6">
          <Link href="/forms" className="inline-flex items-center gap-2 no-underline">
            <div className="flex size-6 items-center justify-center rounded-md bg-foreground">
              <span className="text-[11px] font-bold text-background">F</span>
            </div>
            <span className="text-sm font-medium tracking-tight text-foreground">Formly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/documents" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Documents
            </Link>
            <span className="text-xs text-muted-foreground">
              {forms.length} form{forms.length !== 1 ? "s" : ""}
            </span>
            <Button variant="ghost" size="sm" onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">My forms</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Manage your forms and view responses.</p>
          </div>
          <Button onClick={createForm} disabled={creating} className="rounded-full self-start sm:self-auto">
            {creating ? "Creating..." : "+ New form"}
          </Button>
        </div>

        {forms.length === 0 ? (
          <div className="mt-16 px-4 text-center sm:mt-20">
            <div className="mb-4 flex justify-center">
              <HugeiconsIcon icon={FileIcon} size={40} color="#93939f" strokeWidth={1.5} />
            </div>
            <h2 className="mb-1.5 text-lg font-medium text-foreground">No forms yet</h2>
            <p className="mb-5 text-sm text-muted-foreground">Create your first form to get started</p>
            <Button onClick={createForm} disabled={creating} className="rounded-full">
              Create your first form
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <Card key={form.id} className="transition-colors hover:border-foreground/30">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${
                          !form.isActive
                            ? "bg-red-500"
                            : form.published
                              ? "bg-emerald-500"
                              : "bg-muted-foreground/30"
                        }`}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {!form.isActive
                          ? "Expired"
                          : form.published
                            ? "Published"
                            : "Draft"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/forms/${form.id}/edit`} title="Edit" className="inline-flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                <HugeiconsIcon icon={EditIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      </Link>
                      {form.published && (
                        <ShareDialog
                          formId={form.id}
                          formTitle={form.title}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              title="Share & Integrate"
                            >
                              <HugeiconsIcon icon={ShareIcon} size={14} color="currentColor" strokeWidth={1.5} />
                            </Button>
                          }
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => deleteForm(form.id)}
                        title="Delete"
                      >
                        <HugeiconsIcon icon={DeleteIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                  <Link href={`/forms/${form.id}/edit`} className="no-underline">
                    <CardTitle className="hover:text-[#ff7759] transition-colors">{form.title}</CardTitle>
                  </Link>
                  {form.description && (
                    <CardDescription className="line-clamp-2">{form.description}</CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{form._count.submissions} response{form._count.submissions !== 1 ? "s" : ""}</span>
                  {form.expiresAt && (
                    <span className={form.isActive ? "text-emerald-600" : "text-red-500"}>
                      {form.isActive ? "Expires" : "Expired"} {new Date(form.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                  <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
