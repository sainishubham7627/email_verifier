const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation time
    }
});

module.exports = mongoose.model('note', NoteSchema);
