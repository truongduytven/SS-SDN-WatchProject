const mongoose = require('mongoose');
const commentSchema = require('./commentModel');
const Schema = mongoose.Schema;

const watcheschema = new Schema({
    watchName: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    Automatic: { type: Boolean, default: false },
    watchDescription: { type: String, require: true },
    comments: [commentSchema],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brands", require: true },
}, { timestamps: true, });

const watchModel = mongoose.model('watchModel', watcheschema);
module.exports = watchModel;
