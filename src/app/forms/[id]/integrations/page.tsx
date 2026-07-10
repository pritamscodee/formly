"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Envelope, MessageCircle2, CheckCircle,
  Plug, Bolt, InfoCircle,
} from "reicon-react";

interface ConnectedAccount {
  id: string;
  type: string;
  label: string;
}

interface FormIntegration {
  id: string;
  enabled: boolean;
  autoSend: boolean;
  settings: string;
  connectedAccount: ConnectedAccount;
}

export default function FormIntegrationsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [integrations, setIntegrations] = useState<FormIntegration[]>([]);
  const [formTitle, setFormTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  const [waPhoneId, setWaPhoneId] = useState("");
  const [waToken, setWaToken] = useState("");
  const [waLabel, setWaLabel] = useState("");
  const [waRecipient, setWaRecipient] = useState("");
  const [connectingWA, setConnectingWA] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/forms/${id}`).then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      }),
      fetch("/api/integrations").then((r) => r.ok ? r.json() : []),
      fetch(`/api/forms/${id}/integrations`).then((r) => r.ok ? r.json() : []),
    ]).then(([formData, accountsData, integrationsData]) => {
      if (formData) setFormTitle(formData.title);
      setAccounts(accountsData || []);
      setIntegrations(integrationsData || []);
    }).finally(() => setLoading(false));
  }, [id, router]);

  function getIntegration(accountId: string) {
    return integrations.find((fi) => fi.connectedAccount.id === accountId);
  }

  async function toggleIntegration(connectedAccountId: string, field: "enabled" | "autoSend", current: boolean) {
    const existing = getIntegration(connectedAccountId);
    setSaving(connectedAccountId);

    if (existing) {
      const res = await fetch(`/api/forms/${id}/integrations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: existing.id, [field]: !current }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIntegrations((prev) => prev.map((fi) => (fi.id === updated.id ? { ...fi, ...updated } : fi)));
      }
    } else {
      const res = await fetch(`/api/forms/${id}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedAccountId, [field]: !current, autoSend: field === "enabled" ? true : current }),
      });
      if (res.ok) {
        const created = await res.json();
        setIntegrations((prev) => [...prev, created]);
      }
    }
    setSaving(null);
  }

  function connectGmail() {
    window.location.href = `/api/integrations/gmail/connect?formId=${id}`;
  }

  async function connectWhatsApp() {
    if (!waPhoneId.trim() || !waToken.trim() || !waLabel.trim()) return;
    setConnectingWA(true);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          label: waLabel.trim(),
          config: {
            phoneNumberId: waPhoneId.trim(),
            apiToken: waToken.trim(),
            recipientPhone: waRecipient.trim(),
          },
        }),
      });
      if (res.ok) {
        const newAccount = await res.json();
        setAccounts((prev) => [...prev, newAccount]);
        setWaPhoneId("");
        setWaToken("");
        setWaLabel("");
        setWaRecipient("");
        setShowWhatsAppForm(false);
        const res2 = await fetch(`/api/forms/${id}/integrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connectedAccountId: newAccount.id, enabled: true, autoSend: true }),
        });
        if (res2.ok) {
          const created = await res2.json();
          setIntegrations((prev) => [...prev, created]);
        }
      }
    } finally {
      setConnectingWA(false);
    }
  }

  async function disconnect(accountId: string) {
    const integration = getIntegration(accountId);
    if (integration) {
      await fetch(`/api/forms/${id}/integrations/${integration.id}`, { method: "DELETE" });
      setIntegrations((prev) => prev.filter((fi) => fi.id !== integration.id));
    }
    await fetch(`/api/integrations/${accountId}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  const gmailAccount = accounts.find((a) => a.type === "gmail");
  const gmailIntegration = gmailAccount ? getIntegration(gmailAccount.id) : undefined;
  const whatsappAccounts = accounts.filter((a) => a.type === "whatsapp");

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex h-12 sm:h-13 max-w-4xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/forms/${id}/edit`} className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="truncate text-sm font-medium tracking-tight text-foreground">{formTitle}</h1>
            <span className="hidden sm:inline text-xs text-muted-foreground">/ Integrations</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">Integrations</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Connect services to automatically notify your team when someone submits this form.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Gmail */}
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
              <div className="flex size-10 sm:size-11 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                <Envelope size={20} color="#4285F4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-semibold text-foreground">Gmail</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Send email notifications with CSV & PDF attachments</div>
              </div>
              {gmailAccount ? (
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-1">
                    <CheckCircle size={16} color="#16a34a" />
                    <span className="text-xs font-medium text-green-600">Connected</span>
                  </div>
                  <button
                    onClick={() => toggleIntegration(gmailAccount.id, "enabled", gmailIntegration?.enabled ?? false)}
                    disabled={saving === gmailAccount.id}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      gmailIntegration?.enabled ? "bg-foreground" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        gmailIntegration?.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectGmail}
                  className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-4 rounded-lg bg-foreground text-white text-xs sm:text-sm font-medium shrink-0 transition-colors hover:bg-foreground/90"
                >
                  <Plug size={14} />
                  <span className="hidden sm:inline">Connect</span>
                  <span className="sm:hidden">Link</span>
                </button>
              )}
            </div>

            {gmailAccount && (
              <div className="border-t border-border/50 p-3 sm:p-4 bg-parchment/50">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-foreground truncate">{gmailAccount.label}</div>
                    <div className="text-xs text-muted-foreground">Google account</div>
                  </div>
                  <button
                    onClick={() => disconnect(gmailAccount.id)}
                    className="text-xs text-destructive hover:text-destructive/80 shrink-0 px-2 py-1 rounded transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
                {gmailIntegration?.enabled && (
                  <label className="flex items-center gap-2 cursor-pointer p-2 sm:p-2.5 rounded-md bg-white border border-border">
                    <input
                      type="checkbox"
                      checked={gmailIntegration.autoSend}
                      onChange={() => toggleIntegration(gmailAccount.id, "autoSend", gmailIntegration.autoSend)}
                      disabled={saving === gmailAccount.id}
                      className="size-4 rounded border-border accent-foreground"
                    />
                    <div className="flex items-center gap-1">
                      <Bolt size={13} color="#f59e0b" />
                      <span className="text-xs sm:text-sm text-foreground">Auto-send on every new response</span>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
              <div className="flex size-10 sm:size-11 items-center justify-center rounded-lg bg-emerald-50 shrink-0">
                <MessageCircle2 size={20} color="#25D366" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-semibold text-foreground">WhatsApp Business</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Send response summaries via WhatsApp</div>
              </div>
              {whatsappAccounts.length > 0 ? (
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-1">
                    <CheckCircle size={16} color="#16a34a" />
                    <span className="text-xs font-medium text-green-600">Connected</span>
                  </div>
                  <button
                    onClick={() => {
                      const first = whatsappAccounts[0];
                      const integ = getIntegration(first.id);
                      toggleIntegration(first.id, "enabled", integ?.enabled ?? false);
                    }}
                    disabled={saving === whatsappAccounts[0]?.id}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      getIntegration(whatsappAccounts[0]?.id)?.enabled ? "bg-foreground" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        getIntegration(whatsappAccounts[0]?.id)?.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWhatsAppForm(!showWhatsAppForm)}
                  className={`inline-flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium shrink-0 transition-colors ${
                    showWhatsAppForm
                      ? "bg-muted text-foreground border border-border"
                      : "bg-foreground text-white"
                  }`}
                >
                  <Plug size={14} />
                  <span className="hidden sm:inline">Connect</span>
                  <span className="sm:hidden">Link</span>
                </button>
              )}
            </div>

            {whatsappAccounts.length > 0 && (
              <div className="border-t border-border/50 p-3 sm:p-4 bg-parchment/50">
                {whatsappAccounts.map((acc) => {
                  const integ = getIntegration(acc.id);
                  return (
                    <div key={acc.id}>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-foreground truncate">{acc.label}</div>
                          <div className="text-xs text-muted-foreground">WhatsApp Business API</div>
                        </div>
                        <button
                          onClick={() => disconnect(acc.id)}
                          className="text-xs text-destructive hover:text-destructive/80 shrink-0 px-2 py-1 rounded transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                      {integ?.enabled && (
                        <label className="flex items-center gap-2 cursor-pointer p-2 sm:p-2.5 rounded-md bg-white border border-border">
                          <input
                            type="checkbox"
                            checked={integ.autoSend}
                            onChange={() => toggleIntegration(acc.id, "autoSend", integ.autoSend)}
                            disabled={saving === acc.id}
                            className="size-4 rounded border-border accent-foreground"
                          />
                          <div className="flex items-center gap-1">
                            <Bolt size={13} color="#f59e0b" />
                            <span className="text-xs sm:text-sm text-foreground">Auto-send on every new response</span>
                          </div>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {showWhatsAppForm && (
              <div className="border-t border-border/50 p-4 sm:p-5 bg-parchment/50">
                <div className="flex flex-col gap-3">
                  <div className="text-xs sm:text-sm font-medium text-foreground">WhatsApp Business API credentials</div>
                  <input placeholder="Label (e.g. My Business)" value={waLabel} onChange={(e) => setWaLabel(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm text-foreground bg-white outline-none focus:ring-2 focus:ring-ring" />
                  <input placeholder="Phone Number ID" value={waPhoneId} onChange={(e) => setWaPhoneId(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm text-foreground bg-white outline-none focus:ring-2 focus:ring-ring" />
                  <input placeholder="API Token" type="password" value={waToken} onChange={(e) => setWaToken(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm text-foreground bg-white outline-none focus:ring-2 focus:ring-ring" />
                  <input placeholder="Recipient phone (e.g. +1234567890)" value={waRecipient} onChange={(e) => setWaRecipient(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm text-foreground bg-white outline-none focus:ring-2 focus:ring-ring" />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={connectWhatsApp}
                      disabled={connectingWA || !waPhoneId.trim() || !waToken.trim() || !waLabel.trim()}
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-white text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                      {connectingWA ? "Connecting..." : "Connect WhatsApp"}
                    </button>
                    <button
                      onClick={() => setShowWhatsAppForm(false)}
                      className="h-9 px-4 rounded-lg bg-transparent text-muted-foreground border border-border text-sm transition-colors hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2.5">
            <InfoCircle size={18} color="#3b82f6" className="mt-0.5 shrink-0" />
            <div className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <strong>How it works:</strong> Enable an integration and toggle auto-send to receive CSV & PDF attachments via Gmail, or response summaries via WhatsApp, every time someone submits this form.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
