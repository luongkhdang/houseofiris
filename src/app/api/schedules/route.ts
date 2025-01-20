import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to the schedules.json file
const dataFilePath = path.join(process.cwd(), "data", "schedules.json");

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const schedules = JSON.parse(data);
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error reading schedules:", error);
    return NextResponse.json({ error: "Failed to read schedules" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const schedules = JSON.parse(data);

    // Add new schedule
    schedules.push(body);
    fs.writeFileSync(dataFilePath, JSON.stringify(schedules, null, 2));

    return NextResponse.json({ message: "Schedule saved successfully" });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { date } = await req.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const schedules = JSON.parse(data);

    // Filter out the schedule to delete
    const updatedSchedules = schedules.filter((schedule: any) => schedule.date !== date);

    // Write updated schedules back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedSchedules, null, 2));

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
