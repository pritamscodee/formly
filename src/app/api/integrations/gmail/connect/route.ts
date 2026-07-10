import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOAuth2Client, getAuthUrl } from "@/lib/gmail";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const url = new URL(req.url);
    const formId = url.searchParams.get("formId") || "";

    const oauth2Client = getOAuth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state: JSON.stringify({ userId: session.user.id, formId }),
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("GET /api/integrations/gmail/connect error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
