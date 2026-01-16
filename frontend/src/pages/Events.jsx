import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../App.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
  const [error, setError] = useState("");

  // Fetch user's events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events"); // Only gets events of current user
        setEvents(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchEvents();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create new event
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const res = await api.post("/events", form); // backend sets organizer
      setEvents([...events, res.data]);
      setForm({ title: "", description: "", date: "" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating event");
    }
  };

  // Delete an event
  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">My Events</h2>

      {/* Create Event Form */}
      <form onSubmit={handleCreate} className="form-container">
        <input
          className="form-input"
          name="title"
          placeholder="Event title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="form-textarea"
          name="description"
          placeholder="Event description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <button className="form-button" type="submit">
          Create Event
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      {/* List of Events */}
      <ul className="event-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <Link to={`/events/${event._id}`} className="event-link">
              {event.title}
            </Link>
            <span className="event-date">
              ({new Date(event.date).toLocaleDateString()})
            </span>
            <button
              className="delete-button"
              onClick={() => handleDelete(event._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
