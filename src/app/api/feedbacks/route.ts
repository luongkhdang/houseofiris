/**
 * API endpoints for handling feedback data using Supabase Postgres
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

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

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
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        content TEXT NOT NULL,
        replies TEXT DEFAULT '..'
      );
    `);
  } catch (error) {
    console.error("Error creating feedbacks table:", error);
  } finally {
    client.release();
  }
}

// GET: Retrieve all feedbacks sorted from newest to oldest
export async function GET() {
  const client = await pool.connect();
  try {
    // Ensure table exists before querying
    await ensureFeedbackTable();

    // Query all feedbacks ordered by date (newest first)
    const result = await client.query(`
      SELECT id, date, content, replies 
      FROM feedbacks 
      ORDER BY date DESC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error reading feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to read feedbacks" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST: Add a new feedback
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    // Ensure table exists before inserting
    await ensureFeedbackTable();

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
    const result = await client.query(
      `INSERT INTO feedbacks (date, content, replies)
       VALUES ($1, $2, '..')
       RETURNING id, date, content, replies;`,
      [body.date, body.content]
    );

    // Return the created feedback
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
