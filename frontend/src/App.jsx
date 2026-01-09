import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import api from "./api/axios";

function App() {

  useEffect(() => {
    api.post("/auth/register", {
      name: "John Doe",
      email: "john@example.com",
      password: "StrongPassword123"
    })
    .then(res => {
      console.log(res.data); // Success response
    })
    .catch(err => {
      console.error(err.response?.data || err.message); // Error handling
    });
  }, []); // Empty dependency array ensures this runs once after mount

  return (
    <BrowserRouter>
      <h1>GiftWise Frontend</h1>
    </BrowserRouter>
  );
}

export default App;
