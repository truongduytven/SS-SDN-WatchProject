const express = require('express');
const memberController = require('../controllers/memberController');
const checkAdmin = require('../controllers/middleWareController')
const authenticateToken = require('../controllers/middleWareController');
const memberRouter = express.Router()

memberRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Watch project', errors: [] });
});
memberRouter.post('/register', memberController.registerMember)
memberRouter.post('/login', memberController.loginMember)
memberRouter.get('/logout', memberController.logoutMember)
memberRouter.get('/profile', memberController.getMemberInfo);
memberRouter.post('/profile', memberController.editMemberInfo);
memberRouter.get('/accounts', memberController.getAccount)

module.exports = memberRouter