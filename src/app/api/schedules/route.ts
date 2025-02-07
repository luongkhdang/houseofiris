import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

// Path to the schedules.json file
const dataFilePath = path.join(process.cwd(), "data", "schedules.json");

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const schedules: Schedule[] = JSON.parse(data);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    // Filter out past schedules
    const upcomingSchedules = schedules.filter(schedule => new Date(schedule.date) >= today);

    // Sort schedules by date (oldest to latest)
    upcomingSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Save only upcoming schedules back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(upcomingSchedules, null, 2));

    return NextResponse.json(upcomingSchedules);
  } catch (error) {
    console.error("Error reading schedules:", error);
    return NextResponse.json({ error: "Failed to read schedules" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Schedule = await req.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const schedules: Schedule[] = JSON.parse(data);

    const scheduleDate = new Date(body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today’s date

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

    // Save updated list
    fs.writeFileSync(dataFilePath, JSON.stringify(schedules, null, 2));

    return NextResponse.json({ message: "Schedule saved successfully" });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { date }: { date: string } = await req.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const schedules: Schedule[] = JSON.parse(data);

    // Filter out the schedule to delete
    const updatedSchedules = schedules.filter(schedule => schedule.date !== date);

    // Write updated schedules back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedSchedules, null, 2));

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
