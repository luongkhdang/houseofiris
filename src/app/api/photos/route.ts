import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression("resource_type:image")
      .max_results(500)
      .with_field("context")
      .with_field("tags")
      .execute();

    const photos = resources.map((resource) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      folder: resource.folder,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
    }));

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
