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
  <div className="min-h-screen bg-gray-50">
  <div className="max-w-5xl mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">My Events</h1>

    {/* Create Event Form */}
    <form
      onSubmit={handleCreate}
      className="bg-white border rounded-lg p-4 mb-8 shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-4">
        Create New Event
      </h2>

      <div className="space-y-3">
        <input
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="title"
          placeholder="Event title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="description"
          placeholder="Event description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
        >
          Create Event
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-3">
          {error}
        </p>
      )}
    </form>

    {/* Events List */}
    <h2 className="text-xl font-semibold mb-4">
      Your Events
    </h2>

    {events.length === 0 ? (
      <p className="text-gray-500 text-center">
        No events yet. Create your first one.
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold">
              {event.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(event.date).toLocaleDateString()}
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/events/${event._id}`}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-500 transition"
              >
                View
              </Link>

              <button
                onClick={() => handleDelete(event._id)}
                className="text-red-600 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  </div>
);

}
