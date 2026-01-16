import { useEffect, useState } from "react";
import api from "../api/axios";
import "../App.css";

export default function Friends() {
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load incoming friend requests
  const loadRequests = async () => {
    try {
      const res = await api.get("/friends/requests");
      setRequests(res.data);
    } catch {
      setError("Failed to load friend requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Send friend request
  const sendInvite = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/friends/invite", { email });
      setMessage("Friend request sent");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    }
  };

  // Accept request
  const acceptRequest = async (id) => {
    await api.post(`/friends/accept/${id}`);
    loadRequests();
  };

  // Reject request
  const rejectRequest = async (id) => {
    await api.post(`/friends/reject/${id}`);
    loadRequests();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Friends</h1>

      {/* Send invite */}
      <form onSubmit={sendInvite} className="form-container">
        <input
          className="form-input"
          type="email"
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="form-button" type="submit">
          Send Invite
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <hr className="divider" />

      {/* Incoming requests */}
      <h2 className="section-title">Incoming Requests</h2>

      {requests.length === 0 && <p className="no-data">No pending requests</p>}

      <ul className="request-list">
        {requests.map((req) => (
          <li key={req._id} className="request-item">
            <strong>{req.sender.name}</strong> ({req.sender.email})
            <br />
            <button
              className="accept-button"
              onClick={() => acceptRequest(req._id)}
            >
              Accept
            </button>
            <button
              className="reject-button"
              onClick={() => rejectRequest(req._id)}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
