const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    product_id: Number,
    user_id: Number,
    username: String,
    rating: Number,
    comment: String
}, { timestamps: true }); // mongoDB จะสร้าง >> createdAt, updatedAt 

module.exports = mongoose.model("Review", reviewSchema);
