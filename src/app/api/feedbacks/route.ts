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

// Helper function to get current date in Vietnam timezone
// Properly handles conversion from any timezone to Vietnam time (ICT, GMT+7)
const getCurrentVietnamDate = () => {
  // Create a formatter that outputs in the Vietnam time zone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Get the date parts
  const parts = formatter.formatToParts(new Date());

  // Build date from parts to ensure DST is handled properly
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  const day = parts.find((part) => part.type === "day")?.value || "";
  const hour = parts.find((part) => part.type === "hour")?.value || "";
  const minute = parts.find((part) => part.type === "minute")?.value || "";
  const second = parts.find((part) => part.type === "second")?.value || "";

  // Create the date in ISO format to store in the database
  const vietnamDate = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(
      2,
      "0"
    )}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}.000Z`
  );
  return vietnamDate.toISOString();
};

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

// Helper function to get the next available ID
async function getNextAvailableId() {
  try {
    // Query for the maximum ID
    const { data, error } = await supabase
      .from("feedbacks")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error retrieving max ID:", error);
      return null;
    }

    // If no data, start from 1, otherwise increment the highest ID
    const nextId = data && data.length > 0 ? Number(data[0].id) + 1 : 1;
    console.log(`Next available ID: ${nextId}`);
    return nextId;
  } catch (error) {
    console.error("Error in getNextAvailableId:", error);
    return null;
  }
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
      console.log("Updated date to Vietnam timezone:", body.date);
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

    // Get the next available ID
    const nextId = await getNextAvailableId();
    if (nextId === null) {
      return NextResponse.json(
        { error: "Failed to determine next available ID" },
        { status: 500 }
      );
    }

    // Insert new feedback with explicit ID
    const { data, error } = await supabase
      .from("feedbacks")
      .insert([
        {
          id: nextId,
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
