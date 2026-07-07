import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { submissions: true } } },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("GET /api/forms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, description } = body;

    const form = await prisma.form.create({
      data: {
        title: title || "Untitled Form",
        description: description || "",
        userId: session.user.id,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
