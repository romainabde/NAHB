import { useState, useContext } from "react";
import { loginRequest } from "../services/authApi";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Style/Login.css";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginRequest(email, password);
            login(res.token);
            navigate("/");
        } catch (err) {
            setError("Email ou mot de passe incorrect");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Connexion</h2>

            {error && <p className="login-error">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="login-field">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-btn">Se connecter</button>
            </form>
        </div>
    );
}