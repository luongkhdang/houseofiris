import React, { useState, useEffect } from "react";
import { emailService } from "../services/emailService";

interface Feedback {
  id?: string;
  date: string;
  content: string;
  replies?: string;
}

// Timezone utilities
const TIMEZONES = {
  PACIFIC: "America/Los_Angeles",
  VIETNAM: "Asia/Ho_Chi_Minh",
};

// Convert date to specified timezone with MM/DD/YYYY h:MM AM/PM format
const formatDateInTimezone = (dateString: string, timezone: string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(dateString).toLocaleString("en-US", options);
};

// Get current date in Pacific timezone (for storage)
const getCurrentPacificDate = (): string => {
  const now = new Date();
  // Convert to Pacific time for storage
  const pacificTime = new Date(
    now.toLocaleString("en-US", { timeZone: TIMEZONES.PACIFIC })
  );
  return pacificTime.toISOString();
};

const FeedbackView: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackPosts, setFeedbackPosts] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayTimezone, setDisplayTimezone] = useState<string>(
    TIMEZONES.VIETNAM
  );

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

      // Always store date in Pacific timezone
      const newFeedback = {
        date: getCurrentPacificDate(),
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

  // Toggle timezone display
  const toggleTimezone = () => {
    setDisplayTimezone((prev) =>
      prev === TIMEZONES.VIETNAM ? TIMEZONES.PACIFIC : TIMEZONES.VIETNAM
    );
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

      {/* Timezone Toggle */}
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleTimezone}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {displayTimezone === TIMEZONES.VIETNAM
            ? "🇻🇳 Vietnam Time"
            : "🇺🇸 Pacific Time"}
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
                      <small>
                        {formatDateInTimezone(post.date, displayTimezone)}
                      </small>
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
