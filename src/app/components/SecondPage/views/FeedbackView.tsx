import React, { useState, useEffect } from "react";
import { emailService } from "../services/emailService";

interface Feedback {
  id?: string;
  date: string;
  content: string;
  replies?: string;
}

// Helper function to convert to Vietnam timezone with MM/DD/YYYY h:MM AM/PM format
// Vietnam doesn't observe daylight saving time, but this handles DST properly
// for users in other time zones viewing the app
const formatDateToVietnamTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Ho_Chi_Minh", // Vietnam time zone (GMT+7, no DST)
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short", // Adds time zone abbreviation (ICT for Indochina Time)
  };

  return new Date(dateString).toLocaleString("en-US", options);
};

// Get current date in Vietnam timezone
// This properly accounts for any DST considerations between local time and Vietnam time
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
  const isoDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`
  );
  return isoDate.toISOString();
};

const FeedbackView: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackPosts, setFeedbackPosts] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/feedbacks")
      .then((res) => res.json())
      .then((data) => {
        setFeedbackPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch feedbacks:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback!");
      return;
    }

    setIsSubmitting(true);
    try {
      await emailService.sendFeedback(feedback);

      const newFeedback = {
        date: getCurrentVietnamDate(),
        content: feedback,
      };

      // Save feedback to database via API
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        throw new Error("Failed to save feedback.");
      }

      const savedFeedback = await response.json();
      alert("Your feedback has been sent!");

      // Update feedback list immediately
      setFeedbackPosts((prev: Feedback[]) => {
        const updatedList = [...prev, { ...savedFeedback, replies: ".." }];
        return updatedList.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });

      setFeedback("");
    } catch (error) {
      console.error("Failed to send feedback:", error);
      alert("Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📝 Hộp Thư 🐈</h1>

      {/* Textarea & Button Wrapper */}
      <div className="feedback-input-container">
        <textarea
          className="feedback-textarea"
          placeholder="Type your feelings here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Display Submitted Feedback as Emails */}
      <div className="post-container">
        <h2 className="title text-xl font-bold">🕊️ Love Letter Box </h2>
        {isLoading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : feedbackPosts.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <ul className="email-folder">
            {Array.isArray(feedbackPosts) ? (
              feedbackPosts.map((post, index) => (
                <div key={post.id || index}>
                  <li
                    key={`item-${post.id || index}`}
                    className="email-container"
                  >
                    <p className="email-footer">
                      <small>{formatDateToVietnamTime(post.date)}</small>
                    </p>
                    <p className="email-header">
                      <strong>Girlfriend🐎</strong> 💌:
                    </p>
                    <p className="email-content">
                      &nbsp;&nbsp;&nbsp;{post.content}
                    </p>
                  </li>

                  <p className="email-reply">
                    <span className="boyfriend-text">boifriend 🐂</span>:{" "}
                    {post.replies}&nbsp;&nbsp;&nbsp;
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Error loading messages.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FeedbackView;
