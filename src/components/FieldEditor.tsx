"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CallIcon,
  CheckmarkSquare01Icon,
  DropdownFieldTypeIcon,
  GlobeIcon,
  HashIcon,
  InputLongTextIcon,
  InputShortTextIcon,
  Mail01Icon,
  RadioButtonIcon,
  SlidersHorizontalIcon,
  StarIcon,
  ToggleOnIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { FormField } from "@/types";
import { FIELD_TYPE_LABELS, type FieldType } from "@/types";

interface FieldEditorProps {
  field: FormField;
  onChange: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function FieldEditor({ field, onChange, onDelete, isSelected, onSelect }: FieldEditorProps) {
  function addOption() {
    const newOption = {
      id: `opt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: `Option ${field.options.length + 1}`,
    };
    onChange({ options: [...field.options, newOption] });
  }

  function updateOption(optId: string, label: string) {
    onChange({
      options: field.options.map((o) => (o.id === optId ? { ...o, label } : o)),
    });
  }

  function removeOption(optId: string) {
    onChange({ options: field.options.filter((o) => o.id !== optId) });
  }

  function renderFieldPreview() {
    switch (field.type) {
      case "short_text":
        return <div className="h-9 rounded-md bg-muted" />;
      case "long_text":
        return <div className="h-[72px] rounded-md bg-muted" />;
      case "multiple_choice":
        return (
          <div className="flex flex-col gap-1.5">
            {field.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <div className="size-4 rounded-full border-2 border-muted-foreground/30" />
                <span className="text-xs text-muted-foreground">{opt.label}</span>
              </div>
            ))}
          </div>
        );
      case "checkboxes":
        return (
          <div className="flex flex-col gap-1.5">
            {field.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <div className="size-4 rounded-sm border-2 border-muted-foreground/30" />
                <span className="text-xs text-muted-foreground">{opt.label}</span>
              </div>
            ))}
          </div>
        );
      case "dropdown":
        return (
          <div className="flex h-9 items-center justify-between rounded-md bg-muted px-3 text-xs text-muted-foreground">
            <span>Select an option</span>
            <span className="text-[10px]">▾</span>
          </div>
        );
      case "rating":
        return (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="size-8 rounded-full bg-muted" />
            ))}
          </div>
        );
      case "opinion_scale":
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="flex-1 h-10 rounded-md bg-muted" />
            ))}
          </div>
        );
      case "yes_no":
        return (
          <div className="flex gap-2">
            <div className="rounded-md bg-muted px-4 py-1.5 text-xs text-muted-foreground">Yes</div>
            <div className="rounded-md bg-muted px-4 py-1.5 text-xs text-muted-foreground">No</div>
          </div>
        );
      case "email":
      case "phone":
      case "website":
      case "number":
        return <div className="h-9 rounded-md bg-muted" />;
      case "date":
        return <div className="h-9 w-40 rounded-md bg-muted" />;
      case "file_upload":
        return (
          <div className="flex h-[72px] items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
            Click to upload
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "rounded-xl border-1.5 bg-card cursor-pointer transition-colors",
        isSelected ? "border-foreground" : "border-border hover:border-foreground/20"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {FIELD_TYPE_LABELS[field.type]}
              </span>
              {field.required && (
                <span className="text-[11px] text-destructive">*Required</span>
              )}
            </div>
            {isSelected ? (
              <input
                type="text"
                value={field.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Write a question..."
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-[15px] font-medium text-foreground outline-none border-none p-0"
              />
            ) : (
              <p className="text-[15px] font-medium text-foreground">
                {field.title || <span className="italic text-muted-foreground/30">Write a question...</span>}
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="shrink-0 p-1 rounded text-muted-foreground/30 hover:text-destructive transition-colors"
          >
            <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSelected && (
          <input
            type="text"
            value={field.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Add a description (optional)"
            onClick={(e) => e.stopPropagation()}
            className="mt-1.5 w-full bg-transparent text-xs text-muted-foreground outline-none border-none p-0"
          />
        )}

        <div className="mt-4">{renderFieldPreview()}</div>

        {isSelected && (field.type === "multiple_choice" || field.type === "checkboxes" || field.type === "dropdown") && (
          <div className="mt-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {field.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className="w-4 flex items-center justify-center text-muted-foreground">
                  <HugeiconsIcon
                    icon={
                      field.type === "multiple_choice"
                        ? RadioButtonIcon
                        : field.type === "checkboxes"
                          ? CheckmarkSquare01Icon
                          : DropdownFieldTypeIcon
                    }
                    size={12}
                  />
                </span>
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  className="flex-1 h-8 rounded-md border border-border bg-muted/50 px-2.5 text-xs text-foreground outline-none transition-colors focus:border-foreground"
                />
                <button
                  onClick={() => removeOption(opt.id)}
                  className="p-0.5 rounded text-muted-foreground/30 hover:text-destructive transition-colors"
                >
                  <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="self-start text-xs font-medium text-foreground hover:text-[var(--coral)] transition-colors py-1"
            >
              + Add option
            </button>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                checked={field.other}
                onChange={(e) => onChange({ other: e.target.checked })}
                className="accent-foreground"
              />
              <span className="text-xs text-muted-foreground">Add &ldquo;Other&rdquo; option</span>
            </div>
          </div>
        )}

        {isSelected && (
          <div className="mt-4 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onChange({ required: e.target.checked })}
                className="accent-foreground"
              />
              Required
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

const QUESTION_TYPES: { type: FieldType; icon: ReactNode; label: string }[] = [
  { type: "short_text", icon: <HugeiconsIcon icon={InputShortTextIcon} size={18} />, label: "Short Text" },
  { type: "long_text", icon: <HugeiconsIcon icon={InputLongTextIcon} size={18} />, label: "Long Text" },
  { type: "multiple_choice", icon: <HugeiconsIcon icon={RadioButtonIcon} size={18} />, label: "Multiple Choice" },
  { type: "checkboxes", icon: <HugeiconsIcon icon={CheckmarkSquare01Icon} size={18} />, label: "Checkboxes" },
  { type: "dropdown", icon: <HugeiconsIcon icon={DropdownFieldTypeIcon} size={18} />, label: "Dropdown" },
  { type: "rating", icon: <HugeiconsIcon icon={StarIcon} size={18} />, label: "Rating" },
  { type: "opinion_scale", icon: <HugeiconsIcon icon={SlidersHorizontalIcon} size={18} />, label: "Opinion Scale" },
  { type: "yes_no", icon: <HugeiconsIcon icon={ToggleOnIcon} size={18} />, label: "Yes/No" },
  { type: "email", icon: <HugeiconsIcon icon={Mail01Icon} size={18} />, label: "Email" },
  { type: "phone", icon: <HugeiconsIcon icon={CallIcon} size={18} />, label: "Phone" },
  { type: "website", icon: <HugeiconsIcon icon={GlobeIcon} size={18} />, label: "Website" },
  { type: "date", icon: <HugeiconsIcon icon={Calendar01Icon} size={18} />, label: "Date" },
  { type: "number", icon: <HugeiconsIcon icon={HashIcon} size={18} />, label: "Number" },
  { type: "file_upload", icon: <HugeiconsIcon icon={Upload01Icon} size={18} />, label: "File Upload" },
];

export function QuestionTypePicker({ onSelect }: { onSelect: (type: FieldType) => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      {QUESTION_TYPES.map((qt) => (
        <button
          key={qt.type}
          onClick={() => onSelect(qt.type)}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors"
        >
          <span className="w-7 flex items-center justify-center text-muted-foreground">{qt.icon}</span>
          <span>{qt.label}</span>
        </button>
      ))}
    </div>
  );
}
