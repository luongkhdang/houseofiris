/**
 * API endpoints for handling feedback data with Supabase
 *
 * This file handles CRUD operations for feedback posts:
 * - GET: Retrieve all feedbacks sorted by date
 * - POST: Add a new feedback
 *
 * Exports:
 * - GET(): Function to retrieve all feedbacks
 * - POST(req: Request): Function to add a new feedback
 *
 * Related files:
 * - src/app/components/SecondPage/views/FeedbackView.tsx (frontend component)
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with better error handling for environment variables
if (!process.env.SUPABASE_URL) {
  console.error("SUPABASE_URL environment variable is not set");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
}

// Use a default URL for development if not available (will show a clear error in the console)
const supabaseUrl = process.env.SUPABASE_URL || "https://example.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

// Create the client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the interface for feedback
export interface Feedback {
  id?: string;
  date: string;
  content: string;
  replies?: string;
}

// GET: Retrieve all feedbacks sorted from newest to oldest
export async function GET() {
  // Print environment variables for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("Environment variables:");
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "Set" : "Not set");
    console.log(
      "SUPABASE_SERVICE_ROLE_KEY:",
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set"
    );
  }

  console.log("GET /api/feedbacks - Starting request");

  try {
    // Query all feedbacks ordered by date (newest first)
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`Retrieved ${data?.length || 0} feedback items`);
    return NextResponse.json(data || []);
  } catch (error: unknown) {
    console.error("Error fetching feedbacks:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch feedbacks: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST: Add a new feedback
export async function POST(req: Request) {
  console.log("POST /api/feedbacks - Starting request");

  try {
    // Parse request body
    const body: Feedback = await req.json();

    // Validate required fields
    if (!body.content || !body.date) {
      return NextResponse.json(
        { error: "Missing required fields: content and date" },
        { status: 400 }
      );
    }

    // Insert new feedback
    const { data, error } = await supabase
      .from("feedbacks")
      .insert([
        {
          date: body.date,
          content: body.content,
          replies: "..",
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    console.log(`Created feedback with ID: ${data?.[0]?.id}`);
    return NextResponse.json(data?.[0] || null);
  } catch (error: unknown) {
    console.error("Error saving feedback:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to save feedback: ${errorMessage}` },
      { status: 500 }
    );
  }
}
