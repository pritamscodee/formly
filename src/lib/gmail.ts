import { google } from "googleapis";

interface GmailTokens {
  access_token: string;
  refresh_token: string;
}

interface Attachment {
  filename: string;
  content: Buffer;
  mimeType: string;
}

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/integrations/callback"
  );
}

export function getAuthUrl(oauth2Client: ReturnType<typeof getOAuth2Client>) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getUserEmail(tokens: GmailTokens): Promise<string> {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  return data.email || "";
}

function createMimeMessage(
  to: string,
  subject: string,
  htmlBody: string,
  attachments: Attachment[]
): string {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const lines: string[] = [];

  lines.push(`To: ${to}`);
  lines.push(`Subject: ${subject}`);
  lines.push("MIME-Version: 1.0");
  lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  lines.push("");

  lines.push(`--${boundary}`);
  lines.push("Content-Type: text/html; charset=UTF-8");
  lines.push("");
  lines.push(htmlBody);

  for (const att of attachments) {
    const encoded = att.content.toString("base64");
    const folded = encoded.match(/.{1,76}/g)?.join("\r\n") || encoded;
    lines.push(`--${boundary}`);
    lines.push(`Content-Type: ${att.mimeType}; name="${att.filename}"`);
    lines.push("Content-Transfer-Encoding: base64");
    lines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
    lines.push("");
    lines.push(folded);
  }

  lines.push(`--${boundary}--`);
  return lines.join("\r\n");
}

export async function sendEmailWithAttachments(
  tokens: GmailTokens,
  to: string,
  subject: string,
  htmlBody: string,
  attachments: Attachment[]
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const raw = createMimeMessage(to, subject, htmlBody, attachments);

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: Buffer.from(raw).toString("base64url"),
    },
  });
}
