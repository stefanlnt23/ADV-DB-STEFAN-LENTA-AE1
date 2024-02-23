const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    car_id: { type: String, required: true },
    review_title: { type: String, required: true },
    review_body: { type: String, required: true },
    rating: { type: Number, required: true },
    author: { type: String, required: true },
    date_posted: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { collection: 'car_reviews' });
module.exports = mongoose.model('Review', reviewSchema);
