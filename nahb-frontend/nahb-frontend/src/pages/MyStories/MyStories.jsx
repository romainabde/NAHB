import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import "./MyStories.css";

export default function MyStories() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchStories = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await apiClient.get("http://localhost:4002/reader/stories");
            setStories(res.data);
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la récupération des histoires.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !user.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR")) return;
        fetchStories();
    }, [user]);

    const handleEdit = (id) => navigate(`/author/story/${id}/pages/new`);
    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette histoire ?")) return;
        try {
            await apiClient.delete(`http://localhost:4002/author/stories/${id}`);
            setStories(stories.filter(s => s.id !== id));
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la suppression.";
            setErrorMsg(message);
        }
    };

    if (!user || !user.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR")) {
        return <p className="error-text">Vous n'êtes pas autorisé à accéder à cette page.</p>;
    }

    return (
        <div className="mystories-container">
            {/* Bouton Retour à l'accueil */}
            <div className="back-home-container">
                <button className="back-home-btn" onClick={() => navigate("/")}>
                    ← Retour à l'accueil
                </button>
            </div>

            <h2 className="mystories-title">Mes histoires</h2>

            {errorMsg && <p className="error-text">{errorMsg}</p>}
            {loading && <p className="loading-text">Chargement...</p>}

            <table className="story-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {stories.map(story => (
                    <tr key={story.id}>
                        <td>{story.id}</td>
                        <td>{story.title}</td>
                        <td>{story.description}</td>
                        <td>{story.status}</td>
                        <td>{new Date(story.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button className="action-btn" onClick={() => handleEdit(story.id)}>
                                Éditer
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(story.id)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                {stories.length === 0 && !loading && (
                    <tr>
                        <td colSpan="6" className="no-stories">
                            Aucune histoire trouvée.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}