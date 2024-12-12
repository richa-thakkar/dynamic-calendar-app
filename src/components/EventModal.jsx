import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const EventModal = ({ selectedDate, onSave, onClose, existingEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    // Populate fields if editing an existing event
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setStartTime(existingEvent.startTime);
      setEndTime(existingEvent.endTime);
    }
  }, [existingEvent]);

  const handleSubmit = () => {
    if (dayjs(endTime).isBefore(dayjs(startTime))) {
      alert("End time must be after start time.");
      return;
    }
    onSave({
      id: existingEvent?.id || Date.now(),
      date: selectedDate,
      title,
      description,
      startTime,
      endTime,
    });
    onClose();
  };

  return (
    <div className="modal shadcn-modal">
      <h2>{existingEvent ? "Edit Event" : "Add Event"}</h2>
      <p>Date: {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}</p>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="input"
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="input"
      />
      <div className="actions">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EventModal;
