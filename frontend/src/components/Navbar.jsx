import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
     {/* <Link to="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link> */}
      <Link to="/events" style={{ marginRight: "1rem" }}>Events</Link>

      {user ? (
        <>
          <span style={{ marginRight: "1rem" }}>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
