import React, { useEffect, useState } from "react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token"); // le token admin

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        alert("Token manquant, veuillez vous reconnecter !");
        return;
      }

      try {
        const response = await fetch("http://localhost:4001/user/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text(); // lire le contenu brut si erreur
          console.error("Erreur backend:", text);
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json(); // parse seulement si ok
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer la liste des utilisateurs");
      }
    };

    fetchUsers();
  }, [token]);

  const handleBan = async (id) => {
    if (!window.confirm("Voulez-vous vraiment bannir cet utilisateur ?")) return;

    try {
      const response = await fetch(`http://localhost:4001/user/${id}/ban`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Erreur ban:", text);
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      alert("Utilisateur banni !");
      setUsers(users.filter(user => user.id !== id)); // retire l'utilisateur de la liste
    } catch (err) {
      console.error(err);
      alert("Impossible de bannir cet utilisateur");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des utilisateurs</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pseudo</th>
            <th>Email</th>
            <th>Rôles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>
                <button onClick={() => handleBan(user.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
