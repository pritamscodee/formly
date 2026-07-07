import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
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

    return NextResponse.json(submission);
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
