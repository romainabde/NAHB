import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [plays, setPlays] = useState([]);
    const [users, setUsers] = useState([]);
    const [stories, setStories] = useState([]);
    const [loadingPlays, setLoadingPlays] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingStories, setLoadingStories] = useState(true);
    const [errorPlays, setErrorPlays] = useState("");
    const [errorUsers, setErrorUsers] = useState("");
    const [errorStories, setErrorStories] = useState("");

    // --- STATS ---
    useEffect(() => {
        const fetchPlays = async () => {
            setLoadingPlays(true);
            setErrorPlays("");
            try {
                const res = await apiClient.get("http://localhost:4003/play/");
                setPlays(res.data);
            } catch (err) {
                setErrorPlays(err.response?.data?.error || "Erreur lors de la récupération des parties.");
            } finally {
                setLoadingPlays(false);
            }
        };
        fetchPlays();
    }, []);

    // --- USERS ---
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            setErrorUsers("");
            try {
                const res = await apiClient.get("http://localhost:4001/user");
                setUsers(res.data);
            } catch (err) {
                setErrorUsers(err.response?.data?.error || "Erreur lors de la récupération des utilisateurs.");
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // --- STORIES ---
    useEffect(() => {
        const fetchStories = async () => {
            setLoadingStories(true);
            setErrorStories("");
            try {
                const res = await apiClient.get("http://localhost:4002/reader/stories/all");
                setStories(res.data);
            } catch (err) {
                setErrorStories(err.response?.data?.error || "Erreur lors de la récupération des histoires.");
            } finally {
                setLoadingStories(false);
            }
        };
        fetchStories();
    }, []);

    const banUser = async (userId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir bannir cet auteur ?")) return;

        try {
            const res = await apiClient.patch(`http://localhost:4001/user/${userId}/ban`);
            const updatedUser = res.data;
            setUsers((prev) =>
                prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
            );
            alert(`Utilisateur ${updatedUser.username} a été banni (rôle auteur supprimé).`);
        } catch (err) {
            alert(err.response?.data?.error || "Erreur lors du bannissement.");
        }
    };

    const suspendStory = async (storyId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir suspendre cette histoire ?")) return;

        try {
            const res = await apiClient.patch(`http://localhost:4002/author/stories/${storyId}`, {
                status: "SUSPENDED"
            });
            const updatedStory = res.data;
            setStories((prev) =>
                prev.map(s => (s.id === updatedStory.id ? updatedStory : s))
            );
            alert(`Histoire "${updatedStory.title}" suspendue.`);
        } catch (err) {
            alert(err.response?.data?.error || "Erreur lors de la suspension de l'histoire.");
        }
    };

    return (
        <div style={{ maxWidth: "900px", margin: "50px auto", textAlign: "center" }}>
            <h1>Admin Dashboard</h1>

            <button
                onClick={() => navigate("/")}
                style={{
                    padding: "8px 16px",
                    marginTop: "10px",
                    fontSize: "14px",
                    cursor: "pointer",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px"
                }}
            >
                Retour à l'accueil
            </button>

            {/* --- STATS --- */}
            <div style={{ marginTop: "30px", textAlign: "left" }}>
                <h2>Statistiques</h2>
                {loadingPlays && <p>Chargement...</p>}
                {errorPlays && <p style={{ color: "red" }}>{errorPlays}</p>}
                {!loadingPlays && !errorPlays && (
                    <p>Total de parties jouées : <strong>{plays.length}</strong></p>
                )}
            </div>

            {/* --- USERS --- */}
            <div style={{ marginTop: "50px", textAlign: "left" }}>
                <h2>Gérer les utilisateurs (Bannir)</h2>
                {loadingUsers && <p>Chargement...</p>}
                {errorUsers && <p style={{ color: "red" }}>{errorUsers}</p>}
                {!loadingUsers && !errorUsers && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ borderBottom: "2px solid #000" }}>
                            <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
                            <th style={{ textAlign: "left", padding: "8px" }}>Username</th>
                            <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
                            <th style={{ textAlign: "left", padding: "8px" }}>Rôles</th>
                            <th style={{ padding: "8px" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: "1px solid #ccc" }}>
                                <td style={{ padding: "8px" }}>{u.id}</td>
                                <td style={{ padding: "8px" }}>{u.username}</td>
                                <td style={{ padding: "8px" }}>{u.email}</td>
                                <td style={{ padding: "8px" }}>{u.roles.join(", ")}</td>
                                <td style={{ textAlign: "center", padding: "8px" }}>
                                    {u.roles.includes("AUTHOR") && (
                                        <button
                                            onClick={() => banUser(u.id)}
                                            style={{
                                                color: "white",
                                                backgroundColor: "#f44336",
                                                border: "none",
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            ✖
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- SUSPENDRE HISTOIRES --- */}
            <div style={{ marginTop: "50px", textAlign: "left" }}>
                <h2>Suspendre des histoires</h2>
                {loadingStories && <p>Chargement...</p>}
                {errorStories && <p style={{ color: "red" }}>{errorStories}</p>}
                {!loadingStories && !errorStories && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ borderBottom: "2px solid #000" }}>
                            <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
                            <th style={{ textAlign: "left", padding: "8px" }}>Titre</th>
                            <th style={{ textAlign: "left", padding: "8px" }}>Statut</th>
                            <th style={{ padding: "8px" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stories.map(s => (
                            <tr key={s.id} style={{ borderBottom: "1px solid #ccc" }}>
                                <td style={{ padding: "8px" }}>{s.id}</td>
                                <td style={{ padding: "8px" }}>{s.title}</td>
                                <td style={{ padding: "8px" }}>{s.status}</td>
                                <td style={{ textAlign: "center", padding: "8px" }}>
                                    {s.status !== "SUSPENDED" && (
                                        <button
                                            onClick={() => suspendStory(s.id)}
                                            style={{
                                                color: "white",
                                                backgroundColor: "#ff9800",
                                                border: "none",
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            Suspendre
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}