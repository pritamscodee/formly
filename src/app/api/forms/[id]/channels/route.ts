import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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

    const channels = await prisma.channel.findMany({
      where: { formId: id },
      include: { _count: { select: { submissions: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.error("GET /api/forms/[id]/channels error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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

    const { name, type } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Channel name is required" }, { status: 400 });
    }

    const trackingCode = crypto.randomBytes(4).toString("hex");

    const channel = await prisma.channel.create({
      data: {
        formId: id,
        name: name.trim(),
        type: type || "other",
        trackingCode,
      },
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms/[id]/channels error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
