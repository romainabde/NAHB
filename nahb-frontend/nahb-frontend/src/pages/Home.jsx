import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../services/apiClient";
import "./Style/Home.css";

export default function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [publishedStories, setPublishedStories] = useState([]);
    const [loadingStories, setLoadingStories] = useState(false);
    const [errorStories, setErrorStories] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStories = publishedStories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchPublishedStories = async () => {
            setLoadingStories(true);
            setErrorStories("");
            try {
                const res = await apiClient.get("http://localhost:4002/reader/stories/all");
                const published = res.data.filter(story => story.status === "PUBLISHED");
                setPublishedStories(published);
            } catch (err) {
                const message = err.response?.data?.error || "Erreur lors de la récupération des histoires.";
                setErrorStories(message);
            } finally {
                setLoadingStories(false);
            }
        };
        fetchPublishedStories();
    }, []);

    const handleCreateStory = () => navigate("/author/story/new");
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Bienvenue, {user?.username} !</h1>

            <div className="roles-container">
                <strong>Vos rôles :</strong>{" "}
                {user?.roles.map((r, i) => (
                    <span key={i} className="role-badge">{r.role || r}</span>
                ))}
            </div>

            {user?.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR") && (
                <div className="author-buttons">
                    <button className="btn main-btn" onClick={handleCreateStory}>Créer une histoire</button>
                    <button className="btn main-btn" onClick={() => navigate("/author/stories")}>Mes histoires</button>
                </div>
            )}

            {user?.roles.some(r => r.role === "ADMIN" || r === "ADMIN") && (
                <div className="admin-button">
                    <button className="btn admin-btn" onClick={() => navigate("/admin/dashboard")}>Admin Dashboard</button>
                </div>
            )}

            <div className="logout-button">
                <button className="btn logout-btn" onClick={handleLogout}>Déconnexion</button>
            </div>

            <div className="stories-section">
                <h2>Histoires publiées</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher par titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {loadingStories && <p className="loading-text">Chargement...</p>}
                {errorStories && <p className="error-text">{errorStories}</p>}
                {publishedStories.length === 0 && !loadingStories && <p className="no-stories">Aucune histoire publiée pour le moment.</p>}

                <ul className="story-list">
                    {filteredStories.map(story => (
                        <li key={story.id} className="story-item">
                            <strong>{story.title}</strong> - {story.description}
                            <button className="btn play-btn" onClick={() => navigate(`/story/${story.id}`)}>Jouer</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}