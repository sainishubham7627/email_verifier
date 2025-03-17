const express = require('express');
const multer = require("multer");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const path = require("path");
const { body, validationResult } = require('express-validator');
const fs = require('fs');

// ROUTE 1: Get ALL the Notes using: GET "/api/notes/fetchallnotes" Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        console.log(notes)
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error");
    }
})

// ROUTE 2: Add a new Notes using: POST "/api/notes/addnote" Login required


// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  const upload = multer({ storage });

// File Filter (optional: restrict file types)



router.post('/addnote', fetchuser, upload.single("file"),[
body('title','Enter a valid title').isLength({min: 3}),
body('description','description must be atleast 5 characters').isLength({min: 5}),], async (req,res)=>{
    try {
        const {title, description, tag} = req.body;
        //if there are error, return bed request and the error
        const errors =  validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const note = new Note({
            title,description,tag,user: req.user.id, file: req.file ? req.file.path : null
        })
        // console.log("req.file = ", req.body);
        const savedNote = await note.save()
        res.json(savedNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error");
    }
})

// ROUTE 3: update an existing Notes using: POST "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req,res)=>{
    const {title, description, tag} = req.body;
    try {
         // Creat a newNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // find the note to be updated
        let note = await Note.findById(req.params.id);
        if(!note){ return req.status(404).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note}); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error");
    }
    })

    // ROUTE 4: delete an existing Notes using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req,res)=>{
    const {title, description, tag} = req.body;
    try {
        // find the note to be updated and delete it
        let note = await Note.findById(req.params.id);
        if(!note){ return res.status(404).send("Not Found")}
        
        //Allow deletion only if user owns it
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        if (note.file) {
            const filePath = path.join(__dirname, '../..', note.file);
            console.log(filePath)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);  // Delete the file from the server
            }
        }
        
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "note has been deleted", note: note}); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error");
    }

})

module.exports = router