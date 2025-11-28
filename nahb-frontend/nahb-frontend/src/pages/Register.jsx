import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

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
        if (roles.includes(role)) {
            setRoles(roles.filter(r => r !== role));
        } else {
            setRoles([...roles, role]);
        }
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
                username,
                email,
                password,
                roles
            });
            // Redirection vers login
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h1>Inscription</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />

                <div style={{ textAlign: "left", marginBottom: "10px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={roles.includes("READER")}
                            onChange={() => handleRoleChange("READER")}
                        /> Reader
                    </label>
                    <label style={{ marginLeft: "15px" }}>
                        <input
                            type="checkbox"
                            checked={roles.includes("AUTHOR")}
                            onChange={() => handleRoleChange("AUTHOR")}
                        /> Author
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>

            <p style={{ marginTop: "15px" }}>
                Déjà un compte ? <span onClick={() => navigate("/login")} style={{ color: "#1976d2", cursor: "pointer" }}>Se connecter</span>
            </p>
        </div>
    );
}