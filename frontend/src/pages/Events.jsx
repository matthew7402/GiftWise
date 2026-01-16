import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

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
    <div>
      <h2>My Events</h2>

      {/* Create Event Form */}
      <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
        <input
          name="title"
          placeholder="Event title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Event description"
          value={form.description}
          onChange={handleChange}
        />
        <br />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Create Event</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* List of Events */}
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <Link to={`/events/${event._id}`}>{event.title}</Link>
            {" "}({new Date(event.date).toLocaleDateString()})
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
