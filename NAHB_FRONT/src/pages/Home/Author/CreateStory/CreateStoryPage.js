import React, { useState } from "react";

const CreateStory = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [storyId, setStoryId] = useState(null);
    const [pages, setPages] = useState([]);
    const [newPageContent, setNewPageContent] = useState("");
    const [newPageIsEnding, setNewPageIsEnding] = useState(false);

    const token = localStorage.getItem("token");

    // 1️⃣ Créer l'histoire
    const handleCreateStory = async () => {
        try {
            const res = await fetch("http://localhost:4002/author/stories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, tags: tags || null })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Erreur lors de la création de l'histoire");
                return;
            }
            setStoryId(data.id);
            alert("Histoire créée ! Maintenant ajoute des pages.");
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    // 2️⃣ Créer une page
    const handleAddPage = async () => {
        if (!storyId) return alert("Crée d'abord l'histoire");
        try {
            const res = await fetch(`http://localhost:4002/author/stories/${storyId}/pages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: newPageContent, isEnding: newPageIsEnding })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Erreur lors de la création de la page");
                return;
            }
            setPages([...pages, data]); // stocker la page créée avec son id
            setNewPageContent("");
            setNewPageIsEnding(false);
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    // 3️⃣ Créer un choix
    const handleAddChoice = async (fromPageId, toPageId, text) => {
        try {
            const res = await fetch(`http://localhost:4002/author/stories/pages/${fromPageId}/choices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ toPageId, text })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Erreur lors de la création du choix");
            } else {
                alert("Choix créé !");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    return (
        <div>
            <h2>Créer une histoire</h2>

            {/* Création de l'histoire */}
            <input type="text" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="text" placeholder="Tags (optionnel)" value={tags} onChange={e => setTags(e.target.value)} />
            <button onClick={handleCreateStory}>Créer l'histoire</button>

            {storyId && (
                <>
                    <h3>Ajouter une page</h3>
                    <textarea placeholder="Contenu de la page" value={newPageContent} onChange={e => setNewPageContent(e.target.value)} />
                    <label>
                        <input type="checkbox" checked={newPageIsEnding} onChange={e => setNewPageIsEnding(e.target.checked)} />
                        Page finale
                    </label>
                    <button onClick={handleAddPage}>Ajouter la page</button>

                    <h3>Pages créées</h3>
                    {pages.map((page) => (
                        <div key={page.id} style={{ border: "1px solid #ccc", padding: "5px", margin: "5px 0" }}>
                            <p>{page.content} {page.isEnding && "(fin)"}</p>

                            {/* Ajouter un choix depuis cette page */}
                            <h4>Ajouter un choix</h4>
                            {pages.length > 1 && !page.isEnding && (
                                <ChoiceForm fromPage={page} pages={pages.filter(p => p.id !== page.id)} onAddChoice={handleAddChoice} />
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

// Composant pour créer un choix depuis une page
const ChoiceForm = ({ fromPage, pages, onAddChoice }) => {
    const [selectedToPage, setSelectedToPage] = useState(pages[0]?.id || null);
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text || !selectedToPage) return alert("Texte et page cible requis");
        onAddChoice(fromPage.id, selectedToPage, text);
        setText("");
    };

    return (
        <div>
            <input placeholder="Texte du choix" value={text} onChange={e => setText(e.target.value)} />
            <select value={selectedToPage} onChange={e => setSelectedToPage(Number(e.target.value))}>
                {pages.map(p => (
                    <option key={p.id} value={p.id}>{p.content.slice(0, 30)}</option>
                ))}
            </select>
            <button type="button" onClick={handleSubmit}>Ajouter le choix</button>
        </div>

    );
};

export default CreateStory;