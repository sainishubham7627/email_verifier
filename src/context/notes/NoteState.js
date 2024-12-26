import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });

      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.statusText}`);
      }

      const note = await response.json();
      setNotes([...notes, note]); // Add the new note to the existing array of notes
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }

      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.statusText}`);
      }

      let newNotes = [...notes];

      // Logic to edit the note in the client-side state
      for (let index = 0; index < newNotes.length; index++) {
        if (newNotes[index]._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }

      setNotes(newNotes);
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
