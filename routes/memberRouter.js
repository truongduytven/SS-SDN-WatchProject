const express = require('express');
const memberController = require('../controllers/memberController');
const checkAdmin = require('../controllers/middleWareController')
const authenticateToken = require('../controllers/middleWareController');
const memberRouter = express.Router()

memberRouter.get('/', memberController.getHome);
memberRouter.get('/profile', memberController.getMemberInfo);
memberRouter.post('/profile', memberController.editMemberInfo);
memberRouter.get('/accounts', memberController.getAccount)

module.exports = memberRouter