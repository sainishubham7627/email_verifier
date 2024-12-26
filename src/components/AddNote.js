import React, { useContext, useState } from 'react';
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
    const { addNote } = useContext(noteContext);
    const [note, setNote] = useState({ title: "", description: "", tag: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "" }); // Clear the form
        props.showAlert(" Added succesfully","success")

    };

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div className="container my-3">    
            <h2>Add a Note</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={note.title}
                        onChange={handleChange}
                        required
                        minLength={3}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={note.description}
                        onChange={handleChange}
                        required
                        minLength={5}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input
                        type="text"
                        className="form-control"
                        id="tag"
                        name="tag"
                        value={note.tag}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Note
                </button>
            </form>
        </div>
    );
};

export default AddNote;
