// import { BrowserRouter } from "react-router-dom";
// import { useEffect } from "react";
// import api from "./api/axios";

// function App() {

//   useEffect(() => {
//     api.post("/auth/register", {
//       name: "John Doe",
//       email: "john@example.com",
//       password: "StrongPassword123"
//     })
//     .then(res => {
//       console.log(res.data); // Success response
//     })
//     .catch(err => {
//       console.error(err.response?.data || err.message); // Error handling
//     });
//   }, []); // Empty dependency array ensures this runs once after mount

//   return (
//     <BrowserRouter>
//       <h1>GiftWise Frontend</h1>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import FriendsEvents from "./pages/FriendsEvents.jsx";

import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/navbar";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Friends from "./pages/Friends";


function App() {
  const { loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar is now visible on all pages */}
      <Routes>
        <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route path="/feed" element={<FriendsEvents />} />
          <Route path="/friends" element={<Friends />} />

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

