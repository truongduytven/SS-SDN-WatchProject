const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: { type: Number, min: 1, max: 3, require: true },
    content: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Members", require: true }
}, { timestamps: true });

const commentModel = mongoose.model('commentModel', commentSchema);
module.exports = commentModel