import { useState } from "react";
import apiClient from "../../services/apiClient";

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
        <div style={{ marginTop: "30px" }}>
            <h3>Ajouter un choix global</h3>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Page de départ :</label><br/>
                    <select value={fromPageId} onChange={e => setFromPageId(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                        <option value="">-- Choisir une page --</option>
                        {pages.map(p => (
                            <option key={p.id} value={p.id}>{p.id}: {p.content.substring(0, 30)}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Page d'arrivée :</label><br/>
                    <select value={toPageId} onChange={e => setToPageId(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                        <option value="">-- Choisir une page --</option>
                        {pages.filter(p => p.id !== parseInt(fromPageId)).map(p => (
                            <option key={p.id} value={p.id}>{p.id}: {p.content.substring(0, 30)}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Texte du choix :</label><br/>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Création..." : "Ajouter le choix"}
                </button>
            </form>
        </div>
    );
}
