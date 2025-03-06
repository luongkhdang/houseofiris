/**
 * QUALITY CHECK:
 * Strengths:
 * - Well-defined TypeScript interface for Schedule with comprehensive fields
 * - Good error handling with try/catch blocks and appropriate status codes
 * - Input validation for schedules (e.g., preventing past dates)
 * - Array validation before processing
 * - Proper use of NextResponse for API responses
 * 
 * Recommendations:
 * - Use the Redis utility from src/utils/redis.ts instead of creating a new connection
 * - Add more comprehensive input validation using a schema validator like Zod
 * - Extract common data operations into reusable functions
 * - Implement pagination for large result sets
 * - Add authentication and authorization checks
 * - Add rate limiting to prevent abuse
 * - Consider adding an update (PUT) endpoint for modifying schedules
 * - Add JSDoc comments to document endpoint behavior
 * - Implement more robust date handling with a library like date-fns
 */

import { NextResponse } from "next/server";
import Redis from "ioredis";

// Initialize Redis with your Vercel Redis URL
const redis = new Redis(process.env.REDIS_URL as string);

// Define the interface for a schedule
interface Schedule {
  date: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  participants?: string[];
  location?: string;
  status?: "scheduled" | "cancelled" | "completed";
  metadata?: Record<string, string | number | boolean>;
}

export async function GET() {
  try {
    // Retrieve schedules from Redis
    const data = await redis.get("schedules");
    const schedules: Schedule[] = data ? JSON.parse(data) : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    // Calculate yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Ensure schedules is always an array
    if (!Array.isArray(schedules)) {
      console.error("Invalid schedules format:", schedules);
      return NextResponse.json([]);
    }

    // Filter out past schedules, including today and yesterday
    const upcomingSchedules = schedules.filter(schedule => new Date(schedule.date) >= yesterday);

    // Sort schedules by date (oldest to latest)
    upcomingSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(upcomingSchedules);
  } catch (error) {
    console.error("Error reading schedules:", error);
    return NextResponse.json({ error: "Failed to read schedules" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Schedule = await req.json();
    const data = await redis.get("schedules");
    const schedules: Schedule[] = data ? JSON.parse(data) : [];

    const scheduleDate = new Date(body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // Prevent scheduling for past dates
    if (scheduleDate < today) {
      return NextResponse.json(
        { error: "Cannot schedule an event in the past." },
        { status: 400 }
      );
    }

    // Add new schedule
    schedules.push(body);

    // Sort schedules again after adding
    schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Save updated list to Redis
    await redis.set("schedules", JSON.stringify(schedules));

    return NextResponse.json({ message: "Schedule saved successfully" });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { date }: { date: string } = await req.json();
    const data = await redis.get("schedules");
    const schedules: Schedule[] = data ? JSON.parse(data) : [];

    // Filter out the schedule to delete
    const updatedSchedules = schedules.filter(schedule => schedule.date !== date);

    // Save updated schedules back to Redis
    await redis.set("schedules", JSON.stringify(updatedSchedules));

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
