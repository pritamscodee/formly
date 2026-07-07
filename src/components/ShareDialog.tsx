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
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription as CardDesc } from "@/components/ui/card";

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
    return `\u{1F4CB} Form: ${name}\n\u{1F517} Link: ${link}\n\nPlease fill out the form before the meeting.`;
  }
  return `Please fill out this form: ${name}\n${link}`;
}

export function ShareDialog({ formId, formTitle, trigger }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [lastCopiedAction, setLastCopiedAction] = useState<string | null>(null);

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

        <div className="flex flex-col gap-3">
          {/* Direct link card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle>Direct form link</CardTitle>
              <CardDesc>No tracking attached</CardDesc>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5">
                <code className="flex-1 truncate rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                  {`${baseUrl}/s/${formId}`}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copy(`${baseUrl}/s/${formId}`, "direct_link")}
                >
                  {lastCopiedAction === "direct_link" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create channel card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle>Add a distribution channel</CardTitle>
              <CardDesc>Track where your submissions come from</CardDesc>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. WhatsApp Group A, Zoom Q1 All-Hands"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={newChannelType}
                    onChange={(e) => setNewChannelType(e.target.value)}
                    className="h-9 appearance-none rounded-lg border border-border bg-card px-2 pr-6 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            </CardContent>
          </Card>

          <Separator />

          {/* Channel list */}
          {loading ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Loading channels...</p>
          ) : channels.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No channels yet. Create one above to start tracking submissions.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {channels.map((ch) => {
                const link = channelLink(ch);
                const msg = generateMessage(ch.name, link, ch.type);
                return (
                  <Card key={ch.id} size="sm">
                    <CardHeader>
                      <CardTitle className="truncate">{ch.name}</CardTitle>
                      <CardDesc>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
                          {CHANNEL_TYPE_LABELS[ch.type] || ch.type}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          {ch._count.submissions} submission{ch._count.submissions !== 1 ? "s" : ""}
                        </span>
                      </CardDesc>
                      <CardAction>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteChannel(ch.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {/* Tracking link */}
                        <div className="flex items-center gap-1.5">
                          <code className="flex-1 truncate rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                            {link}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copy(link, `tracking_${ch.id}`)}
                          >
                            {lastCopiedAction === `tracking_${ch.id}` ? "Copied!" : "Copy"}
                          </Button>
                        </div>

                        {/* Meeting link input */}
                        {ch.type === "meet" && (
                          <Input
                            placeholder="Paste your Zoom/Google Meet link here..."
                            value={meetingLinks[ch.id] || ""}
                            onChange={(e) =>
                              setMeetingLinks({ ...meetingLinks, [ch.id]: e.target.value })
                            }
                          />
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          {ch.type === "whatsapp" && (
                            <Button variant="outline" size="sm" onClick={() => openWhatsApp(ch)}>
                              Open WhatsApp
                            </Button>
                          )}
                          {ch.type === "email" && (
                            <Button variant="outline" size="sm" onClick={() => openEmail(ch)}>
                              Open Email
                            </Button>
                          )}
                          {ch.type === "meet" && (
                            <Button variant="outline" size="sm" onClick={() => copyMeetingSnippet(ch)}>
                              {lastCopiedAction === `meet_${ch.id}` ? "Copied!" : "Copy snippet"}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => copy(msg, `message_${ch.id}`)}>
                            {lastCopiedAction === `message_${ch.id}` ? "Copied!" : "Copy message"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setQrChannelId(qrChannelId === ch.id ? null : ch.id)}>
                            {qrChannelId === ch.id ? "Hide QR" : "QR Code"}
                          </Button>
                        </div>

                        {/* QR Code */}
                        {qrChannelId === ch.id && (
                          <div className="rounded-lg bg-muted/30 p-4 text-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(link)}`}
                              alt="QR Code"
                              className="mx-auto rounded-lg"
                              width={120}
                              height={120}
                            />
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              Scan to open form on phone
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
