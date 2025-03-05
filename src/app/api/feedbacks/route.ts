/**
 * QUALITY CHECK:
 * Strengths:
 * - Well-defined TypeScript interface for the Feedback object
 * - Good error handling with try/catch blocks
 * - Proper use of NextResponse for API responses
 * - Clean separation of concerns with helper functions
 * - Consistent error reporting
 * 
 * Recommendations:
 * - Use the Redis utility from src/utils/redis.ts instead of creating a new connection
 * - Add input validation for the POST request body
 * - Implement pagination for large result sets
 * - Add authentication and authorization checks
 * - Add rate limiting to prevent abuse
 * - Add better data validation before storing in Redis
 * - Sort feedbacks in the helper function instead of the route handler
 * - Consider implementing a PUT endpoint for updating feedback
 * - Add endpoint documentation with JSDoc
 */

import { NextResponse } from "next/server";
import Redis from "ioredis";

// Initialize Redis with your Redis URL
const redis = new Redis(process.env.REDIS_URL as string);

// Define the interface for feedback
interface Feedback {
  date: string;
  content: string;
  replies?: string;
}

// Helper function to get all feedbacks from Redis
const getFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const data = await redis.get("feedbacks");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error retrieving feedbacks from Redis:", error);
    return [];
  }
};

// GET: Retrieve all feedbacks sorted from oldest to latest
export async function GET() {
  try {
    const feedbacks = await getFeedbacks();

    // Sort feedbacks from oldest to latest
    feedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error reading feedbacks:", error);
    return NextResponse.json({ error: "Failed to read feedbacks" }, { status: 500 });
  }
}

// POST: Add a new feedback
export async function POST(req: Request) {
  try {
    const body: Feedback = await req.json();
    const feedbacks = await getFeedbacks();

    // Add new feedback with default reply as ".."
    feedbacks.push({ ...body, replies: ".." });

    // Save feedbacks to Redis
    await redis.set("feedbacks", JSON.stringify(feedbacks));

    return NextResponse.json({ message: "Feedback saved successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

 