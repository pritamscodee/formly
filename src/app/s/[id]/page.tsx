"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import type { FormField } from "@/types";

interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

type Answers = Record<string, string | string[] | number>;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
  }),
};

function buildZodSchema(fields: { id: string; type: string; required: boolean }[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    let s: z.ZodTypeAny;
    switch (field.type) {
      case "email":
        s = z.string().email("Invalid email address");
        break;
      case "phone":
        s = z.string().regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number");
        break;
      case "website":
        s = z.string().url("Invalid URL");
        break;
      case "number":
        s = z.string().regex(/^\d+$/, "Must be a number");
        break;
      case "multiple_choice":
      case "dropdown":
        s = z.string().min(1, "Please select an option");
        break;
      case "checkboxes":
        s = z.array(z.string()).min(1, "Select at least one option");
        break;
      case "rating":
      case "opinion_scale":
        s = z.number().min(1, "Please select a value");
        break;
      case "yes_no":
        s = z.string().min(1, "Please select an option");
        break;
      case "date":
        s = z.string().min(1, "Please select a date");
        break;
      default:
        s = z.string().min(1, "This field is required");
    }
    shape[field.id] = field.required ? s : (s as z.ZodString).optional().or(z.literal(""));
  }
  return z.object(shape);
}

export default function PublicFormPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(0);

  const channelRef = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("ref")
    : null;

  const [dynamicSchema, setDynamicSchema] = useState<z.ZodObject<Record<string, z.ZodTypeAny>> | null>(null);

  const formMethods = useForm<Answers>({
    resolver: dynamicSchema ? (zodResolver(dynamicSchema) as never) : undefined,
    defaultValues: {},
  });

  const { getValues, setValue, trigger, watch } = formMethods;

  useEffect(() => {
    fetch(`/api/forms/${id}/public`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const rawFields: Record<string, unknown>[] = data.fields || [];
          const parsedFields: FormField[] = rawFields.map((f) => {
            let parsed: unknown;
            try {
              parsed = typeof f.options === "string" ? JSON.parse(f.options as string) : f.options;
            } catch {
              parsed = [];
            }
            return { ...f, options: Array.isArray(parsed) ? parsed : [] } as FormField;
          }) as FormField[];
          const formData = { ...data, fields: parsedFields };
          setForm(formData);
          setDynamicSchema(buildZodSchema(parsedFields));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const progress = form?.fields.length ? ((currentFieldIndex + 1) / form.fields.length) * 100 : 0;
  const field = form?.fields[currentFieldIndex];
  const isLast = currentFieldIndex === (form?.fields.length ?? 0) - 1;
  const currentAnswer = field ? watch(field.id) : undefined;

  function setAnswer(value: string | string[] | number) {
    if (!field) return;
    setValue(field.id, value);
    setError("");
  }

  const handleSubmit = useCallback(async () => {
    if (!form) return;
    setSubmitting(true);
    setError("");

    const values = getValues();
    const formattedAnswers = form.fields.map((f) => ({
      fieldId: f.id,
      value: values[f.id] ?? "",
    }));

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: form.id, answers: formattedAnswers, channelRef }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }, [form, getValues, channelRef]);

  const handleNext = useCallback(async () => {
    if (!field) return;
    const isValid = await trigger(field.id);
    if (!isValid) {
      const message = formMethods.formState.errors[field.id]?.message as string | undefined;
      setError(message || "This field is required");
      return;
    }
    setDirection(1);
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentFieldIndex((prev) => prev + 1);
    }
  }, [field, isLast, trigger, handleSubmit]);

  function handleBack() {
    setDirection(-1);
    setCurrentFieldIndex((prev) => Math.max(0, prev - 1));
    setError("");
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && !submitting && form) {
      handleNext();
    }
  }, [handleNext, submitting, form]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="text-center">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Form not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This form may not exist or has been unpublished.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-foreground"
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--color-background)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="mb-3 text-3xl font-normal tracking-tight text-foreground">Thank you!</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your response has been recorded.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!field) return null;

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-foreground"
          style={{ transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="mb-3 text-center">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Question {currentFieldIndex + 1} of {form.fields.length}
            </span>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentFieldIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="mb-2 text-center text-xl sm:text-[26px] font-normal leading-tight tracking-tight text-foreground px-2">
                {field.title}
              </h1>
              {field.description && (
                <p className="mb-4 sm:mb-6 text-center text-sm leading-relaxed text-muted-foreground">
                  {field.description}
                </p>
              )}
              {field.required && (
                <p className="mb-4 sm:mb-6 text-center text-xs text-destructive">*Required</p>
              )}

              <div className="mt-4 sm:mt-6">
                {renderField(field, currentAnswer, setAnswer)}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-xs text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between sm:mt-10">
            <motion.button
              onClick={handleBack}
              disabled={currentFieldIndex === 0}
              whileHover={currentFieldIndex > 0 ? { x: -2 } : {}}
              whileTap={currentFieldIndex > 0 ? { scale: 0.97 } : {}}
              className={`min-w-16 py-3 text-sm transition-colors ${
                currentFieldIndex === 0
                  ? "text-transparent pointer-events-none"
                  : "cursor-pointer text-muted-foreground hover:text-foreground"
              }`}
              style={{ background: "none", border: "none" }}
            >
              ← Back
            </motion.button>

            <motion.button
              onClick={() => handleNext()}
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 sm:px-7 sm:py-3 text-sm font-medium text-background transition-opacity min-w-[100px] ${
                submitting ? "cursor-default opacity-60" : "cursor-pointer"
              }`}
              style={{ border: "none" }}
            >
              {submitting ? "Submitting..." : isLast ? "Submit" : "OK"}
              <span className="ml-1.5 opacity-50 hidden sm:inline">↵</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderField(
  field: FormField,
  answer: string | string[] | number | undefined,
  setAnswer: (value: string | string[] | number) => void,
) {
  switch (field.type) {
    case "short_text":
    case "email":
    case "phone":
    case "website":
    case "number":
      return (
        <input
          type={
            field.type === "email" ? "email" :
            field.type === "phone" ? "tel" :
            field.type === "website" ? "url" :
            field.type === "number" ? "number" : "text"
          }
          value={(answer as string) || ""}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={
            field.type === "email" ? "you@example.com" :
            field.type === "phone" ? "+1 234 567 890" :
            field.type === "website" ? "https://example.com" :
            "Type your answer..."
          }
          className="w-full border-0 border-b-2 border-border bg-transparent px-0 py-2 text-lg text-foreground outline-none transition-colors focus:border-foreground"
          autoFocus
        />
      );

    case "long_text":
      return (
        <textarea
          value={(answer as string) || ""}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          rows={3}
          className="w-full resize-none border-0 border-b-2 border-border bg-transparent px-0 py-2 text-lg text-foreground outline-none transition-colors focus:border-foreground"
          autoFocus
        />
      );

    case "multiple_choice": {
      const options = Array.isArray(field.options) ? field.options : [];
      return (
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => {
            const selected = answer === opt.label;
            return (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setAnswer(opt.label)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4.5 py-3.5 text-left text-sm transition-all min-h-[48px] ${
                  selected
                    ? "border-1.5 border-foreground bg-parchment font-medium text-foreground"
                    : "border-1.5 border-border bg-card font-normal text-muted-foreground"
                }`}
              >
                <div
                  className={`shrink-0 rounded-full transition-all ${
                    selected ? "border-[5px] border-foreground bg-foreground" : "border-2 border-muted-foreground/30 bg-transparent"
                  }`}
                  style={{ width: 22, height: 22 }}
                />
                <span>{opt.label}</span>
              </motion.button>
            );
          })}
          {field.other && <OtherOption getAnswer={answer} setAnswer={setAnswer} />}
        </div>
      );
    }

    case "checkboxes":
      return (
        <div className="flex flex-col gap-2.5">
          {(Array.isArray(field.options) ? field.options : []).map((opt) => {
            const current = (answer as string[]) || [];
            const checked = current.includes(opt.label);
            return (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  const newVal = checked
                    ? current.filter((v) => v !== opt.label)
                    : [...current, opt.label];
                  setAnswer(newVal);
                }}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4.5 py-3.5 text-left text-sm transition-all min-h-[48px] ${
                  checked
                    ? "border-1.5 border-foreground bg-parchment font-medium text-foreground"
                    : "border-1.5 border-border bg-card font-normal text-muted-foreground"
                }`}
              >
                <div
                  className={`flex shrink-0 items-center justify-center rounded-md transition-all ${
                    checked ? "border-1.5 border-foreground bg-foreground" : "border-2 border-muted-foreground/30 bg-transparent"
                  }`}
                  style={{ width: 22, height: 22 }}
                >
                  {checked && (
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-background)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
      );

    case "dropdown":
      return (
        <select
          value={(answer as string) || ""}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-xl border-1.5 border-border bg-card px-4.5 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-foreground"
          autoFocus
        >
          <option value="" className="text-muted-foreground">Select an option...</option>
          {(Array.isArray(field.options) ? field.options : []).map((opt) => (
            <option key={opt.id} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      );

    case "rating":
      return (
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = answer === n;
            return (
              <motion.button
                key={n}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAnswer(n)}
                className={`flex size-14 items-center justify-center rounded-full text-lg font-medium transition-all ${
                  selected
                    ? "border-1.5 border-foreground bg-foreground text-background"
                    : "border-1.5 border-border bg-card text-muted-foreground"
                }`}
              >
                {n}
              </motion.button>
            );
          })}
        </div>
      );

    case "opinion_scale":
      return (
        <div className="text-center">
          <div className="mb-2.5 flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => {
              const selected = answer === n;
              return (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAnswer(n)}
                  className={`flex size-11 sm:size-11 items-center justify-center rounded-lg text-sm font-medium transition-all h-[60px] sm:h-[60px] ${
                    selected
                      ? "border-1.5 border-foreground bg-foreground text-background"
                      : "border-1.5 border-border bg-card text-muted-foreground"
                  }`}
                >
                  {n}
                </motion.button>
              );
            })}
          </div>
          <div className="flex justify-between px-1 text-xs text-muted-foreground">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
        </div>
      );

    case "yes_no":
      return (
        <div className="flex justify-center gap-4">
          {["Yes", "No"].map((opt) => {
            const selected = answer === opt;
            return (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnswer(opt)}
                className={`min-w-[140px] rounded-xl px-8 py-4 text-base transition-all ${
                  selected
                    ? "border-1.5 border-foreground bg-parchment font-medium text-foreground"
                    : "border-1.5 border-border bg-card font-normal text-muted-foreground"
                }`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      );

    case "date":
      return (
        <input
          type="date"
          value={(answer as string) || ""}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-xl border-1.5 border-border bg-card px-4.5 py-3.5 text-base text-foreground outline-none transition-colors focus:border-foreground"
          autoFocus
        />
      );

    case "file_upload":
      return (
        <div className="cursor-pointer rounded-xl border-2 border-dashed border-border py-12 text-center text-muted-foreground transition-colors hover:border-foreground">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto mb-3 block">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm">Click to upload files</p>
        </div>
      );

    default:
      return null;
  }
}

function OtherOption({
  getAnswer,
  setAnswer,
}: {
  getAnswer: string | string[] | number | undefined;
  setAnswer: (value: string | string[] | number) => void;
}) {
  const [showInput, setShowInput] = useState(false);

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => { setShowInput(!showInput); if (!showInput) setAnswer("__other__"); }}
        className="flex w-full items-center gap-3.5 rounded-xl border-1.5 border-border bg-card px-4.5 py-3.5 text-left text-sm text-muted-foreground transition-colors"
      >
        <div
          className="shrink-0 rounded-full border-2 border-muted-foreground/30"
          style={{ width: 22, height: 22 }}
        />
        <span>Other</span>
      </motion.button>
      {showInput && (
        <motion.input
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          type="text"
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Please specify..."
          className="mt-2 w-full border-0 border-b-2 border-border bg-transparent px-1 py-2 text-base text-foreground outline-none"
          autoFocus
        />
      )}
    </div>
  );
}
