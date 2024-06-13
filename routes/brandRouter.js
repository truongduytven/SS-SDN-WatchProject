const express = require('express');
const brandController = require('../controllers/brandController')
const brandRouter = express.Router()

brandRouter.route('/')
.get(brandController.getAllBrand)
.post(brandController.addNewBrand)

brandRouter.route('/update/:id')
.post(brandController.updateBrand)

brandRouter.route('/delete/:id')
.post(brandController.deleteBrand)

module.exports = brandRouter