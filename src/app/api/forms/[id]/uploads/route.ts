import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const form = await prisma.form.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const submissions = await prisma.submission.findMany({
      where: { formId: id },
      include: { answers: true },
    });

    const uploads: {
      url: string;
      name: string;
      type: string;
      bytes: number;
      submittedAt: string;
      submissionId: string;
      respondentEmail: string | null;
    }[] = [];

    for (const sub of submissions) {
      for (const answer of sub.answers) {
        try {
          const parsed = JSON.parse(answer.value);
          if (parsed && typeof parsed === "object" && parsed.url) {
            uploads.push({
              url: parsed.url,
              name: parsed.name || "Untitled",
              type: parsed.type || "application/octet-stream",
              bytes: parsed.bytes || 0,
              submittedAt: sub.createdAt.toISOString(),
              submissionId: sub.id,
              respondentEmail: sub.respondentEmail || null,
            });
          }
        } catch {
          // not a file upload
        }
      }
    }

    uploads.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json(uploads);
  } catch (error) {
    console.error("GET /api/forms/[id]/uploads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
