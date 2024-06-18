const express = require('express');
const brandController = require('../controllers/brandController');
const { ensureAuthenticated, checkAdmin } = require('../config/auth');
const brandRouter = express.Router()

brandRouter.route('/')
.get(ensureAuthenticated, checkAdmin, brandController.getAllBrand)
.post(ensureAuthenticated, checkAdmin, brandController.addNewBrand)

brandRouter.route('/update/:id')
.post(ensureAuthenticated, checkAdmin, brandController.updateBrand)

brandRouter.route('/delete/:id')
.post(ensureAuthenticated, checkAdmin, brandController.deleteBrand)

module.exports = brandRouter