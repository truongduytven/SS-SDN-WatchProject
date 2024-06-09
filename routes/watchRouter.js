var express = require('express');
const watchController = require('../controllers/watchController');
var watchRouter = express.Router()

watchRouter.route('/')
.get(watchController.getAll)

watchRouter.route('/:id')
.get(watchController.getDetail)

module.exports = watchRouter;