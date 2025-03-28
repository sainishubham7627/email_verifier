const express = require("express");
const multer = require("multer");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const path = require("path");

// 📂 Ensure "uploads" folder exists
const fs = require("fs");


// ✅ Serve uploaded files statically

// ✅ ROUTE 1: Fetch All Notes (GET "/api/notes/fetchallnotes") - Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error("❌ Error fetching notes:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// 📂 Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  const upload = multer({ storage });
// Set file size limit and file filter

// ✅ ROUTE 2: Add a New Note with File Upload (POST "/api/notes/addnote") - Login required
router.post(
    "/addnote",
    fetchuser,
    upload.single("file"),
    [
        body("title", "Title must be at least 3 characters").isLength({ min: 3 }),
        body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        try {
            const { title, description, tag, sendAt, email } = req.body;

            // 🛑 Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // ✅ Create and Save Note
            const note = new Note({
                title,
                description,
                tag,
                user: req.user.id,
                 file: req.file ? req.file.path : null,
                sendAt: sendAt ? new Date(sendAt) : null,
                email: sendAt ? email : null,
            });

            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error("❌ Error adding note:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ✅ ROUTE 3: Update an Existing Note (PUT "/api/notes/updatenote/:id") - Login required
router.put("/updatenote/:id", fetchuser, upload.single("file"), async (req, res) => {
    const { title, description, tag, sendAt, email } = req.body;
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Note Not Found");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

       

        // ✅ Update note fields
        note.title = title || note.title;
        note.description = description || note.description;
        note.tag = tag || note.tag;
        note.sendAt = sendAt ? new Date(sendAt) : note.sendAt;
        note.email = email || note.email;
        if (req.file) note.file = `/uploads/${req.file.filename}`;

        await note.save();
        res.json({ note });
    } catch (error) {
        console.error("❌ Error updating note:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ ROUTE 4: Delete a Note (DELETE "/api/notes/deletenote/:id") - Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Note Not Found");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // 🗑️ Delete file (if any)
        if (note.file) {
            const filePath = path.join(__dirname, '../..', note.file);
            console.log(filePath)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);  // Delete the file from the server
            }
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ Success: "Note has been deleted", note });
    } catch (error) {
        console.error("❌ Error deleting note:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
