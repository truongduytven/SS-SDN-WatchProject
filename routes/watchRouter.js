var express = require('express');
const watchController = require('../controllers/watchController');
const authenticateToken = require('../controllers/middleWareController');
const passport = require('passport');
var watchRouter = express.Router()
const { ensureAuthenticated } = require('../config/auth')

watchRouter.route('/')
    .get(ensureAuthenticated, watchController.getAll)
    .post(watchController.addWatch)

watchRouter.route('/search')
    .get(watchController.search);

watchRouter.route('/filter')
    .get(watchController.filter);

watchRouter.route('/:id')
    .get(watchController.getDetail)
    .post(watchController.updateWatch)
    
watchRouter.route('/delete/:id')
    .post(watchController.deleteWatch)

watchRouter.route('/comment/:id')
    .post(watchController.addComment)
    
module.exports = watchRouter;