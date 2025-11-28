import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import ChoiceEditor from "./ChoiceEditor.jsx";
import "./PageEditor.css";

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
            const pageRes = await apiClient.post(
                `http://localhost:4002/author/stories/${storyId}/pages`,
                { content, isEnding }
            );
            const pageId = pageRes.data.id;

            if (pages.length === 0) {
                await apiClient.patch(`http://localhost:4002/author/stories/${storyId}`, { startPageId: pageId });
            }

            setSuccessMsg(`Page créée ! ID=${pageId}`);
            setContent("");
            setIsEnding(false);
            fetchPages();
            setEditingPageId(pageId);
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la création de la page.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);
        try {
            await apiClient.patch(`http://localhost:4002/author/stories/${storyId}`, {
                status: "PUBLISHED"
            });
            setSuccessMsg("Histoire publiée avec succès ! Redirection dans 3 secondes...");
            setTimeout(() => navigate("/"), 3000);
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la publication.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR")) {
        return <p>Vous n’êtes pas autorisé à éditer cette histoire.</p>;
    }

    return (
        <div className="page-editor-container">
            <h2 className="page-editor-title">Ajouter une page pour l’histoire {storyId}</h2>

            {errorMsg && <p className="page-editor-error">{errorMsg}</p>}
            {successMsg && <p className="page-editor-success">{successMsg}</p>}

            <form onSubmit={handleSubmit} className="page-editor-form">
                <div className="page-editor-field">
                    <label>Contenu :</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="page-editor-textarea"
                    />
                </div>

                <div className="page-editor-field">
                    <label>
                        <input
                            type="checkbox"
                            checked={isEnding}
                            onChange={(e) => setIsEnding(e.target.checked)}
                        /> Page finale
                    </label>
                </div>

                <button type="submit" className="page-editor-btn" disabled={loading}>
                    {loading ? "Création..." : "Ajouter la page"}
                </button>
            </form>

            <h3 className="page-editor-subtitle">Pages existantes</h3>
            <ul className="page-editor-list">
                {pages.map(p => (
                    <li key={p.id} className="page-editor-list-item">
                        {p.id}: {p.content.substring(0, 50)} {p.isEnding ? "(FIN)" : ""}
                    </li>
                ))}
            </ul>

            {editingPageId && (
                <ChoiceEditor storyId={storyId} fromPageId={editingPageId} pages={pages} />
            )}

            <div className="page-editor-publish">
                <button onClick={handlePublish} className="page-editor-publish-btn" disabled={loading}>
                    Publier l'histoire
                </button>
            </div>
        </div>
    );
}