import { useState } from "react";
import Register from "./Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import UserDashboard from "./UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/userdashboard/:userId"
          element={<UserDashboard />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
