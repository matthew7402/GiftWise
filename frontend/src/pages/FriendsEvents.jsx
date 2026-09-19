import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../App.css";
const readableDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Date to be decided";

export default function FriendsEvents() {
  const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { api.get("/events/feed").then((res) => setEvents(res.data)).catch(() => setError("We couldn't load your friends’ events.")).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="loading-state">Loading celebrations…</div>;
  return <main className="page-wrap"><header className="page-header"><div><p className="eyebrow">From your friends</p><h1 className="page-title">Discover celebrations</h1><p className="page-subtitle">See what your friends are planning and find the right gift.</p></div></header>{error ? <p className="notice notice-error">{error}</p> : events.length === 0 ? <div className="empty-state"><div className="empty-icon">✦</div><h3>Nothing to discover yet</h3><p>Add friends to see their upcoming celebrations here.</p></div> : <div className="event-grid">{events.map((event) => <article key={event._id} className="surface event-card"><h3 className="card-title">{event.title}</h3>{event.organizer && <p className="card-copy">Hosted by <strong className="text-slate-700">{event.organizer.name}</strong></p>}<p className="metadata"><span aria-hidden="true">◷</span>{readableDate(event.date)}</p><div className="card-actions"><Link to={`/events/${event._id}`} className="btn btn-primary">View wishlist</Link></div></article>)}</div>}</main>;
}
