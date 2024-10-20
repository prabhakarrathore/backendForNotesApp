const express = require("express");
const routes = express.Router();
const userController = require("../../controller/userController");

routes.route("/:id")
    .get(userController.getUser)
    .delete(userController.deleteUser);

module.exports = routes;