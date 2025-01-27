import { Schedule } from "../types";

export const scheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    const response = await fetch("/api/schedules");
    return response.json();
  },

  saveSchedule: async (schedule: Schedule): Promise<Schedule> => {
    const response = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    });
    return response.json();
  },

  deleteSchedule: async (date: string): Promise<void> => {
    await fetch("/api/schedules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
  }
};