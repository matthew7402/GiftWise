import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
          />
          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
          />
          <button className="auth-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
