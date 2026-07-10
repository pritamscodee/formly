import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmailWithAttachments } from "@/lib/gmail";
import { sendWhatsAppMessage, buildFormSummaryMessage } from "@/lib/whatsapp";
import { generateCSV, generatePDF } from "@/lib/export";

async function triggerAutoSend(
  formId: string,
  _submissionId: string,
  answers: { fieldId: string; value: string }[]
) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: { orderBy: { order: "asc" } },
        formIntegrations: {
          where: { enabled: true, autoSend: true },
          include: { connectedAccount: true },
        },
      },
    });

    if (!form || form.formIntegrations.length === 0) return;
    if (!form.isActive) return;
    if (form.expiresAt && new Date(form.expiresAt).getTime() <= Date.now()) return;

    const channels = await prisma.channel.findMany({ where: { formId } });
    const allSubmissions = await prisma.submission.findMany({
      where: { formId },
      include: { answers: true },
      orderBy: { createdAt: "desc" },
    });

    const exportForm = {
      title: form.title,
      fields: form.fields.map((f: { id: string; type: string; title: string }) => ({ id: f.id, type: f.type, title: f.title })),
    };

    const exportSubs = allSubmissions.map((s) => ({
      id: s.id,
      channelId: s.channelId,
      createdAt: s.createdAt.toISOString(),
      answers: s.answers.map((a) => ({ fieldId: a.fieldId, value: a.value })),
    }));

    const exportChannels = channels.map((c) => ({ id: c.id, name: c.name }));

    const fieldMap = new Map<string, string>(form.fields.map((f: { id: string; title: string }) => [f.id, f.title]));
    const answerDetails = answers
      .map((a) => ({
        fieldTitle: fieldMap.get(a.fieldId) || a.fieldId,
        value: (() => {
          try {
            const parsed = JSON.parse(a.value);
            return Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
          } catch {
            return a.value;
          }
        })(),
      }))
      .filter((a) => a.value);

    const submissionDate = new Date().toLocaleString();

    for (const fi of form.formIntegrations) {
      const config = JSON.parse(fi.connectedAccount.config);

      if (fi.connectedAccount.type === "gmail" && config.access_token && config.refresh_token) {
        const subject = `New Response: ${form.title}`;
        const htmlBody = `
          <h2 style="font-family:sans-serif;color:#17171c">New Response: ${form.title}</h2>
          <p style="font-family:sans-serif;color:#616161">Received on ${submissionDate}</p>
          <table style="border-collapse:collapse;font-family:sans-serif;width:100%">
            ${answerDetails
              .map(
                (a) => `
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:500;color:#17171c;width:40%">${a.fieldTitle}</td>
                <td style="padding:8px;border-bottom:1px solid #e5e7eb;color:#616161">${a.value}</td>
              </tr>`
              )
              .join("")}
          </table>
        `;

        const csvBuffer = Buffer.from(generateCSV(exportForm, exportSubs, exportChannels));
        const pdfDoc = generatePDF(exportForm, exportSubs, exportChannels);
        const pdfBuffer = Buffer.from(pdfDoc.output("arraybuffer"));

        sendEmailWithAttachments(
          config,
          config.email,
          subject,
          htmlBody,
          [
            { filename: `${form.title.replace(/[^a-z0-9]/gi, "_")}_all_responses.csv`, content: csvBuffer, mimeType: "text/csv" },
            { filename: `${form.title.replace(/[^a-z0-9]/gi, "_")}_all_responses.pdf`, content: pdfBuffer, mimeType: "application/pdf" },
          ]
        ).catch((e) => console.error("Auto-send Gmail failed:", e));
      }

      if (fi.connectedAccount.type === "whatsapp" && config.phoneNumberId && config.apiToken) {
        const message = buildFormSummaryMessage(form.title, answerDetails, submissionDate);
        sendWhatsAppMessage(config, config.recipientPhone || "", message).catch((e) =>
          console.error("Auto-send WhatsApp failed:", e)
        );
      }
    }
  } catch (error) {
    console.error("triggerAutoSend error:", error);
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const formId = url.searchParams.get("formId");

    if (!formId) {
      return NextResponse.json({ error: "formId required" }, { status: 400 });
    }

    const form = await prisma.form.findFirst({
      where: { id: formId, userId: session.user.id },
    });

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const submissions = await prisma.submission.findMany({
      where: { formId },
      include: { answers: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { formId, answers, channelRef } = await req.json();

    if (!formId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { fields: true },
    });

    if (!form || !form.published) {
      return NextResponse.json({ error: "Form not found or not published" }, { status: 404 });
    }

    if (!form.isActive) {
      return NextResponse.json({ error: "Form is paused" }, { status: 403 });
    }

    if (form.expiresAt && new Date(form.expiresAt).getTime() <= Date.now()) {
      await prisma.form.update({
        where: { id: formId },
        data: { isActive: false },
      });
      return NextResponse.json({ error: "Form has expired" }, { status: 403 });
    }

    const validFieldIds = new Set(form.fields.map((f) => f.id));
    for (const a of answers) {
      if (!validFieldIds.has(a.fieldId)) {
        return NextResponse.json({ error: `Invalid fieldId: ${a.fieldId}` }, { status: 400 });
      }
    }

    const channel = channelRef
      ? await prisma.channel.findUnique({ where: { trackingCode: channelRef } })
      : null;

    const submission = await prisma.submission.create({
      data: {
        formId,
        channelId: channel?.id ?? null,
        answers: {
          create: answers.map((a: { fieldId: string; value: string }) => ({
            fieldId: a.fieldId,
            value: typeof a.value === "string" ? a.value : JSON.stringify(a.value),
          })),
        },
      },
      include: { answers: true },
    });

    triggerAutoSend(formId, submission.id, answers);

    return NextResponse.json(submission);
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
