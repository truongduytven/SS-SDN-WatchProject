const express = require('express');
const memberController = require('../controllers/memberController');
const authenticateToken = require('../controllers/middleWareController');
const { ensureAuthenticated, checkAdmin } = require('../config/auth');
const memberRouter = express.Router()

memberRouter.get('/', memberController.getHome);
memberRouter.get('/profile', ensureAuthenticated, memberController.getMemberInfo);
memberRouter.post('/profile/:id', ensureAuthenticated, memberController.editMemberInfo);
memberRouter.get('/accounts', ensureAuthenticated, checkAdmin, memberController.getAccount)

module.exports = memberRouter