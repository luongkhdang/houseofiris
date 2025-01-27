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
    scheduleService.getSchedules()
      .then(setSchedules)
      .catch(error => console.error("Failed to fetch schedules:", error));
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pick a date</h1>
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) {
            setSelectedDate(value);
          } else if (Array.isArray(value)) {
            setSelectedDate(value[0]);
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
        onClick={handleSave}
      >
        Save Schedule
      </button>
      <h2 className="text-xl font-bold">Saved Schedules</h2>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {new Date(schedule.date).toDateString()}: {schedule.note}
            </span>
            <button
              className="text-red-500 hover:underline ml-4"
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