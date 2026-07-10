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

    const accounts = await prisma.connectedAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      accounts.map((a) => ({
        id: a.id,
        type: a.type,
        label: a.label,
        createdAt: a.createdAt,
      }))
    );
  } catch (error) {
    console.error("GET /api/integrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, label, config } = await req.json();

    if (!type || !label) {
      return NextResponse.json({ error: "type and label are required" }, { status: 400 });
    }

    if (type !== "gmail" && type !== "whatsapp") {
      return NextResponse.json({ error: "type must be gmail or whatsapp" }, { status: 400 });
    }

    if (type === "whatsapp") {
      if (!config?.phoneNumberId || !config?.apiToken) {
        return NextResponse.json(
          { error: "phoneNumberId and apiToken are required for WhatsApp" },
          { status: 400 }
        );
      }
    }

    const account = await prisma.connectedAccount.create({
      data: {
        userId: session.user.id,
        type,
        label,
        config: JSON.stringify(config || {}),
      },
    });

    return NextResponse.json({ id: account.id, type: account.type, label: account.label });
  } catch (error) {
    console.error("POST /api/integrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
