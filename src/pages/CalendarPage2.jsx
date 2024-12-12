import React, { useState, useEffect } from "react";
import { getEvents, saveEvent, deleteEvent } from "../utils/storage";
import Calendar2 from "../components/Calendar2";
import EventModal from "../components/EventModal";
import dayjs from "dayjs";

const CalendarPage2 = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const isOverlapping = (newEvent, date) => {
    return events.some((event) => {
      return (
        event.date === date &&
        ((newEvent.startTime >= event.startTime &&
          newEvent.startTime < event.endTime) ||
          (newEvent.endTime > event.startTime &&
            newEvent.endTime <= event.endTime))
      );
    });
  };

  const handleSaveEvent = (event) => {
    if (isOverlapping(newEvent, selectedDate)) {
      alert("Event time overlaps with an existing event.");
      return;
    }

    if (editingEvent) {
      const updatedEvents = events.map((e) =>
        e.id === editingEvent.id ? { ...event, id: editingEvent.id } : e
      );
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } else {
      saveEvent(event);
      setEvents(getEvents());
    }
    setShowModal(false);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
    setEvents(getEvents());
  };
  const filteredEvents = events.filter(
    (event) =>
      dayjs(event.date).isSame(selectedDate, "day") &&
      event.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const eventsForSelectedDate = events.filter((event) =>
    dayjs(event.date).isSame(selectedDate, "day")
  );

  const handleEventDrop = (updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };
  return (
    <div className="calendar-page" style={{ display: "flex", gap: "20px" }}>
      {/* Calendar Section */}
      <div style={{ width: "60%" }}>
        <Calendar2
          onDayClick={handleDayClick}
          events={events}
          selectedDate={selectedDate}
          onEventDrop={handleEventDrop}
        />
      </div>

      {/* Highlights Section */}
      {eventsForSelectedDate.length >= 0 && selectedDate && (
        <div style={{ width: "35%" }}>
          <h3>Highlights for {dayjs(selectedDate).format("MMMM D, YYYY")}</h3>
          <input
            type="text"
            placeholder="Search events"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="input"
          />
          <div className="event-list">
            {eventsForSelectedDate.length === 0 ? (
              <p>No events for this day.</p>
            ) : (
              filteredEvents.map(
                //  eventsForSelectedDate.map
                (event) => (
                  <div
                    key={event.id}
                    className="event-item"
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <p>
                      {event.startTime} - {event.endTime}
                    </p>
                    <button
                      className="btn btn-primary"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}

      {showModal && (
        <EventModal
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onClose={() => setShowModal(false)}
          existingEvent={editingEvent}
        />
      )}
    </div>
  );
};

export default CalendarPage2;
