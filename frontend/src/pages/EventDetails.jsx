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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="page-container">
      <h1 className="page-title">{event.title}</h1>
      <p className="event-description">{event.description}</p>
      <p className="event-date">
        Date: {new Date(event.date).toLocaleDateString()}
      </p>

      <h2 className="text-xl font-semibold mb-4">
  Gifts
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {gifts.map((gift) => {
    const pledgedByMe = gift.pledgedBy === user._id;

    return (
      <div
        key={gift._id}
        className="bg-white border rounded-lg p-4 shadow-sm"
      >
        {/* Gift image */}
        {gift.imageUrl && (
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
        )}

        {/* Gift info */}
        <h3 className="text-lg font-semibold">
          {gift.name}
        </h3>

        {gift.description && (
          <p className="text-sm text-gray-500 mt-1">
            {gift.description}
          </p>
        )}

        {/* Pledge status */}
        <p className="text-sm mt-2">
          {gift.pledgedBy
            ? pledgedByMe
              ? "You pledged this"
              : "Already pledged"
            : "Not pledged yet"}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {!isOrganizer && !gift.pledgedBy && (
            <button
              onClick={() => handlePledge(gift._id)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-500 transition"
            >
              Pledge
            </button>
          )}

          {!isOrganizer && pledgedByMe && (
            <button
              onClick={() => handleUnpledge(gift._id)}
              className="border px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
            >
              Unpledge
            </button>
          )}

          {isOrganizer && (
            <button
              onClick={() => handleDeleteGift(gift._id)}
              className="text-red-600 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  })}
</div>


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
    </div>
  );
}
