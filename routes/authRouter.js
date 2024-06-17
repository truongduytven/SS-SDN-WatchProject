const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router()

authRouter.route('/login')
.get(authController.getLogin)

authRouter.route('/register')
.get(authController.getRegister)

module.exports = authRouter