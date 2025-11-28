import { useState } from "react";
import apiClient from "../../services/apiClient";
import "./ChoiceEditor.css";

export default function ChoiceEditor({ storyId, pages }) {
    const [text, setText] = useState("");
    const [fromPageId, setFromPageId] = useState("");
    const [toPageId, setToPageId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!text || !fromPageId || !toPageId) {
            setErrorMsg("Tous les champs sont obligatoires.");
            return;
        }

        setLoading(true);
        try {
            await apiClient.post(
                `http://localhost:4002/author/stories/pages/${fromPageId}/choices`,
                { text, toPageId: parseInt(toPageId) }
            );
            setSuccessMsg("Choix ajouté !");
            setText("");
            setFromPageId("");
            setToPageId("");
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la création du choix.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="choice-editor-container">
            <h3 className="choice-editor-title">Ajouter un choix global</h3>
            {errorMsg && <p className="choice-editor-error">{errorMsg}</p>}
            {successMsg && <p className="choice-editor-success">{successMsg}</p>}

            <form onSubmit={handleSubmit} className="choice-editor-form">
                <div className="choice-editor-field">
                    <label>Page de départ :</label>
                    <select
                        value={fromPageId}
                        onChange={e => setFromPageId(e.target.value)}
                        className="choice-editor-select"
                    >
                        <option value="">-- Choisir une page --</option>
                        {pages.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.id}: {p.content.substring(0, 30)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="choice-editor-field">
                    <label>Page d'arrivée :</label>
                    <select
                        value={toPageId}
                        onChange={e => setToPageId(e.target.value)}
                        className="choice-editor-select"
                    >
                        <option value="">-- Choisir une page --</option>
                        {pages.filter(p => p.id !== parseInt(fromPageId)).map(p => (
                            <option key={p.id} value={p.id}>
                                {p.id}: {p.content.substring(0, 30)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="choice-editor-field">
                    <label>Texte du choix :</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="choice-editor-input"
                    />
                </div>

                <button type="submit" className="choice-editor-btn" disabled={loading}>
                    {loading ? "Création..." : "Ajouter le choix"}
                </button>
            </form>
        </div>
    );
}