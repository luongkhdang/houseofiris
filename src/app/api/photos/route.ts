import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

// Interface for Cloudinary resource
interface CloudinaryResource {
  secure_url: string;
  public_id: string;
  folder: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  context?: Record<string, string>;
  tags?: string[];
}

// Interface for the transformed photo object
interface Photo {
  url: string;
  public_id: string;
  folder: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
}

export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression("resource_type:image")
      .max_results(500)
      .with_field("context")
      .with_field("tags")
      .execute() as { resources: CloudinaryResource[] };

    const photos: Photo[] = resources.map((resource) => ({
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