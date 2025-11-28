import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../services/apiClient";
import "./Style/StoryReader.css";

export default function StoryReader() {
    const { user } = useContext(AuthContext);
    const { id: storyId } = useParams();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(null);
    const [choices, setChoices] = useState([]);
    const [progressId, setProgressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        const startStory = async () => {
            setLoading(true);
            setError("");
            try {
                const resPage = await apiClient.get(
                    `http://localhost:4002/reader/stories/${storyId}/pages/first`
                );
                const page = resPage.data;
                setCurrentPage(page);

                const resProgress = await apiClient.post("http://localhost:4003/play", {
                    storyId: Number(storyId),
                    pageId: page.id
                });
                setProgressId(resProgress.data.id);

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

    const chooseOption = async (toPageId) => {
        try {
            await apiClient.patch(`http://localhost:4003/play/${progressId}`, { pageId: toPageId });

            const resPage = await apiClient.get(`http://localhost:4002/reader/stories/pages/${toPageId}`);
            const page = resPage.data;
            setCurrentPage(page);

            // 👉 SI C'EST UNE PAGE DE FIN → enregistrer automatiquement
            if (page.isEnding) {
                try {
                    await apiClient.post("http://localhost:4003/play/end", {
                        storyId: Number(storyId),
                        pageId: page.id
                    });
                    console.log("Fin de partie enregistrée !");
                } catch (err) {
                    console.error("Erreur lors de l'enregistrement de la fin :", err);
                }
            }

            const resChoices = await apiClient.get(
                `http://localhost:4002/reader/stories/pages/${toPageId}/choices`
            );
            setChoices(resChoices.data);
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors du choix de la page.";
            setError(message);
        }
    };

    if (!user) {
        return <p className="sr-error-text">Veuillez vous connecter pour jouer à cette histoire.</p>;
    }

    return (
        <div className="sr-container">
            <h2 className="sr-title">Lecture de l'histoire</h2>
            {loading && <p className="sr-loading">Chargement...</p>}
            {error && <p className="sr-error-text">{error}</p>}

            {currentPage && (
                <div className="sr-page">
                    <p className="sr-content">{currentPage.content}</p>

                    {currentPage.isEnding ? (
                        <div className="sr-ending">
                            <p>🎉 Fin de l'histoire !</p>
                            <button className="sr-back-btn" onClick={() => navigate("/")}>
                                Retour à l'accueil
                            </button>
                        </div>
                    ) : (
                        <div className="sr-choices">
                            {choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    className="sr-choice-btn"
                                    onClick={() => chooseOption(choice.toPageId)}
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