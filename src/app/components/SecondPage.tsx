"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import emailjs from "@emailjs/browser";

const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
if (emailjsPublicKey) {
  emailjs.init(emailjsPublicKey);
}

interface SecondPageProps {
  onNext: () => void;
}

interface Schedule {
  date: string;
  note: string;
}

const SecondPage: React.FC<SecondPageProps> = ({ onNext }) => {
  const [view, setView] = useState<"pictures" | "feedback" | "schedule">(
    "pictures"
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Fetch schedules on load
  useEffect(() => {
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch((err) => console.error("Failed to fetch schedules:", err));
  }, []);

  const sendFeedback = async () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback!");
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "default_template";

    if (!serviceId || !emailjsPublicKey) {
      console.error("EmailJS configuration is missing");
      alert("Email service is not properly configured");
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        message: feedback,
        to_email: "Luongdang0701@gmail.com",
      };
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        emailjsPublicKey
      );
      alert("Your feedback has been sent!");
      setFeedback("");
    } catch (error) {
      console.error("Failed to send feedback:", error);
      alert("Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveSchedule = () => {
    if (selectedDate) {
      const newSchedule = { date: selectedDate.toISOString(), note };

      fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      })
        .then((res) => res.json())
        .then(() => {
          setSchedules((prev) => [...prev, newSchedule]); // Update state in real-time
          setSelectedDate(null);
          setNote("");
        })
        .catch((err) => console.error("Failed to save schedule:", err));
    } else {
      alert("Please select a date!");
    }
  };

  const deleteSchedule = (date: string) => {
    fetch("/api/schedules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    })
      .then((res) => res.json())
      .then(() => {
        setSchedules((prev) =>
          prev.filter((schedule) => schedule.date !== date)
        ); // Update state in real-time
      })
      .catch((err) => console.error("Failed to delete schedule:", err));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Toggle Switcher */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            view === "pictures" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("pictures")}
        >
          Pictures
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === "feedback" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("feedback")}
        >
          Feedback
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === "schedule" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("schedule")}
        >
          Schedule a Date
        </button>
      </div>

      {/* Pictures Section */}
      {view === "pictures" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Hai đứa mình !</h1>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            onClick={onNext}
          >
            Click here for pictures
          </button>
        </div>
      )}

      {/* Feedback Section */}
      {view === "feedback" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Mad lately? Send me a letter</h1>
          <textarea
            className="w-full p-2 border rounded min-h-[150px]"
            placeholder="Type your feelings here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={sendFeedback}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      )}

      {/* Schedule a Date Section */}
      {view === "schedule" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Pick a date</h1>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
              } else if (Array.isArray(value)) {
                // Handle date range if needed (e.g., use value[0] or value[1])
                setSelectedDate(value[0]); // Choose one date from the range
              }
            }}
            value={selectedDate}
          />
          <textarea
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="Add a note or schedule here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            onClick={saveSchedule}
          >
            Save Schedule
          </button>
          {/* Display saved schedules */}
          <h2 className="text-xl font-bold">Saved Schedules</h2>
          <ul>
            {schedules.map((schedule, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {new Date(schedule.date).toDateString()}: {schedule.note}
                </span>
                <button
                  className="text-red-500 hover:underline ml-4"
                  onClick={() => deleteSchedule(schedule.date)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SecondPage;
