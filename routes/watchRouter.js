var express = require('express');
const watchController = require('../controllers/watchController');
var watchRouter = express.Router()
const { ensureAuthenticated, checkAdmin } = require('../config/auth')

watchRouter.route('/')
    .get(ensureAuthenticated, watchController.getAll)
    .post(ensureAuthenticated, checkAdmin, watchController.addWatch)

watchRouter.route('/search')
    .get(ensureAuthenticated, watchController.search);

watchRouter.route('/filter')
    .get(ensureAuthenticated, watchController.filter);

watchRouter.route('/:id')
    .get(ensureAuthenticated, watchController.getDetail)
    .post(ensureAuthenticated, checkAdmin, watchController.updateWatch)
    
watchRouter.route('/delete/:id')
    .post(ensureAuthenticated, checkAdmin, watchController.deleteWatch)

watchRouter.route('/comment/:id')
    .post(ensureAuthenticated, watchController.addComment)
    
module.exports = watchRouter;