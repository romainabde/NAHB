import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import "./Style/Register.css";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roles, setRoles] = useState(["READER"]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRoleChange = (role) => {
        if (roles.includes(role)) setRoles(roles.filter(r => r !== role));
        else setRoles([...roles, role]);
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !password || !confirmPassword) {
            setError("Tous les champs sont requis.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Email invalide.");
            return;
        }
        if (password.length < 6) {
            setError("Le mot de passe doit faire au moins 6 caractères.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (roles.length === 0) {
            setError("Veuillez sélectionner au moins un rôle.");
            return;
        }

        setLoading(true);
        try {
            await apiClient.post("http://localhost:4001/auth/register", {
                username, email, password, roles
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Inscription</h2>

            {error && <p className="register-error">{error}</p>}

            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="register-input"
                />

                <div className="register-roles">
                    <label>
                        <input
                            type="checkbox"
                            checked={roles.includes("READER")}
                            onChange={() => handleRoleChange("READER")}
                        /> Reader
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={roles.includes("AUTHOR")}
                            onChange={() => handleRoleChange("AUTHOR")}
                        /> Author
                    </label>
                </div>

                <button type="submit" className="register-btn" disabled={loading}>
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>

            <p className="register-login-link">
                Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span>
            </p>
        </div>
    );
}