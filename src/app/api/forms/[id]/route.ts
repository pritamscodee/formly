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
      include: { fields: { orderBy: { order: "asc" } } },
    });

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("GET /api/forms/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, fields } = await req.json();

    const form = await prisma.form.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.form.update({
      where: { id },
      data: {
        title,
        description,
        fields: fields
          ? {
              deleteMany: {},
              create: fields.map((f: Record<string, unknown>) => ({
                id: typeof f.id === "string" && f.id.startsWith("new_") ? undefined : (f.id as string),
                type: f.type as string,
                title: f.title as string,
                description: f.description as string,
                required: f.required as boolean,
                order: f.order as number,
                options: JSON.stringify(f.options || []),
                other: f.other as boolean,
              })),
            }
          : undefined,
      },
      include: { fields: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/forms/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const form = await prisma.form.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.form.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/forms/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
