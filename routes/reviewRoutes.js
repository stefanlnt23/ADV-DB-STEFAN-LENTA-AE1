const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const Review = require('../models/review');

// fetch and submit reviews
router.get('/reviews/:id', async (req, res) => {
    try {
        const carId = req.params.id;
        const car = await Car.findById(carId);
        const reviews = await Review.find({ car_id: carId }).sort({ date_posted: -1 });
        const username = req.session.userId ? (await User.findById(req.session.userId)).username : null;

        if (!car) {
            return res.status(404).send('Car not found');
        }

        res.render('reviews', { car, reviews, loggedIn: !!req.session.userId, username });
    } catch (error) {
        console.error("Fetching reviews for car ID:", carId, "Error:", error);
        res.status(500).send('Server error');
    }
});


// route to handle likes
router.post('/reviews/:id/like', async (req, res) => {
    try {
        await Review.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } });
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// route to handle dislikes
router.post('/reviews/:id/dislike', async (req, res) => {
    try {
        await Review.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 } });
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});


module.exports = router;


