const express = require('express');
const memberController = require('../controllers/memberController')
const memberRouter = express.Router()

memberRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Watch project', errors: [] });
});
memberRouter.post('/register', memberController.registerMember)
memberRouter.post('/login', memberController.loginMember)
memberRouter.get('/logout', memberController.logoutMember)
memberRouter.get('/profile', memberController.getMemberInfo);
memberRouter.post('/profile', memberController.editMemberInfo);

module.exports = memberRouter