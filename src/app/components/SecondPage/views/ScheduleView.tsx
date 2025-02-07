import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Schedule } from "../types";
import { scheduleService } from "../services/scheduleService";

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    scheduleService
      .getSchedules()
      .then((data) => {
        if (Array.isArray(data)) {
          // Ensure valid structure before setting state
          const validSchedules = data.filter(schedule => schedule.date && schedule.note);
          setSchedules(validSchedules);
        } else {
          console.error("Invalid data format received:", data);
          setSchedules([]); // Reset to an empty array
        }
      })
      .catch((error) => {
        console.error("Failed to fetch schedules:", error);
        setSchedules([]); // Ensure schedules is always an array
      });
  }, []);
  




  const handleSave = async () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    try {
      const newSchedule = { date: selectedDate.toISOString(), note };
      await scheduleService.saveSchedule(newSchedule);
      setSchedules(prev => [...prev, newSchedule]);
      setSelectedDate(null);
      setNote("");
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleDelete = async (date: string) => {
    try {
      await scheduleService.deleteSchedule(date);
      setSchedules(prev => prev.filter(schedule => schedule.date !== date));
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  // Function to check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Pick a date</h1>

<Calendar
  onChange={(value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      setSelectedDate(value[0]);
    }
  }}
  value={selectedDate}
  className="schedule-calendar"
  tileClassName={({ date }) => {
    let classes = "";
    if (isPastDate(date)) classes += " past-date";
    if (date.getDate() === 11) classes += " highlight-eleventh";
    return classes.trim();
  }}
/>


      {/* Textarea & Button Wrapper */}
      <div className="schedule-input-container">
        <textarea
          className="schedule-textarea"
          placeholder="Add a note or schedule here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="schedule-save-button" onClick={handleSave}>
          Save Schedule
        </button>
      </div>

      <h4 className="schedule-subtitle">Saved Schedules</h4>
      <ul className="schedule-list">
        {schedules.map((schedule, index) => (
          <li key={index} className="schedule-list-item">
            <span>
              {new Date(schedule.date).toDateString()}: {schedule.note}
            </span>
            <button
              className="schedule-delete-button"
              onClick={() => handleDelete(schedule.date)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleView;
