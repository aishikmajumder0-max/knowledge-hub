import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
const MAX_BYTES = 100 * 1024 * 1024;
const allowedExtensions = new Set([".pdf",".mp4",".webm",".mov",".png",".jpg",".jpeg",".webp",".ppt",".pptx",".doc",".docx",".txt"]);
const allowedMime = new Set([
  "application/pdf","video/mp4","video/webm","video/quicktime","image/png","image/jpeg","image/webp",
  "application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain",
  "application/octet-stream"
]);

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  try {
    const data = await request.formData();
    const entry = data.get("file");
    if (!(entry instanceof File)) return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
    if (entry.size < 1) return NextResponse.json({ error: "The selected file is empty." }, { status: 400 });
    if (entry.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than the 100 MB limit." }, { status: 413 });
    const ext = path.extname(entry.name).toLowerCase();
    if (!allowedExtensions.has(ext) || !allowedMime.has(entry.type || "application/octet-stream")) {
      return NextResponse.json({ error: "File type is not supported." }, { status: 415 });
    }
    const fileName = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await entry.arrayBuffer()), { flag: "wx" });
    return NextResponse.json({ url: `/uploads/${fileName}`, fileName }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed. Check server permissions and try again." }, { status: 500 });
  }
}
