"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FieldEditor, QuestionTypePicker } from "@/components/FieldEditor";
import { ShareDialog } from "@/components/ShareDialog";
import type { FormField, FieldType } from "@/types";

export default function FormEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [fields, setFields] = useState<FormField[]>([]);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then((res) => {
        if (res.status === 401) { router.push("/login"); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTitle(data.title);
        setDescription(data.description);
        setPublished(data.published);
        const rawFields: Record<string, unknown>[] = data.fields || [];
        const parsedFields = rawFields.map((f) => ({
          ...f,
          options: typeof f.options === "string" ? JSON.parse(f.options as string) : f.options || [],
        })) as FormField[];
        setFields(parsedFields);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const saveForm = useCallback(async () => {
    setSaving(true);
    const res = await fetch(`/api/forms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        fields: fields.map((f) => ({ ...f, options: f.options })),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.fields) {
        setFields((prev) =>
          prev.map((f) => {
            if (!f.id.startsWith("new_")) return f;
            const server = data.fields.find((sf: { order: number }) => sf.order === f.order);
            return server ? { ...f, id: server.id } : f;
          })
        );
      }
    }
    setSaving(false);
  }, [id, title, description, fields]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) saveForm();
    }, 2000);
    return () => clearTimeout(timer);
  }, [fields, title, description, loading, saveForm]);

  async function togglePublish() {
    const newPublished = !published;
    await saveForm();
    await fetch(`/api/forms/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: newPublished }),
    });
    setPublished(newPublished);
  }

  function addField(type: FieldType) {
    const newField: FormField = {
      id: `new_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      formId: id,
      type,
      title: "",
      description: "",
      required: false,
      order: fields.length,
      options:
        type === "multiple_choice" || type === "checkboxes" || type === "dropdown"
          ? [
              { id: `opt_${Date.now()}_1`, label: "Option 1" },
              { id: `opt_${Date.now()}_2`, label: "Option 2" },
            ]
          : [],
      other: false,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
    setShowAddPanel(false);
  }

  function updateField(fieldId: string, updates: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)));
  }

  function removeField(fieldId: string) {
    setFields((prev) => prev.filter((f) => f.id !== fieldId).map((f, i) => ({ ...f, order: i })));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFields(items.map((f, i) => ({ ...f, order: i })));
  }

  async function duplicateForm() {
    await saveForm();
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${title} (copy)`, description }),
    });
    const newForm = await res.json();
    await fetch(`/api/forms/${newForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${title} (copy)`,
        description,
        fields: fields.map((f) => ({ ...f, formId: newForm.id })),
      }),
    });
    router.push(`/forms/${newForm.id}/edit`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex h-13 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
            <Link href="/forms" className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-auto min-w-0 w-full sm:min-w-[240px] sm:w-auto border-none bg-transparent px-0 text-sm font-medium tracking-tight shadow-none focus-visible:ring-0 truncate"
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="hidden sm:inline text-xs font-medium whitespace-nowrap">
              <span className={saving ? "text-muted-foreground" : "text-emerald-600"}>
                {saving ? "Saving..." : "Saved"}
              </span>
            </span>
            <Button variant="ghost" size="sm" onClick={duplicateForm} className="hidden sm:inline-flex">
              Duplicate
            </Button>
            <Link href={`/forms/${id}/results`} className="inline-flex h-7 w-7 sm:w-auto items-center justify-center rounded-lg sm:px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="sm:hidden">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Responses</span>
            </Link>
            <Button
              variant={published ? "outline" : "default"}
              size="sm"
              onClick={togglePublish}
              className="rounded-full text-xs sm:text-sm px-2.5 sm:px-4"
            >
              {published ? "Published" : "Publish"}
            </Button>
            {published && (
              <ShareDialog formId={id} formTitle={title} />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 text-center sm:mb-8">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-auto border-none bg-transparent px-0 text-center text-xl sm:text-2xl font-normal tracking-tight text-foreground shadow-none focus-visible:ring-0"
              />
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form description..."
                className="mt-1.5 h-auto border-none bg-transparent px-0 text-center text-sm text-muted-foreground shadow-none focus-visible:ring-0"
              />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-6 shrink-0 cursor-grab p-1 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
                              >
                                <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <FieldEditor
                                  field={field}
                                  onChange={(updates) => updateField(field.id, updates)}
                                  onDelete={() => removeField(field.id)}
                                  isSelected={selectedFieldId === field.id}
                                  onSelect={() => setSelectedFieldId(field.id === selectedFieldId ? null : field.id)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowAddPanel(!showAddPanel)}
                className="gap-2 rounded-full text-muted-foreground hover:text-foreground"
              >
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add question
              </Button>
            </div>

            {showAddPanel && (
              <Card className="mt-4 p-4">
                <QuestionTypePicker onSelect={addField} />
              </Card>
            )}
          </div>
        </div>

        <div className="hidden w-60 border-l border-border/40 bg-parchment p-4 lg:block">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Question Types
          </h3>
          <QuestionTypePicker onSelect={addField} />
        </div>
      </div>
    </div>
  );
}
