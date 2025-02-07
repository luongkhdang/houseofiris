import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the interface for feedback
interface Feedback {
  date: string;
  content: string;
  replies?: string;
}

// Path to feedbacks.json
const feedbacksFilePath = path.join(process.cwd(), "data", "feedbacks.json");

// Function to safely read and parse JSON
const readFeedbacks = (): Feedback[] => {
  try {
    if (!fs.existsSync(feedbacksFilePath)) {
      return [];
    }

    const data = fs.readFileSync(feedbacksFilePath, "utf8").trim();
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing feedbacks.json:", error);
    return [];
  }
};

export async function GET() {
  try {
    const feedbacks = readFeedbacks();

    // Sort feedbacks from latest to oldest
    feedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error reading feedbacks:", error);
    return NextResponse.json({ error: "Failed to read feedbacks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Feedback = await req.json();
    const feedbacks = readFeedbacks();

    // Add new feedback with default reply as ".."
    feedbacks.push({ ...body, replies: ".." });

    // Save feedbacks
    fs.writeFileSync(feedbacksFilePath, JSON.stringify(feedbacks, null, 2));

    return NextResponse.json({ message: "Feedback saved successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { date, reply }: { date: string; reply: string } = await req.json();
    const feedbacks = readFeedbacks();

    // Update the reply for the specific feedback
    const updatedFeedbacks = feedbacks.map((fb) =>
      fb.date === date ? { ...fb, replies: reply } : fb
    );

    // Save updated feedbacks
    fs.writeFileSync(feedbacksFilePath, JSON.stringify(updatedFeedbacks, null, 2));

    return NextResponse.json({ message: "Reply updated successfully" });
  } catch (error) {
    console.error("Error updating reply:", error);
    return NextResponse.json({ error: "Failed to update reply" }, { status: 500 });
  }
}
