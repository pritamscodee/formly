import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl || !fileUrl.startsWith("https://res.cloudinary.com/")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const match = fileUrl.match(/\/v\d+\/(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Could not parse Cloudinary path" }, { status: 400 });
    }

    const filePath = match[1];
    const publicId = filePath.replace(/\.[^/.]+$/, "");

    const signedUrl = cloudinary.url(publicId, {
      sign_url: true,
      secure: true,
      resource_type: "auto",
      type: "upload",
    });

    const fetchHeaders: Record<string, string> = {};
    const range = req.headers.get("range");
    if (range) {
      fetchHeaders["Range"] = range;
    }

    const res = await fetch(signedUrl, { headers: fetchHeaders });

    if (!res.ok && res.status !== 206) {
      const fallbackRes = await fetch(fileUrl, { headers: fetchHeaders });
      if (!fallbackRes.ok) {
        return NextResponse.json({ error: "Failed to fetch file" }, { status: fallbackRes.status });
      }

      const responseHeaders: Record<string, string> = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Expose-Headers": "*",
      };

      const ct = fallbackRes.headers.get("content-type");
      const cl = fallbackRes.headers.get("content-length");
      const cr = fallbackRes.headers.get("content-range");
      if (ct) responseHeaders["Content-Type"] = ct;
      if (cl) responseHeaders["Content-Length"] = cl;
      if (cr) responseHeaders["Content-Range"] = cr;

      return new NextResponse(fallbackRes.body, {
        status: fallbackRes.status === 206 ? 206 : 200,
        headers: responseHeaders,
      });
    }

    const responseHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Expose-Headers": "*",
    };

    const ct = res.headers.get("content-type");
    const cl = res.headers.get("content-length");
    const cr = res.headers.get("content-range");
    if (ct) responseHeaders["Content-Type"] = ct;
    if (cl) responseHeaders["Content-Length"] = cl;
    if (cr) responseHeaders["Content-Range"] = cr;

    return new NextResponse(res.body, {
      status: res.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
