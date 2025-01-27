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
  title?: string | null; // Allow null
  date?: string | null; // Allow null
  location?: string | null; // Allow null
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
      title: resource.context?.alt || null, // Fetch 'alt' from context
      description: resource.context?.caption || null, // Fetch 'caption' from context
      date: resource.context?.Date || null, // Fetch 'Date' from context
      location: resource.context?.Location || null, // Fetch 'Location' from context
    }));

    // Helper function to parse `dd/mm/yyyy` into a Date object
    const parseDate = (date: string) => {
      const [day, month, year] = date.split("/").map(Number);
      return new Date(year, month - 1, day); // Month is zero-based in JS Date
    };

    // Sort photos to prioritize those with `date` and then sort by ascending order
    photos.sort((a, b) => {
      // Prioritize by presence of `date`
      if (a.date && !b.date) return -1; // `a` has `date`, but `b` does not
      if (!a.date && b.date) return 1; // `b` has `date`, but `a` does not

      // If both have `date`, or both don't have `date`, sort by date or created_at
      const dateA = a.date ? parseDate(a.date).getTime() : new Date(a.created_at).getTime();
      const dateB = b.date ? parseDate(b.date).getTime() : new Date(b.created_at).getTime();
      return dateA - dateB; // Sort ascending
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

