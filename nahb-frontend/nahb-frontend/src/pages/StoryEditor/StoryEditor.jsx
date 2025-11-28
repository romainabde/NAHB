import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import "./StoryEditor.css";

export default function StoryEditor() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    if (!user || !user.roles.some(r => r.role === "AUTHOR" || r === "AUTHOR")) {
        return <p>Vous n’êtes pas autorisé à créer une histoire.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!title || !description) {
            setErrorMsg("Le titre et la description sont obligatoires.");
            return;
        }

        setLoading(true);

        try {
            const res = await apiClient.post("http://localhost:4002/author/stories", {
                title,
                description,
                tags: tags || undefined
            });

            setSuccessMsg(`Histoire créée ! ID = ${res.data.id}`);
            setTitle("");
            setDescription("");
            setTags("");

            navigate(`/author/story/${res.data.id}/pages/new`);
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la création de l'histoire.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editor-container">
            <h2 className="editor-title">Créer une nouvelle histoire</h2>

            {errorMsg && <p className="editor-error">{errorMsg}</p>}
            {successMsg && <p className="editor-success">{successMsg}</p>}

            <form onSubmit={handleSubmit} className="editor-form">
                <div className="editor-field">
                    <label>Titre :</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="editor-input"
                    />
                </div>

                <div className="editor-field">
                    <label>Description :</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="editor-textarea"
                    />
                </div>

                <div className="editor-field">
                    <label>Tags (optionnel) :</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="editor-input"
                    />
                </div>

                <button type="submit" className="editor-btn" disabled={loading}>
                    {loading ? "Création..." : "Créer l'histoire"}
                </button>
            </form>
        </div>
    );
}