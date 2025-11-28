import { useState, useEffect, useContext } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import ChoiceEditor from "./ChoiceEditor.jsx";

export default function PageEditor() {
    const { user } = useContext(AuthContext);
    const { id: storyId } = useParams();
    const [pages, setPages] = useState([]);
    const [content, setContent] = useState("");
    const [isEnding, setIsEnding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [editingPageId, setEditingPageId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await apiClient.get(`http://localhost:4002/reader/stories/${storyId}/pages`);
            setPages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        if (!content) {
            setErrorMsg("Le contenu de la page est obligatoire.");
            return;
        }
        setLoading(true);

        try {
            // 1️⃣ Créer la page
            const pageRes = await apiClient.post(
                `http://localhost:4002/author/stories/${storyId}/pages`,
                { content, isEnding }
            );
            const pageId = pageRes.data.id;

            // 2️⃣ Définir startPageId si première page
            if (pages.length === 0) {
                await apiClient.patch(`http://localhost:4002/author/stories/${storyId}`, { startPageId: pageId });
            }

            setSuccessMsg(`Page créée ! ID=${pageId}`);
            setContent("");
            setIsEnding(false);
            fetchPages();
            setEditingPageId(pageId); // pour créer un choix
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la création de la page.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR")) {
        return <p>Vous n’êtes pas autorisé à éditer cette histoire.</p>;
    }

    const handlePublish = async () => {
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);
        try {
            await apiClient.patch(`http://localhost:4002/author/stories/${storyId}`, {
                status: "PUBLISHED"
            });
            setSuccessMsg("Histoire publiée avec succès ! Redirection dans 3 secondes...");

            // Redirection après 3 secondes
            setTimeout(() => {
                navigate("/");
            }, 3000);

        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la publication.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ maxWidth: "700px", margin: "50px auto" }}>
            <h2>Ajouter une page pour l’histoire {storyId}</h2>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Contenu :</label><br/>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: "100%", padding: "8px", minHeight: "80px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={isEnding}
                            onChange={(e) => setIsEnding(e.target.checked)}
                        /> Page finale
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Création..." : "Ajouter la page"}
                </button>
            </form>

            <h3 style={{ marginTop: "30px" }}>Pages existantes</h3>
            <ul>
                {pages.map(p => (
                    <li key={p.id}>
                        {p.id}: {p.content.substring(0, 50)} {p.isEnding ? "(FIN)" : ""}
                    </li>
                ))}
            </ul>

            {editingPageId && (
                <ChoiceEditor storyId={storyId} fromPageId={editingPageId} pages={pages} />
            )}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    Publier l'histoire
                </button>
            </div>
        </div>


    );
}