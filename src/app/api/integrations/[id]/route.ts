import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const account = await prisma.connectedAccount.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.formIntegration.deleteMany({ where: { connectedAccountId: id } });
    await prisma.connectedAccount.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/integrations/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
