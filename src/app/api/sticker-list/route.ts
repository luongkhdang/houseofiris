/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean implementation of file system operations
 * - Good error handling with try/catch and appropriate status codes
 * - Proper use of NextResponse for API responses
 * - Uses Node.js promises API for file operations
 * - Filters files to only include PNG stickers
 * 
 * Recommendations:
 * - Consider caching the sticker list to improve performance
 * - Add more robust file type checking beyond just file extension
 * - Add JSDoc comments to document endpoint behavior
 * - Consider implementing pagination for large sticker collections
 * - Add a more descriptive error message with specific failure reasons
 * - Consider adding metadata for stickers (e.g., name, category)
 * - Add security checks to ensure files are only read from the stickers directory
 */

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
