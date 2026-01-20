import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function FriendsEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/events/feed");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load friends' events");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) return <p className="loading">Loading friends' events...</p>;
  if (error) return <p className="error">{error}</p>;

  if (events.length === 0) {
    return <p className="no-data">No events from friends yet.</p>;
  }

  if (loading) {
  return (
    <p className="text-center text-gray-500 py-8">
      Loading friends' events...
    </p>
  );
}

if (error) {
  return (
    <p className="text-center text-red-600 py-8">
      {error}
    </p>
  );
}

return (
      <div className="min-h-screen bg-gray-50">

  <div className="max-w-5xl mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">
      Friends' Events
    </h1>

    {events.length === 0 ? (
      <p className="text-gray-500 text-center">
        No events from friends yet.
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

            {event.organizer && (
              <p className="text-sm text-gray-500 mt-1">
                Organized by{" "}
                <span className="font-medium text-gray-700">
                  {event.organizer.name}
                </span>
              </p>
            )}

            {event.date && (
              <p className="text-sm text-gray-500 mt-1">
                {new Date(event.date).toLocaleDateString()}
              </p>
            )}

            <Link
              to={`/events/${event._id}`}
              className="inline-block mt-4 bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-500 transition"
            >
              View Event & Gifts
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
  </div>
);

}
