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

// Helper function to check if table exists
async function checkFeedbackTableExists() {
  try {
    console.log("Checking if feedbacks table exists...");

    // Try to query the table first
    const { error } = await supabase.from("feedbacks").select("id").limit(1);

    // If the table doesn't exist (42P01 error), we need to create it
    if (error && error.code === "42P01") {
      console.error("Feedbacks table does not exist:", error.message);
      console.log(
        "Please create the feedbacks table manually in Supabase dashboard"
      );
      console.log(`
SQL to run in Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS public.feedbacks (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  content TEXT NOT NULL,
  replies TEXT DEFAULT '..'
);
      `);
      return false;
    } else if (error) {
      // Some other error occurred
      console.error("Error checking for table:", error);
      return false;
    } else {
      console.log("Feedbacks table exists");
      return true;
    }
  } catch (error) {
    console.error("Error in checkFeedbackTableExists:", error);
    return false;
  }
}

// Helper function to get current date in Vietnam timezone
const getCurrentVietnamDate = () => {
  const now = new Date();
  const vietnamTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  return vietnamTime.toISOString();
};

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
    // First check if the table exists
    const tableExists = await checkFeedbackTableExists();
    if (!tableExists) {
      return NextResponse.json(
        {
          error:
            "Feedbacks table does not exist. Please create it in Supabase dashboard.",
        },
        { status: 500 }
      );
    }

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

    // Ensure date is in Vietnam timezone if not already set by client
    // Only override if it's the current time (within 1 second)
    const clientDate = new Date(body.date);
    const now = new Date();
    if (Math.abs(clientDate.getTime() - now.getTime()) < 1000) {
      body.date = getCurrentVietnamDate();
    }

    // Check if the table exists
    const tableExists = await checkFeedbackTableExists();
    if (!tableExists) {
      return NextResponse.json(
        {
          error:
            "Feedbacks table does not exist. Please create it in Supabase dashboard.",
        },
        { status: 500 }
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
