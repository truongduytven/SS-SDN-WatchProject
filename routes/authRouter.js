const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router()

authRouter.route('/login')
.get(authController.getLogin)
.post(authController.loginMember)

authRouter.route('/register')
.get(authController.getRegister)
.post(authController.registerMember)

authRouter.route('/logout')
.get(authController.logoutMember)

module.exports = authRouter