/**
 * API endpoints for handling feedback data with Postgres and JSON file fallback
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
 * - data/feedbacks.json (fallback storage)
 */

import { NextResponse } from "next/server";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Define path to JSON fallback file
const FALLBACK_FILE_PATH = path.join(process.cwd(), "data", "feedbacks.json");

// Type for error handling
interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    return new Error(String(maybeError));
  }
}

function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

// Extract connection string - needed to properly handle SSL
const connectionString = process.env.POSTGRES_URL;
const useSSL = true;

// Create a PostgreSQL connection pool with fixed SSL configuration
const pool = new Pool({
  connectionString: connectionString,
  // This SSL configuration is critical for Supabase connections
  ssl: useSSL
    ? {
        rejectUnauthorized: false, // Required for self-signed certificates
      }
    : undefined,
  max: 5, // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection not established
});

// Log pool events for debugging
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // Don't exit the process, just log the error
  console.error("Postgres pool error detected, will use fallback JSON file");
});

// Define the interface for feedback
export interface Feedback {
  id?: string;
  date: string;
  content: string;
  replies?: string;
}

// Helper functions for JSON file fallback
function readFeedbacksFromFile(): Feedback[] {
  try {
    if (!fs.existsSync(FALLBACK_FILE_PATH)) {
      fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify([], null, 2), "utf8");
      return [];
    }

    const fileData = fs.readFileSync(FALLBACK_FILE_PATH, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading from fallback file:", error);
    return [];
  }
}

function saveFeedbacksToFile(feedbacks: Feedback[]): boolean {
  try {
    // Ensure directory exists
    const dir = path.dirname(FALLBACK_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      FALLBACK_FILE_PATH,
      JSON.stringify(feedbacks, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Error writing to fallback file:", error);
    return false;
  }
}

// Helper function to ensure the table exists
async function ensureFeedbackTable() {
  let client;
  try {
    console.log("Connecting to Postgres to ensure table exists...");
    client = await pool.connect();
    console.log("Connected to Postgres successfully");

    await client.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        content TEXT NOT NULL,
        replies TEXT DEFAULT '..'
      );
    `);
    console.log("Verified feedbacks table exists");
  } catch (error: unknown) {
    console.error("Error creating feedbacks table:", error);
    throw error; // Rethrow to handle in the calling function
  } finally {
    if (client) client.release();
  }
}

// GET: Retrieve all feedbacks sorted from newest to oldest
export async function GET() {
  console.log("GET /api/feedbacks - Starting request");
  let client;
  try {
    // First try to connect to Postgres
    try {
      console.log("Testing Postgres connection...");
      client = await pool.connect();
      console.log("Successfully connected to Postgres");

      // Ensure table exists before querying
      await ensureFeedbackTable();

      // Query all feedbacks ordered by date (newest first)
      const result = await client.query(`
        SELECT id, date, content, replies 
        FROM feedbacks 
        ORDER BY date DESC;
      `);
      console.log(
        `GET /api/feedbacks - Retrieved ${result.rowCount} feedback items`
      );

      return NextResponse.json(result.rows);
    } catch (pgError) {
      throw pgError; // re-throw to be caught by the outer try/catch
    } finally {
      if (client) {
        client.release();
        console.log("Released Postgres client");
      }
    }
  } catch (error: unknown) {
    console.error("Error reading feedbacks from Postgres:", error);
    console.log("Falling back to JSON file...");

    // Use the fallback JSON file
    const feedbacks = readFeedbacksFromFile();

    // Sort feedbacks by date (newest first)
    feedbacks.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log(
      `GET /api/feedbacks - Retrieved ${feedbacks.length} feedback items from fallback file`
    );
    return NextResponse.json(feedbacks);
  }
}

// POST: Add a new feedback
export async function POST(req: Request) {
  console.log("POST /api/feedbacks - Starting request");
  let client;
  let savedFeedback: Feedback | null = null;

  try {
    // Parse request body
    const body: Feedback = await req.json();
    console.log("Received feedback data:", {
      content: body.content?.substring(0, 20) + "...",
      date: body.date,
    });

    // Validate required fields
    if (!body.content || !body.date) {
      console.warn("Missing required fields in request");
      return NextResponse.json(
        { error: "Missing required fields: content and date" },
        { status: 400 }
      );
    }

    // First try Postgres
    try {
      // Ensure table exists before inserting
      await ensureFeedbackTable();

      // Get a client from the pool
      client = await pool.connect();

      // Insert new feedback
      const result = await client.query(
        `INSERT INTO feedbacks (date, content, replies)
         VALUES ($1, $2, '..')
         RETURNING id, date, content, replies;`,
        [body.date, body.content]
      );
      console.log(
        `POST /api/feedbacks - Created feedback with ID: ${result.rows[0]?.id}`
      );

      savedFeedback = result.rows[0];
    } catch (pgError) {
      console.error("Error saving to Postgres, using fallback:", pgError);
      console.log("Switching to JSON file fallback storage");

      // Use the fallback JSON file
      const feedbacks = readFeedbacksFromFile();

      // Create new feedback with generated ID
      const newFeedback = {
        id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: body.date,
        content: body.content,
        replies: "..",
      };

      // Add to list and save
      feedbacks.push(newFeedback);
      if (saveFeedbacksToFile(feedbacks)) {
        console.log(
          `POST /api/feedbacks - Created feedback in fallback file with ID: ${newFeedback.id}`
        );
        savedFeedback = newFeedback;
      } else {
        throw new Error("Failed to save to fallback file");
      }
    } finally {
      if (client) {
        client.release();
        console.log("Released Postgres client");
      }
    }

    // Return the created feedback
    if (savedFeedback) {
      return NextResponse.json(savedFeedback);
    } else {
      throw new Error("Failed to save feedback to any storage");
    }
  } catch (error: unknown) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: `Failed to save feedback: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  }
}
