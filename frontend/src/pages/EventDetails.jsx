import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [newGift, setNewGift] = useState({ name: "", description: "", image: null });
  const [error, setError] = useState("");

  // Fetch event + gifts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Event info
        const eventRes = await api.get(`/events/${id}`);
        setEvent(eventRes.data);

        // Gifts for this event
        const giftsRes = await api.get(`/gifts/event/${id}`);
        setGifts(giftsRes.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchData();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewGift({ ...newGift, image: files[0] });
    } else {
      setNewGift({ ...newGift, [name]: value });
    }
  };

  // Create a new gift
  const handleCreateGift = async (e) => {
    e.preventDefault();
    if (!newGift.name.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newGift.name);
      formData.append("description", newGift.description);
      formData.append("event", id);
      if (newGift.image) formData.append("image", newGift.image);

      const res = await api.post("/gifts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setGifts([...gifts, res.data]);
      setNewGift({ name: "", description: "", image: null });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating gift");
    }
  };

  // Pledge a gift
  const handlePledge = async (giftId) => {
    try {
      const res = await api.post(`/gifts/${giftId}/pledge`);
      setGifts(gifts.map(g => g._id === giftId ? res.data : g));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Unpledge a gift
  const handleUnpledge = async (giftId) => {
    try {
      const res = await api.post(`/gifts/${giftId}/unpledge`);
      setGifts(gifts.map(g => g._id === giftId ? res.data : g));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Delete gift
  const handleDeleteGift = async (giftId) => {
    try {
      await api.delete(`/gifts/${giftId}`);
      setGifts(gifts.filter(g => g._id !== giftId));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      {event.description && <p>{event.description}</p>}
      {event.date && <p>Date: {new Date(event.date).toLocaleDateString()}</p>}
      <p>Organizer ID: {event.organizer}</p>
      <p>Created at: {new Date(event.createdAt).toLocaleString()}</p>

      <hr />

      <h3>Gifts</h3>

      {/* Gift Form */}
      <form onSubmit={handleCreateGift}>
        <input
          name="name"
          placeholder="Gift name"
          value={newGift.name}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Gift description"
          value={newGift.description}
          onChange={handleChange}
        />
        <br />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <br />
        <button type="submit">Add Gift</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Gifts List */}
      <ul>
        {gifts.map((gift) => (
          <li key={gift._id} style={{ marginBottom: "1rem" }}>
            <strong>{gift.name}</strong>
            {gift.description && <p>{gift.description}</p>}
            {gift.imageUrl && <img src={gift.imageUrl} alt={gift.name} width={100} />}
            <p>
              {gift.pledgedBy
                ? gift.pledgedBy === user._id
                  ? "You pledged this"
                  : "Already pledged"
                : "Not pledged yet"}
            </p>

            {/* Pledge / Unpledge buttons */}
            {!gift.pledgedBy && <button onClick={() => handlePledge(gift._id)}>Pledge</button>}
            {gift.pledgedBy === user._id && <button onClick={() => handleUnpledge(gift._id)}>Unpledge</button>}

            {/* Delete button only if you are organizer */}
            {event.organizer === user._id && <button onClick={() => handleDeleteGift(gift._id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
