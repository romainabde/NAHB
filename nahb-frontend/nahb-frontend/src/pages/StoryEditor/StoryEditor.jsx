import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
    
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
            const res = await apiClient.post(
                "http://localhost:4002/author/stories",
                {
                    title,
                    description,
                    tags: tags || undefined
                }
            );

            setSuccessMsg(`Histoire créée ! ID = ${res.data.id}`);
            setTitle("");
            setDescription("");
            setTags("");

            // Redirection vers la création de la première page
            navigate(`/author/story/${res.data.id}/pages/new`);

        } catch (err) {
            console.error(err);
            const message = err.response?.data?.error || "Erreur lors de la création de l'histoire.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto" }}>
            <h2>Créer une nouvelle histoire</h2>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "15px" }}>
                    <label>Titre :</label><br/>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Description :</label><br/>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", minHeight: "80px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Tags (optionnel) :</label><br/>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                >
                    {loading ? "Création..." : "Créer l'histoire"}
                </button>
            </form>
        </div>
    );
}