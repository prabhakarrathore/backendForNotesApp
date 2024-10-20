const express = require('express');
const router = express.Router();
const LogoutController = require('../controller/LogoutController');

router.get('/', LogoutController.handleLogout);

module.exports = router;