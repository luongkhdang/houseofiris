"use client";

import React, { useEffect, useState } from "react";

// Move targetDate outside the component to avoid re-creating it
const targetDate = new Date("2024-12-11T14:00:00+07:00"); // 11 Dec 2024, 2:00 PM, Vietnam Timezone

const Timer: React.FC = () => {
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const difference = now.getTime() - targetDate.getTime();

      // Calculate months and remaining time
      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      const months = Math.floor(totalDays / 30); // Approximate months (30 days per month)
      const days = totalDays % 30; // Remaining days after months
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setElapsedTime(
        `Yay, we've been together for:\n${months} Months ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds !!`
      );
    };

    updateTimer(); // Initialize immediately
    const intervalId = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // No need for `targetDate` in the dependency array

  return (
    <div
      className="timer whitespace-pre-line" // `whitespace-pre-line` ensures line breaks from `\n` are rendered
    >
      {elapsedTime}
    </div>
  );
};

export default Timer;
