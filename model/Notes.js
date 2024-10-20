const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    note: {
        type: String
    },
    fav: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Note', NoteSchema);