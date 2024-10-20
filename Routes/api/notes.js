const express = require("express");
const routes = express.Router();
const notesController = require("../../controller/notesController");

routes.route("/:userid")
    .post(notesController.createNewNote)
    .put(notesController.updateNote)
    .get(notesController.getAllNotes)

routes.route('/:userid/:id')
    .delete(notesController.deleteNote)
    .patch(notesController.favoriteNote)

module.exports = routes;    