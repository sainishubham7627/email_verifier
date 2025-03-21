const express = require("express");
const multer = require("multer");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// 📂 Ensure "uploads" folder exists
const uploadDir = "uploads";
const fs = require("fs");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 📂 Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Set file size limit and file filter
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mkv", "application/pdf"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images, videos, and PDFs are allowed."), false);
        }
    },
});

// ✅ Serve uploaded files statically
router.use("/uploads", express.static(uploadDir));

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
                file: req.file ? `/uploads/${req.file.filename}` : null,
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

        // 🗑️ Delete old file if a new one is uploaded
        if (req.file && note.file) {
            const oldFilePath = note.file.replace("/uploads/", "uploads/");
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
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
            const filePath = note.file.replace("/uploads/", "uploads/");
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
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
