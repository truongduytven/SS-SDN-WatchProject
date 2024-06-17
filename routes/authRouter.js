const express = require('express');
const authController = require('../controllers/authController');
const memberController = require('../controllers/memberController');
const authRouter = express.Router()

authRouter.route('/login')
.get(authController.getLogin)
.post(authController.loginMember)

authRouter.route('/register')
.get(authController.getRegister)
.post(authController.registerMember)

authRouter.route('/logout')
.post(authController.logoutMember)

module.exports = authRouter