import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Vérifie que user existe et que roles inclut AUTHOR
    const isAuthor = user?.roles?.includes("AUTHOR");

    return (
        <div>
            <h1>Bienvenue sur NAHB</h1>

            {isAuthor && (
                <button onClick={() => navigate("/create-story")}>
                    Créer une histoire
                </button>
            )}
        </div>
    );
};

export default HomePage;
