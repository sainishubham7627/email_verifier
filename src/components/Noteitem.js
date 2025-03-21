import React, { useEffect, useState } from "react";

const NoteItem = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/notes/fetchallnotes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token") // Using token to authenticate
            }
        })
        .then(response => response.json())
        .then(data => setNotes(data))
        .catch(error => {
            console.error("Error fetching notes:", error);
        });
    }, []);

    return (
        <div>
            <h2>Your Notes</h2>
            <ul>
                {notes.map((note) => (
                    <li key={note._id}>
                        <h3>{note.title}</h3>
                        <p>{note.description}</p>
                        <p>{note.tag}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoteItem;
