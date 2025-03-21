import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"; // ✅ Changed port to 5000
  const [notes, setNotes] = useState([]);

  // ✅ Fetch All Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");

      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
    }
  };

  // ✅ Add a Note with Reminder
  const addNote = async (title, description, tag, file, sendAt) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tag", tag);
      if (file) formData.append("file", file); // Attach file if available
      if (sendAt) formData.append("sendAt", new Date(sendAt).toISOString()); // ✅ Convert to ISO format

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add note");

      const note = await response.json();
      setNotes((prevNotes) => [...prevNotes, note]);
    } catch (error) {
      console.error("❌ Error adding note:", error);
    }
  };

  // ✅ Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("❌ Error deleting note:", error);
    }
  };

  // ✅ Edit a Note (Including Reminder)
  const editNote = async (id, title, description, tag, sendAt) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, tag, sendAt }),
      });

      if (!response.ok) throw new Error("Failed to update note");

      const json = await response.json();

      const updatedNotes = notes.map((note) =>
        note._id === id ? { ...note, title, description, tag, sendAt } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("❌ Error updating note:", error);
    }
  };

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
