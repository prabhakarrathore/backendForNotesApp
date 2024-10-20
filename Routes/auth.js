const express = require("express");
const routes = express.Router();
const authController = require("../controller/authController");

routes.post('/', authController.handleLogin);

module.exports = routes;