"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Channel {
  id: string;
  name: string;
  type: string;
  trackingCode: string;
  createdAt: string;
  _count: { submissions: number };
}

interface ShareDialogProps {
  formId: string;
  formTitle: string;
  trigger?: React.ReactNode;
}

const CHANNEL_TYPE_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  meet: "Zoom / Google Meet",
  other: "Other",
};

function generateMessage(name: string, link: string, type: string) {
  if (type === "whatsapp") {
    return `Hi! Please fill out this form: "${name}"\n\n${link}`;
  }
  if (type === "email") {
    return `Form: ${name}\n\nPlease fill out this form:\n${link}`;
  }
  if (type === "meet") {
    return `📋 Form: ${name}\n🔗 Link: ${link}\n\nPlease fill out the form before the meeting.`;
  }
  return `Please fill out this form: ${name}\n${link}`;
}

export function ShareDialog({ formId, formTitle, trigger }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [lastCopiedAction, setLastCopiedAction] = useState<string | null>(null);

  // Channel management state
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState("whatsapp");
  const [creating, setCreating] = useState(false);
  const [qrChannelId, setQrChannelId] = useState<string | null>(null);
  const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : "";

  function copy(text: string, actionKey: string) {
    navigator.clipboard.writeText(text);
    setLastCopiedAction(actionKey);
    setTimeout(() => setLastCopiedAction(null), 2000);
  }

  async function fetchChannels() {
    setLoading(true);
    try {
      const res = await fetch(`/api/forms/${formId}/channels`);
      if (res.ok) setChannels(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) fetchChannels();
  }, [open, formId]);

  async function createChannel() {
    if (!newChannelName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/forms/${formId}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChannelName.trim(), type: newChannelType }),
      });
      if (res.ok) {
        setNewChannelName("");
        await fetchChannels();
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  }

  async function deleteChannel(channelId: string) {
    try {
      const res = await fetch(`/api/forms/${formId}/channels/${channelId}`, {
        method: "DELETE",
      });
      if (res.ok) await fetchChannels();
    } catch {
      // ignore
    }
  }

  function channelLink(channel: Channel) {
    return `${baseUrl}/s/${formId}?ref=${channel.trackingCode}`;
  }

  function openWhatsApp(channel: Channel) {
    const msg = generateMessage(channel.name, channelLink(channel), "whatsapp");
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function openEmail(channel: Channel) {
    const subject = encodeURIComponent(`Form: ${channel.name}`);
    const body = encodeURIComponent(generateMessage(channel.name, channelLink(channel), "email"));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  function copyMeetingSnippet(channel: Channel) {
    const meetingLink = meetingLinks[channel.id];
    let msg = generateMessage(channel.name, channelLink(channel), "meet");
    if (meetingLink) msg += `\n\nMeeting link: ${meetingLink}`;
    copy(msg, `meet_${channel.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1.5"
          onClick={() => setOpen(true)}
        >
          <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share & Integrate
        </Button>
      )}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Share &ldquo;{formTitle}&rdquo;</DialogTitle>
          <DialogDescription>
            Create tracked channels to distribute your form and see where submissions come from.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Direct link (no tracking) */}
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Direct form link</p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                No tracking
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <code className="flex-1 truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                {`${baseUrl}/s/${formId}`}
              </code>
              <button
                onClick={() => copy(`${baseUrl}/s/${formId}`, "direct_link")}
                className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {lastCopiedAction === "direct_link" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              Share this link anywhere — no tracking code attached.
            </p>
          </div>

          {/* Create new channel */}
          <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">Add a distribution channel</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. WhatsApp Group A, Zoom Q1 All-Hands"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="flex-1 text-sm"
              />
              <select
                value={newChannelType}
                onChange={(e) => setNewChannelType(e.target.value)}
                className="h-8 appearance-none rounded-lg border border-border bg-card px-2 pr-6 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center", backgroundSize: "14px" }}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="meet">Zoom/Meet</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button
              size="sm"
              onClick={createChannel}
              disabled={creating || !newChannelName.trim()}
              className="self-end"
            >
              {creating ? "Creating..." : "Add Channel"}
            </Button>
          </div>

          <Separator />

          {/* Channel list */}
          {loading ? (
            <p className="text-center text-xs text-muted-foreground py-4">Loading channels...</p>
          ) : channels.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-4">
              No channels yet. Create one above to start tracking submissions.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {channels.map((ch) => {
                const link = channelLink(ch);
                const msg = generateMessage(ch.name, link, ch.type);
                return (
                  <div key={ch.id} className="rounded-xl border border-border p-3">
                    {/* Channel header */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm font-medium text-foreground truncate">{ch.name}</span>
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          {CHANNEL_TYPE_LABELS[ch.type] || ch.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground">
                          {ch._count.submissions} sub{ch._count.submissions !== 1 ? "s" : ""}
                        </span>
                        <button
                          onClick={() => deleteChannel(ch.id)}
                          className="text-[11px] text-destructive hover:text-destructive transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Tracking link */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <code className="flex-1 truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                        {link}
                      </code>
                      <button
                        onClick={() => copy(link, `tracking_${ch.id}`)}
                        className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {lastCopiedAction === `tracking_${ch.id}` ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    {/* Meeting link input for Zoom/Meet channels */}
                    {ch.type === "meet" && (
                      <input
                        type="text"
                        placeholder="Paste your Zoom/Google Meet link here..."
                        value={meetingLinks[ch.id] || ""}
                        onChange={(e) =>
                          setMeetingLinks({ ...meetingLinks, [ch.id]: e.target.value })
                        }
                        className="mb-2 w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-[11px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
                      />
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {ch.type === "whatsapp" && (
                        <button
                          onClick={() => openWhatsApp(ch)}
                          className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Open WhatsApp
                        </button>
                      )}
                      {ch.type === "email" && (
                        <button
                          onClick={() => openEmail(ch)}
                          className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Open Email
                        </button>
                      )}
                      {ch.type === "meet" && (
                        <button
                          onClick={() => copyMeetingSnippet(ch)}
                          className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {lastCopiedAction === `meet_${ch.id}` ? "Copied!" : "Copy snippet"}
                        </button>
                      )}
                      <button
                        onClick={() => copy(msg, `message_${ch.id}`)}
                        className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {lastCopiedAction === `message_${ch.id}` ? "Copied!" : "Copy message"}
                      </button>
                      <button
                        onClick={() => setQrChannelId(qrChannelId === ch.id ? null : ch.id)}
                        className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {qrChannelId === ch.id ? "Hide QR" : "QR Code"}
                      </button>
                    </div>

                    {/* QR Code */}
                    {qrChannelId === ch.id && (
                      <div className="mt-3 rounded-lg bg-muted/30 p-3 text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(link)}`}
                          alt="QR Code"
                          className="mx-auto rounded-lg"
                          width={120}
                          height={120}
                        />
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Scan to open form on phone
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
