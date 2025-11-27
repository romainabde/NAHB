import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminPage/AdminHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllUsers from "./pages/AdminPage/AllUsers";
import AuteurHome from "./pages/AuteurPage/AuteurHome";
import HomePage from "./pages/Home/HomePage";
import CreateStoryPage from "./pages/Home/Author/CreateStory/CreateStoryPage";



function App() {
  return (
    <Router>
      <Routes>
        {/* Page par défaut */}
        <Route path="/" element={<Login />} />

        {/* Pages spécifiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/users" element={<AllUsers />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/author/create-story" element={<CreateStoryPage />} />
        {/* Tu peux ajouter d'autres routes plus tard */}
      </Routes>
    </Router>
  );
}

export default App;
