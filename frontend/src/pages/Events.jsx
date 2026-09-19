import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../App.css";

const readableDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Date to be decided";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
  const [error, setError] = useState("");
  useEffect(() => { api.get("/events").then((res) => setEvents(res.data)).catch(() => setError("We couldn't load your events. Please try again.")); }, []);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCreate = async (e) => { e.preventDefault(); if (!form.title.trim()) return; try { const res = await api.post("/events", form); setEvents([...events, res.data]); setForm({ title: "", description: "", date: "" }); setError(""); } catch (err) { setError(err.response?.data?.message || "We couldn't create this event."); } };
  const handleDelete = async (id) => { try { await api.delete(`/events/${id}`); setEvents(events.filter((event) => event._id !== id)); } catch { setError("We couldn't delete this event. Please try again."); } };

  return <main className="page-wrap">
    <header className="page-header"><div><p className="eyebrow">Your planning space</p><h1 className="page-title">My events</h1><p className="page-subtitle">Create a moment worth celebrating, then build the perfect wishlist.</p></div></header>
    <form onSubmit={handleCreate} className="surface form-card"><h2 className="section-title">Plan something special</h2><p className="section-description">Start with the essentials. You can add gifts from the event page.</p><div className="grid gap-4 md:grid-cols-2"><div><label className="field-label" htmlFor="event-title">Event name</label><input id="event-title" className="field-input" name="title" placeholder="e.g. Sara's birthday" value={form.title} onChange={handleChange} required /></div><div><label className="field-label" htmlFor="event-date">Date</label><input id="event-date" className="field-input" name="date" type="date" value={form.date} onChange={handleChange} /></div><div className="md:col-span-2"><label className="field-label" htmlFor="event-description">A little context <span className="font-normal text-slate-400">(optional)</span></label><textarea id="event-description" className="field-textarea" name="description" placeholder="Tell your friends what you're celebrating..." value={form.description} onChange={handleChange} /></div></div><div className="mt-4"><button type="submit" className="btn btn-primary">Create event <span aria-hidden="true">→</span></button></div>{error && <p className="notice notice-error">{error}</p>}</form>
    <section><div className="mb-4 flex items-center justify-between"><h2 className="section-title">Your upcoming events</h2><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">{events.length} {events.length === 1 ? "event" : "events"}</span></div>{events.length === 0 ? <div className="empty-state"><div className="empty-icon">✦</div><h3>Your calendar is wide open</h3><p>Create your first event to start building a thoughtful wishlist.</p></div> : <div className="event-grid">{events.map((event) => <article key={event._id} className="surface event-card"><h3 className="card-title">{event.title}</h3>{event.description && <p className="card-copy">{event.description}</p>}<p className="metadata"><span aria-hidden="true">◷</span>{readableDate(event.date)}</p><div className="card-actions"><Link to={`/events/${event._id}`} className="btn btn-primary">Open event</Link><button onClick={() => handleDelete(event._id)} className="btn btn-danger">Delete</button></div></article>)}</div>}</section>
  </main>;
}
