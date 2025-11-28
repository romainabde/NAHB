import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../services/apiClient";

export default function StoryReader() {
    const { user } = useContext(AuthContext);
    const { id: storyId } = useParams(); // id de l'histoire
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(null);
    const [choices, setChoices] = useState([]);
    const [progressId, setProgressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lancer la partie au montage
    useEffect(() => {
        if (!user) return;

        const startStory = async () => {
            setLoading(true);
            setError("");
            try {
                // 1️⃣ récupérer la première page
                const resPage = await apiClient.get(
                    `http://localhost:4002/reader/stories/${storyId}/pages/first`
                );
                const page = resPage.data;
                setCurrentPage(page);

                // 2️⃣ créer StoryProgress
                const resProgress = await apiClient.post("http://localhost:4003/play", {
                    storyId: Number(storyId),
                    pageId: page.id
                });
                setProgressId(resProgress.data.id);

                // 3️⃣ récupérer les choix
                const resChoices = await apiClient.get(
                    `http://localhost:4002/reader/stories/pages/${page.id}/choices`
                );
                setChoices(resChoices.data);
            } catch (err) {
                const message = err.response?.data?.error || "Erreur lors du lancement de l'histoire.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        startStory();
    }, [storyId, user]);

    // Choisir un choix
    const chooseOption = async (toPageId) => {
        try {
            // mettre à jour le progress
            await apiClient.patch(`http://localhost:4003/play/${progressId}`, { pageId: toPageId });

            // récupérer la nouvelle page
            const resPage = await apiClient.get(`http://localhost:4002/reader/stories/pages/${toPageId}`);
            const page = resPage.data;
            setCurrentPage(page);

            // récupérer les choix associés
            const resChoices = await apiClient.get(`http://localhost:4002/reader/stories/pages/${toPageId}/choices`);
            setChoices(resChoices.data);
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors du choix de la page.";
            setError(message);
        }
    };

    if (!user) {
        return <p>Veuillez vous connecter pour jouer à cette histoire.</p>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <h2>Lecture de l'histoire</h2>
            {loading && <p>Chargement...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {currentPage && (
                <div style={{ marginTop: "30px", textAlign: "left" }}>
                    <p>{currentPage.content}</p>

                    {currentPage.isEnding ? (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <p>🎉 Fin de l'histoire !</p>
                            <button
                                onClick={() => navigate("/")}
                                style={{ padding: "8px 16px", cursor: "pointer" }}
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginTop: "20px" }}>
                            {choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    onClick={() => chooseOption(choice.toPageId)}
                                    style={{ marginRight: "10px", marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}