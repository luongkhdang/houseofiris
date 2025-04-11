/**
 * API endpoints for handling feedback data with Supabase Postgres
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
import { Pool } from "pg";

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

// Create PostgreSQL connection options for Supabase
const connectionConfig = {
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
};

// Create the pool
const pool = new Pool(connectionConfig);

// Define the interface for feedback
export interface Feedback {
  id?: string;
  date: string;
  content: string;
  replies?: string;
}

// Helper function to ensure the table exists
async function ensureFeedbackTable() {
  const client = await pool.connect();
  try {
    console.log("Creating feedback table if it doesn't exist...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        content TEXT NOT NULL,
        replies TEXT DEFAULT '..'
      );
    `);

    console.log("Table check complete");
    return true;
  } catch (error) {
    console.error("Error creating feedbacks table:", error);
    throw error;
  } finally {
    client.release();
  }
}

// GET: Retrieve all feedbacks sorted from newest to oldest
export async function GET() {
  console.log("GET /api/feedbacks - Starting request");
  const client = await pool.connect();

  try {
    await ensureFeedbackTable();

    const result = await client.query(`
      SELECT id, date, content, replies 
      FROM feedbacks 
      ORDER BY date DESC;
    `);

    console.log(`Retrieved ${result.rowCount} feedback items`);
    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: `Failed to fetch feedbacks: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST: Add a new feedback
export async function POST(req: Request) {
  console.log("POST /api/feedbacks - Starting request");
  const client = await pool.connect();

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

    // Ensure table exists
    await ensureFeedbackTable();

    // Insert new feedback
    const result = await client.query(
      `INSERT INTO feedbacks (date, content, replies)
       VALUES ($1, $2, '..')
       RETURNING id, date, content, replies;`,
      [body.date, body.content]
    );

    console.log(`Created feedback with ID: ${result.rows[0]?.id}`);
    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: `Failed to save feedback: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
