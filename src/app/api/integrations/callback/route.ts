import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokensFromCode, getUserEmail } from "@/lib/gmail";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const stateParam = url.searchParams.get("state");

    if (!code) {
      return NextResponse.redirect(new URL("/forms?error=no_code", url.origin));
    }

    let userId = "";
    let formId = "";

    if (stateParam) {
      try {
        const state = JSON.parse(stateParam);
        userId = state.userId || "";
        formId = state.formId || "";
      } catch {}
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/login", url.origin));
    }

    const tokens = await getTokensFromCode(code);
    const email = await getUserEmail({
      access_token: tokens.access_token || "",
      refresh_token: tokens.refresh_token || "",
    });

    const existing = await prisma.connectedAccount.findFirst({
      where: { userId, type: "gmail", label: email },
    });

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data: {
          config: JSON.stringify({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            email,
          }),
        },
      });
    } else {
      await prisma.connectedAccount.create({
        data: {
          userId,
          type: "gmail",
          label: email,
          config: JSON.stringify({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            email,
          }),
        },
      });
    }

    const redirectPath = formId ? `/forms/${formId}/integrations` : "/forms";
    return NextResponse.redirect(new URL(`${redirectPath}?connected=gmail`, url.origin));
  } catch (error) {
    console.error("GET /api/integrations/callback error:", error);
    const url = new URL(req.url);
    return NextResponse.redirect(new URL("/forms?error=callback_failed", url.origin));
  }
}
