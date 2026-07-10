import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; integrationId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, integrationId } = await params;

    const form = await prisma.form.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const integration = await prisma.formIntegration.findFirst({
      where: { id: integrationId, formId: id },
    });
    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    await prisma.formIntegration.delete({ where: { id: integrationId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/forms/[id]/integrations/[integrationId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
