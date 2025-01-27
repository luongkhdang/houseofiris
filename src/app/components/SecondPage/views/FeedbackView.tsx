import React, { useState } from "react";
import { emailService } from "../services/emailService";

const FeedbackView: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback!");
      return;
    }

    setIsSubmitting(true);
    try {
      await emailService.sendFeedback(feedback);
      alert("Your feedback has been sent!");
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
      <h1 className="text-2xl font-bold">📝Bản Tin Nhắn🐈</h1>
      <textarea
        className="w-full p-2 border rounded min-h-[150px]"
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
  );
};

export default FeedbackView;