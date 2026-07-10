import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const form = await prisma.form.findUnique({
      where: { id },
      include: { fields: { orderBy: { order: "asc" } } },
    });

    if (!form || !form.published) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!form.isActive) {
      return NextResponse.json({ error: "Form is no longer accepting responses" }, { status: 403 });
    }

    if (form.expiresAt && new Date(form.expiresAt).getTime() <= Date.now()) {
      await prisma.form.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ error: "Form has expired" }, { status: 403 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("GET /api/forms/[id]/public error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
