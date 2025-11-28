import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../services/apiClient";

export default function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [publishedStories, setPublishedStories] = useState([]);
    const [loadingStories, setLoadingStories] = useState(false);
    const [errorStories, setErrorStories] = useState("");

    // fetch stories publiées
    useEffect(() => {
        const fetchPublishedStories = async () => {
            setLoadingStories(true);
            setErrorStories("");
            try {
                const res = await apiClient.get("http://localhost:4002/reader/stories/all");
                // filtrer uniquement celles publiées
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

    // handlers existants
    const handleCreateStory = () => navigate("/author/story/new");
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <h1>Bienvenue, {user?.username} !</h1>

            <div style={{ marginTop: "20px" }}>
                <strong>Vos rôles :</strong>{" "}
                {user?.roles.map((r, i) => (
                    <span key={i} style={{ marginRight: "10px" }}>{r.role || r}</span>
                ))}
            </div>

            {user?.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR") && (
                <>
                    <div style={{ marginTop: "40px" }}>
                        <button
                            onClick={handleCreateStory}
                            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginRight: "10px" }}
                        >
                            Créer une histoire
                        </button>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() => navigate("/author/stories")}
                            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                        >
                            Mes histoires
                        </button>
                    </div>
                </>
            )}

            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleLogout}
                    style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px" }}
                >
                    Déconnexion
                </button>
            </div>

            {/* -------------------- Section Histoires publiées -------------------- */}
            <div style={{ marginTop: "50px", textAlign: "left" }}>
                <h2>Histoires publiées</h2>
                {loadingStories && <p>Chargement...</p>}
                {errorStories && <p style={{ color: "red" }}>{errorStories}</p>}
                {publishedStories.length === 0 && !loadingStories && <p>Aucune histoire publiée pour le moment.</p>}
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {publishedStories.map(story => (
                        <li key={story.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                            <strong>{story.title}</strong> - {story.description}<br/>
                            <button
                                onClick={() => navigate(`/story/${story.id}`)}
                                style={{ marginTop: "5px", padding: "5px 10px", cursor: "pointer" }}
                            >
                                Jouer
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}