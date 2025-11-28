import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import "./Style/AdminDashboard.css";

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
            setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
            alert(`Utilisateur ${updatedUser.username} a été banni.`);
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
            setStories(prev => prev.map(s => (s.id === updatedStory.id ? updatedStory : s)));
            alert(`Histoire "${updatedStory.title}" suspendue.`);
        } catch (err) {
            alert(err.response?.data?.error || "Erreur lors de la suspension de l'histoire.");
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>
            <button className="admin-btn" onClick={() => navigate("/")}>Retour à l'accueil</button>

            <section className="admin-section">
                <h2>Statistiques</h2>
                {loadingPlays && <p>Chargement...</p>}
                {errorPlays && <p className="admin-error">{errorPlays}</p>}
                {!loadingPlays && !errorPlays && <p>Total de parties jouées : <strong>{plays.length}</strong></p>}
            </section>

            <section className="admin-section">
                <h2>Gérer les utilisateurs (Bannir)</h2>
                {loadingUsers && <p>Chargement...</p>}
                {errorUsers && <p className="admin-error">{errorUsers}</p>}
                {!loadingUsers && !errorUsers && (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Rôles</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.roles.join(", ")}</td>
                                <td>
                                    {u.roles.includes("AUTHOR") && (
                                        <button className="admin-btn-danger" onClick={() => banUser(u.id)}>✖</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="admin-section">
                <h2>Suspendre des histoires</h2>
                {loadingStories && <p>Chargement...</p>}
                {errorStories && <p className="admin-error">{errorStories}</p>}
                {!loadingStories && !errorStories && (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stories.map(s => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.title}</td>
                                <td>{s.status}</td>
                                <td>
                                    {s.status !== "SUSPENDED" && (
                                        <button className="admin-btn-warning" onClick={() => suspendStory(s.id)}>Suspendre</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}