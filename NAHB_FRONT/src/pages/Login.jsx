import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erreur de connexion");
        return;
      }

      // 🔥🔥🔥 STOCKAGE DU TOKEN + USER 🔥🔥🔥
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥🔥🔥 REDIRECTION SELON ROLE 🔥🔥🔥
      if (data.user.roles.includes("ADMIN")) {
        navigate("/admin");       // si admin → page admin
      } else {
        navigate("/home");        // si user normal → home classique
      }

    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        <input
          type="text"
          placeholder="Email ou Pseudo"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Se connecter</button>

        <p className="register-link" onClick={() => navigate("/register")}>
          Pas de compte ? Créer un compte
        </p>
      </form>
    </div>
  );
}
