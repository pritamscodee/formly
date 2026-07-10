import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NUTRIENT_DWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Nutrient API key not configured" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));

    const res = await fetch("https://api.nutrient.io/viewer/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Nutrient session error:", err);
      return NextResponse.json({ error: "Failed to create session" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Nutrient session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
