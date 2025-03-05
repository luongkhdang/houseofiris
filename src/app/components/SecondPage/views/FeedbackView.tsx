import React, { useState, useEffect } from "react";
import { emailService } from "../services/emailService";

interface Feedback {
  date: string;
  content: string;
  replies?: string;
}

const FeedbackView: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackPosts, setFeedbackPosts] = useState<Feedback[]>([]);

  useEffect(() => {
    fetch("/api/feedbacks")
      .then((res) => res.json())
      .then(setFeedbackPosts)
      .catch((error) => console.error("Failed to fetch feedbacks:", error));
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
        date: new Date().toISOString(),
        content: feedback,
      };

      // Save feedback to feedbacks.json
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        throw new Error("Failed to save feedback.");
      }

      alert("Your feedback has been sent!");

      // Update feedback list immediately and ensure sorting
      setFeedbackPosts((prev: Feedback[]) => {
        const updatedList = [...prev, { ...newFeedback, replies: ".." }];
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
        {feedbackPosts.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <ul className="email-folder">
            {Array.isArray(feedbackPosts) ? feedbackPosts.map((post, index) => (
              <div key={index}>
              <li key={`item-${index}`} className="email-container">
                <p className="email-footer">
                  <small>{new Date(post.date).toLocaleString()}</small>
                </p>
                <p className="email-header">
                  <strong>Girlfriend🐎</strong>  💌:
                </p> 
                <p className="email-content">&nbsp;&nbsp;&nbsp;{post.content}</p>
              </li>

              <p className="email-reply">
              <span className="boyfriend-text">boifriend 🐂</span>: {post.replies}&nbsp;&nbsp;&nbsp;
                </p>

              </div>

              
            )) : <p className="text-gray-500">Error loading messages.</p>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FeedbackView;
