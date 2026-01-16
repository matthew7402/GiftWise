import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import "../App.css";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [newGift, setNewGift] = useState({
    name: "",
    description: "",
    image: null
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch helpers ---------------- */

  const fetchGifts = async () => {
    const res = await api.get(`/gifts/event/${id}`);
    setGifts(res.data);
  };

  const fetchEvent = async () => {
    const res = await api.get(`/events/${id}`);
    setEvent(res.data);
  };

  /* ---------------- Initial load ---------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchEvent();
        await fetchGifts();
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* ---------------- Derived state ---------------- */

  const isOrganizer =
    event?.organizer?._id
      ? event.organizer._id === user._id
      : event?.organizer === user._id;

  /* ---------------- Form handling ---------------- */

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewGift((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value
    }));
  };

  const handleCreateGift = async (e) => {
    e.preventDefault();
    if (!newGift.name.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newGift.name);
      formData.append("description", newGift.description);
      formData.append("event", id);
      if (newGift.image) formData.append("image", newGift.image);

      await api.post("/gifts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await fetchGifts();
      setNewGift({ name: "", description: "", image: null });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating gift");
    }
  };

  /* ---------------- Gift actions ---------------- */

  const handlePledge = async (giftId) => {
    try {
      await api.post(`/gifts/${giftId}/pledge`);
      await fetchGifts();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleUnpledge = async (giftId) => {
    try {
      await api.post(`/gifts/${giftId}/unpledge`);
      await fetchGifts();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDeleteGift = async (giftId) => {
    try {
      await api.delete(`/gifts/${giftId}`);
      await fetchGifts();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  /* ---------------- Render ---------------- */

  if (loading) return <p className="loading">Loading event details...</p>;
  if (!event) return <p className="error">Event not found</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">{event.title}</h1>
      <p className="event-description">{event.description}</p>
      <p className="event-date">
        Date: {new Date(event.date).toLocaleDateString()}
      </p>

      <h2 className="section-title">Gifts</h2>
      <ul className="gift-list">
        {gifts.map((gift) => {
          const pledgedByMe = gift.pledgedBy === user._id;

          return (
            <li key={gift._id} className="gift-item">
              <h3 className="gift-title">{gift.name}</h3>
              <p className="gift-description">{gift.description}</p>
              {gift.imageUrl && (
                <img
                  src={gift.imageUrl}
                  alt={gift.name}
                  className="gift-image"
                />
              )}
              <p>
                {gift.pledgedBy
                  ? pledgedByMe
                    ? "You pledged this"
                    : "Already pledged"
                  : "Not pledged yet"}
              </p>

              {/* Friend actions */}
              {!isOrganizer && !gift.pledgedBy && (
                <button
                  className="pledge-button"
                  onClick={() => handlePledge(gift._id)}
                >
                  Pledge
                </button>
              )}

              {!isOrganizer && pledgedByMe && (
                <button
                  className="unpledge-button"
                  onClick={() => handleUnpledge(gift._id)}
                >
                  Unpledge
                </button>
              )}

              {/* Organizer actions */}
              {isOrganizer && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteGift(gift._id)}
                >
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* -------- Gift creation (organizer only) -------- */}
      {isOrganizer && (
        <form onSubmit={handleCreateGift} className="form-container">
          <input
            className="form-input"
            name="name"
            placeholder="Gift name"
            value={newGift.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="form-textarea"
            name="description"
            placeholder="Gift description"
            value={newGift.description}
            onChange={handleChange}
          />
          <input
            className="form-input"
            name="image"
            type="file"
            onChange={handleChange}
          />
          <button className="form-button" type="submit">
            Add Gift
          </button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
