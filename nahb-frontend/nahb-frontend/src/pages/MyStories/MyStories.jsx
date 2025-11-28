import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

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

    const handleEdit = (id) => {
        navigate(`/author/story/${id}/pages/new`);
    };

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
        return <p>Vous n'êtes pas autorisé à accéder à cette page.</p>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "50px auto" }}>
            <h2>Mes histoires</h2>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {loading && <p>Chargement...</p>}

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                <tr>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Titre</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Créé le</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {stories.map(story => (
                    <tr key={story.id}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{story.id}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{story.title}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{story.description}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{story.status}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(story.createdAt).toLocaleDateString()}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <button
                                onClick={() => handleEdit(story.id)}
                                style={{ marginRight: "10px", padding: "5px 10px", cursor: "pointer" }}
                            >
                                Éditer
                            </button>
                            <button
                                onClick={() => handleDelete(story.id)}
                                style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "3px" }}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                {stories.length === 0 && !loading && (
                    <tr>
                        <td colSpan="6" style={{ padding: "10px", textAlign: "center" }}>Aucune histoire trouvée.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}