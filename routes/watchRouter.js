var express = require('express');
const watchController = require('../controllers/watchController');
var watchRouter = express.Router()

watchRouter.route('/')
    .get(watchController.getAll)

watchRouter.route('/search')
    .get(watchController.search);

watchRouter.route('/filter')
    .get(watchController.filter);

watchRouter.route('/:id')
    .get(watchController.getDetail)

module.exports = watchRouter;