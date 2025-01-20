// src/app/components/Timers.tsx
"use client";

import React, { useEffect, useState } from "react";

const Timers: React.FC = () => {
  const [daysUntilNext11th, setDaysUntilNext11th] = useState<string>("");
  const [daysUntilDec11, setDaysUntilDec11] = useState<string>("");

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();

      // Calculate days left until the next 11th of the month
      const currentMonth = now.getMonth();
      const next11thDate = new Date(now.getFullYear(), currentMonth, 11);
      if (now > next11thDate) {
        next11thDate.setMonth(currentMonth + 1); // Move to the next month
      }
      const daysUntilNext11 = Math.ceil(
        (next11thDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate days left until 11th December of the year
      const dec11Date = new Date(now.getFullYear(), 11, 11);
      if (now > dec11Date) {
        dec11Date.setFullYear(now.getFullYear() + 1); // Move to next year's Dec 11
      }
      const daysUntilDec11 = Math.ceil(
        (dec11Date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      setDaysUntilNext11th(`${daysUntilNext11} Days Left Until The Next 🎁Present`);
      setDaysUntilDec11(`${daysUntilDec11} Days Left Until Our 🥂Anniversary🥂`);
    };

    updateTimers(); // Initialize immediately
    const intervalId = setInterval(updateTimers, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <>
      {/* Top-right corner countdown timers */}
      <div className="timer-top-right">
  {daysUntilNext11th}
  {"\n"}
  {daysUntilDec11}
</div>

    </>
  );
};

export default Timers;
