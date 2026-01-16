import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optional: show loader while checking auth
    return <p>Loading...</p>;
  }

  if (!user) {
    // User not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authenticated → render the protected page
  return children;
};

export default ProtectedRoute;
