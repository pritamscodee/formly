import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.user.id },
      include: {
        fields: { orderBy: { order: "asc" } },
        _count: { select: { submissions: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const documents = forms.map((form) => {
      const hasFileUpload = form.fields.some((f) => f.type === "file_upload");
      const fieldTypes = [...new Set(form.fields.map((f) => f.type))];
      const fileUploadCount = form.fields.filter((f) => f.type === "file_upload").length;

      return {
        id: form.id,
        title: form.title,
        description: form.description,
        published: form.published,
        createdAt: form.createdAt.toISOString(),
        updatedAt: form.updatedAt.toISOString(),
        submissionCount: form._count.submissions,
        fieldCount: form.fields.length,
        hasFileUpload,
        fileUploadCount,
        fieldTypes,
      };
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
