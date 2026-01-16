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

  return (
    <div className="page-container">
      <h1 className="page-title">Friends' Events</h1>

      <ul className="event-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h3 className="event-title">{event.title}</h3>

            {event.organizer && (
              <p className="event-organizer">
                Organized by: <strong>{event.organizer.name}</strong>
              </p>
            )}

            {event.date && (
              <p className="event-date">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
            )}

            <Link to={`/events/${event._id}`} className="event-link">
              View Event & Gifts
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
