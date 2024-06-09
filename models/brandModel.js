const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({ brandName: String }, { timestamps: true, });

const brandModel = mongoose.model('brandModel', brandSchema);
module.exports = brandModel;