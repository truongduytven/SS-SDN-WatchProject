const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({ 
    brandName: String
}, { timestamps: true });

const commentSchema = new Schema({ 
    rating: { type: Number, min: 1, max: 3, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true }
}, { timestamps: true });

const watchSchema = new Schema({
    watchName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    Automatic: { type: Boolean, default: false },
    watchDescription: { type: String, required: true },
    comments: [commentSchema],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }
}, { timestamps: true });

const memberSchema = new Schema({ 
    membername: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    name: {type: String, required: true},
    yob: { type: Number, required: true },
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Watch = mongoose.model('Watch', watchSchema);
const Member = mongoose.model('Member', memberSchema);

module.exports = { Brand, Comment, Watch, Member };
