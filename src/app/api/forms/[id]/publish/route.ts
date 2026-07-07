import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { published } = await req.json();

    const form = await prisma.form.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.form.update({
      where: { id },
      data: { published },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/forms/[id]/publish error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
