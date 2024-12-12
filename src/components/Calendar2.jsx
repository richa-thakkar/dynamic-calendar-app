import React, { useState } from "react";
import { exportEventsToJSON, exportEventsToCSV } from "../utils/exportUtils";
import dayjs from "dayjs";

const Calendar = ({ onDayClick, events, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs();
  const daysInMonth = dayjs(selectedDate).daysInMonth();

  const eventDates = events.map((event) =>
    dayjs(event.date).format("YYYY-MM-DD")
  );
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const startDay = currentMonth.startOf("month").day();

  const getDayClass = (date, dayIndex) => {
    const isSelected = date === selectedDate;
    const isToday = date === today.format("YYYY-MM-DD");
    const hasEvent = eventDates.includes(date);
    const isWeekend = dayIndex === 0 || dayIndex === 6; // Sunday (0) and Saturday (6)

    return {
      backgroundColor: isToday
        ? "#ffefc1"
        : isSelected
        ? "#d9f7be"
        : isWeekend
        ? "#f5f5f5"
        : hasEvent
        ? "#dff0d8"
        : "#fff",
      border: isToday || isSelected ? "2px solid #4caf50" : "1px solid #ddd",
      color: isToday || isSelected ? "#000" : "#555",
    };
  };

  return (
    <div className="calendar shadcn-container">
      <div className="header flex justify-between p-4">
        <button className="btn" onClick={handlePrevMonth}>
          Prev
        </button>
        <div>
          <h2 className="text-xl font-semibold">
            {currentMonth.format("MMMM YYYY")}
          </h2>
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => exportEventsToJSON(events, currentMonth)}
            >
              Export JSON
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => exportEventsToCSV(events, currentMonth)}
            >
              Export CSV
            </button>
          </div>
        </div>
        <button className="btn" onClick={handleNextMonth}>
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-4">
        {Array(startDay)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="empty" />
          ))}
        {days.map((day) => {
          const date = dayjs(selectedDate).date(day).format("YYYY-MM-DD");
          const dayIndex = dayjs(date).day(); // Day of the week (0-6)

          return (
            <div
              key={day}
              onClick={() => onDayClick(currentMonth.date(day).toISOString())}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                ...getDayClass(date, dayIndex),
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
