import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const goToUsers = () => {
    navigate("/admin/users"); // route vers AllUsers
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Admin</h1>
      <p>Bienvenue, {user?.username} (ADMIN)</p>

      <button
        style={{ marginTop: "20px", padding: "10px 20px" }}
        onClick={goToUsers}
      >
        Voir la liste des utilisateurs
      </button>
    </div>
  );
}
