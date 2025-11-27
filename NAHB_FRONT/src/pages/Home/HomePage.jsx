import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Récupération du user depuis localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Erreur parsing user localStorage:", err);
            setUser(null);
        }
    }, []);

    // 🔹 Vérifie que user existe ET roles existe
    const isAuthor = user && Array.isArray(user.roles) && user.roles.includes("AUTHOR");

    // ⚠️ Si le user n'est pas encore chargé, on peut afficher un loader ou rien
    if (!user) return <div>Chargement...</div>;

    return (
        <div>
            <h1>Bienvenue sur NAHB</h1>

            {isAuthor && (
                <button onClick={() => navigate("/author/create-story")}>
                    Créer une histoire
                </button>
            )}
        </div>
    );
};

export default HomePage;
