import React, { useState } from "react";
import "./register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("READER"); // rôle par défaut

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await fetch("http://localhost:4001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          roles: [role] // <-- rôle choisi par l'utilisateur
        }),
      });

      if (response.ok) {
        alert("Utilisateur créé !");
        // éventuellement rediriger vers Login
      } else {
        const errorData = await response.json();
        console.error("Erreur backend :", errorData);
        alert("Erreur lors de la création du compte");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de contacter le serveur");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Créer un compte</h2>

        <input
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="READER">Lecteur</option>
          <option value="AUTHOR">Auteur</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Créer le compte</button>
      </form>
    </div>
  );
}
