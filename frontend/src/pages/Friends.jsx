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
      <div className="min-h-screen bg-gray-50">

  <div className="max-w-5xl mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">Friends</h1>

    {/* Send invite */}
    <form
      onSubmit={sendInvite}
      className="bg-white border rounded-lg p-4 mb-8 shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-4">
        Invite a Friend
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
        >
          Send Invite
        </button>
      </div>

      {message && (
        <p className="text-sm text-green-600 mt-3">
          {message}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-3">
          {error}
        </p>
      )}
    </form>

    {/* Incoming Requests */}
    <h2 className="text-xl font-semibold mb-4">
      Incoming Requests
    </h2>

    {requests.length === 0 ? (
      <p className="text-gray-500 text-center">
        No pending requests
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <p className="font-semibold">
              {req.sender.name}
            </p>

            <p className="text-sm text-gray-500">
              {req.sender.email}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => acceptRequest(req._id)}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-500 transition"
              >
                Accept
              </button>

              <button
                onClick={() => rejectRequest(req._id)}
                className="border px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
              >
                Reject
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
