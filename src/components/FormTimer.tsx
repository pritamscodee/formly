"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormTimerProps {
  formId: string;
  expiresAt: string | null;
  isActive: boolean;
  onUpdate: (expiresAt: string | null, isActive: boolean) => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expired";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocal(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function FormTimer({ formId, expiresAt, isActive, onUpdate }: FormTimerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [targetTime, setTargetTime] = useState<number | null>(null);

  const hasTimer = !!expiresAt && targetTime !== null;
  const isExpired = hasTimer && targetTime! <= Date.now();
  const effectiveActive = hasTimer && isActive && !isExpired;

  useEffect(() => {
    if (!expiresAt) {
      setTargetTime(null);
      setCountdown("");
      return;
    }
    const t = new Date(expiresAt).getTime();
    setTargetTime(t);

    const tick = () => {
      const remaining = t - Date.now();
      setCountdown(formatCountdown(remaining));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  useEffect(() => {
    if (open) {
      setValue(expiresAt ? toDatetimeLocal(expiresAt) : "");
    }
  }, [open, expiresAt]);

  const saveTimer = useCallback(async () => {
    if (!value) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${formId}/timer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expiresAt: new Date(value).toISOString(),
          isActive: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.expiresAt, data.isActive);
        setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }, [formId, value, onUpdate]);

  const toggleActive = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${formId}/timer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.expiresAt, data.isActive);
      }
    } finally {
      setSaving(false);
    }
  }, [formId, isActive, onUpdate]);

  const clearTimer = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${formId}/timer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresAt: null, isActive: true }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.expiresAt, data.isActive);
        setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }, [formId, onUpdate]);

  function getButtonStyle() {
    if (isExpired) return "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100";
    if (effectiveActive) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100";
    if (hasTimer && !isActive) return "bg-amber-50 text-amber-600 ring-1 ring-amber-200 hover:bg-amber-100";
    return "bg-muted text-muted-foreground hover:bg-muted/80";
  }

  function getButtonText() {
    if (!hasTimer) return null;
    if (isExpired) return "Expired";
    if (effectiveActive) return countdown;
    return "Paused";
  }

  const text = getButtonText();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-md h-7 px-2 sm:px-2.5 text-xs font-medium transition-colors cursor-pointer border-0 shrink-0 ${getButtonStyle()}`}
      >
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {text ? <span className="hidden sm:inline">{text}</span> : <span className="hidden sm:inline">Timer</span>}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Form Timer</DialogTitle>
            <DialogDescription>
              Set when this form should stop accepting responses.
            </DialogDescription>
          </DialogHeader>

          {hasTimer && (
            <div className={`rounded-lg p-3 ${
              isExpired ? "bg-red-50" : effectiveActive ? "bg-emerald-50" : "bg-amber-50"
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isExpired ? "Expired" : effectiveActive ? "Active" : "Paused"}
                  </div>
                  <div className={`mt-0.5 text-lg font-mono font-semibold ${
                    isExpired ? "text-red-600" : effectiveActive ? "text-emerald-700" : "text-amber-600"
                  }`}>
                    {isExpired ? "Form deactivated" : countdown}
                  </div>
                </div>
                {!isExpired && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleActive}
                    disabled={saving}
                    className="rounded-full text-xs shrink-0"
                  >
                    {isActive ? "Pause" : "Resume"}
                  </Button>
                )}
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                Expires {formatDateTime(expiresAt!)}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              {hasTimer ? "Change expiry date" : "Set expiry date & time"}
            </label>
            <Input
              type="datetime-local"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <DialogFooter className="flex-row gap-2 sm:gap-0">
            {hasTimer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTimer}
                disabled={saving}
                className="rounded-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
            <Button
              size="sm"
              onClick={saveTimer}
              disabled={!value || saving}
              className="rounded-full text-xs"
            >
              {saving ? "Saving..." : hasTimer ? "Update" : "Start"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
