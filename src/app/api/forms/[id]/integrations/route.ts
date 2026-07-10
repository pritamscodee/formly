import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    const integrations = await prisma.formIntegration.findMany({
      where: { formId: id },
      include: { connectedAccount: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      integrations.map((fi) => ({
        id: fi.id,
        enabled: fi.enabled,
        autoSend: fi.autoSend,
        settings: fi.settings,
        connectedAccount: {
          id: fi.connectedAccount.id,
          type: fi.connectedAccount.type,
          label: fi.connectedAccount.label,
        },
      }))
    );
  } catch (error) {
    console.error("GET /api/forms/[id]/integrations error:", error);
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

    const { connectedAccountId, enabled, autoSend, settings } = await req.json();

    if (!connectedAccountId) {
      return NextResponse.json({ error: "connectedAccountId is required" }, { status: 400 });
    }

    const account = await prisma.connectedAccount.findFirst({
      where: { id: connectedAccountId, userId: session.user.id },
    });
    if (!account) {
      return NextResponse.json({ error: "Connected account not found" }, { status: 404 });
    }

    const existing = await prisma.formIntegration.findUnique({
      where: { formId_connectedAccountId: { formId: id, connectedAccountId } },
    });

    if (existing) {
      const updated = await prisma.formIntegration.update({
        where: { id: existing.id },
        data: {
          enabled: enabled ?? existing.enabled,
          autoSend: autoSend ?? existing.autoSend,
          settings: settings ? JSON.stringify(settings) : existing.settings,
        },
        include: { connectedAccount: true },
      });
      return NextResponse.json({
        id: updated.id,
        enabled: updated.enabled,
        autoSend: updated.autoSend,
        settings: updated.settings,
        connectedAccount: {
          id: updated.connectedAccount.id,
          type: updated.connectedAccount.type,
          label: updated.connectedAccount.label,
        },
      });
    }

    const integration = await prisma.formIntegration.create({
      data: {
        formId: id,
        connectedAccountId,
        enabled: enabled ?? true,
        autoSend: autoSend ?? true,
        settings: settings ? JSON.stringify(settings) : "{}",
      },
      include: { connectedAccount: true },
    });

    return NextResponse.json({
      id: integration.id,
      enabled: integration.enabled,
      autoSend: integration.autoSend,
      settings: integration.settings,
      connectedAccount: {
        id: integration.connectedAccount.id,
        type: integration.connectedAccount.type,
        label: integration.connectedAccount.label,
      },
    });
  } catch (error) {
    console.error("POST /api/forms/[id]/integrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
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

    const { integrationId, enabled, autoSend } = await req.json();

    if (!integrationId) {
      return NextResponse.json({ error: "integrationId is required" }, { status: 400 });
    }

    const integration = await prisma.formIntegration.findFirst({
      where: { id: integrationId, formId: id },
    });
    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    const updated = await prisma.formIntegration.update({
      where: { id: integrationId },
      data: {
        ...(enabled !== undefined && { enabled }),
        ...(autoSend !== undefined && { autoSend }),
      },
      include: { connectedAccount: true },
    });

    return NextResponse.json({
      id: updated.id,
      enabled: updated.enabled,
      autoSend: updated.autoSend,
      settings: updated.settings,
      connectedAccount: {
        id: updated.connectedAccount.id,
        type: updated.connectedAccount.type,
        label: updated.connectedAccount.label,
      },
    });
  } catch (error) {
    console.error("PATCH /api/forms/[id]/integrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
