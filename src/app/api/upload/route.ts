import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const resourceType = (isImage || isVideo) ? (isVideo ? "video" : "image") : "raw";

    const result = await uploadToCloudinary(buffer, {
      folder: "formly/uploads",
      resource_type: resourceType as "image" | "video" | "raw",
      filename: `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
    });

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      format: result.format,
      bytes: result.bytes,
      name: file.name,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
