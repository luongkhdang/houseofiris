import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stickersDir = path.join(process.cwd(), "public/stickers");
    const files = await fs.readdir(stickersDir);
    const stickerFiles = files.filter((file) => file.endsWith(".png"));
    return NextResponse.json(stickerFiles);
  } catch (error) {
    console.error("Error reading sticker directory:", error);
    return NextResponse.json({ error: "Failed to load sticker files" }, { status: 500 });
  }
}
