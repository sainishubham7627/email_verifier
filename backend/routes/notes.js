const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all notes of the logged-in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }); // Fetch only the logged-in user's notes
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Add a new note
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { title, description, tag } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Update an existing note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Build updated note object
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Check note ownership
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Note not found");
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        // Update note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Check note ownership
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Note not found");
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        // Delete note
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
