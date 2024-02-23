const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const Review = require('../models/review');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// home page route
router.get('/', async (req, res) => {
  const makes = await Car.distinct('make');
  const username = req.session.userId ? (await User.findById(req.session.userId)).username : null;
  res.render('home', { makes, username });
});


router.get('page',(req,res) =>{
  res.render('page')
})


router.post('/reviews/:id/dislike', checkAuth, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.session.userId;

  try {
      const review = await Review.findById(reviewId);
      if (!review.dislikedBy.includes(userId)) {
          await Review.updateOne({ _id: reviewId }, {
            $inc: { dislikes: 1 },
            $push: { dislikedBy: userId } 
          });
      }
      res.redirect('back');
  } catch (error) {
      console.error("Error disliking the review:", error);
      res.status(500).send('Server error while disliking the review.');
  }
});




router.post('/reviews/:id/like', checkAuth, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.session.userId;

  try {
      const review = await Review.findById(reviewId);
      if (!review.likedBy.includes(userId)) {
          await Review.updateOne({ _id: reviewId }, {
            $inc: { likes: 1 },
            $push: { likedBy: userId }
          });
      }
      res.redirect('back');
  } catch (error) {
      console.error("Error liking the review:", error);
      res.status(500).send('Server error while liking the review.');
  }
});
router.post('/reviews/:id/delete', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Unauthorized: Only admins can delete reviews.');
  }

  try {
    await Review.findOneAndDelete({ _id: req.params.id });
    res.redirect('back');
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send('Server error during review deletion.');
  }
});




router.get('/reviews/:id', async (req, res) => {
  try {
      const carId = req.params.id;
      const car = await Car.findById(carId);
      if (!car) {
          return res.status(404).send('Car not found');
      }

      const sortOption = req.query.sort;
      let sortQuery = { date_posted: -1 };
      switch (sortOption) {
          case 'oldest':
              sortQuery = { date_posted: 1 };
              break;
          case 'mostLiked':
              sortQuery = { likes: -1 };
              break;
          case 'mostDisliked':
              sortQuery = { dislikes: -1 };
              break;
      }

      // fetch reviews with sorting method
      const reviews = await Review.find({ car_id: carId }).sort(sortQuery);

      const loggedIn = req.session.userId ? true : false; // check if user logged in
      let isAdmin = false;
      if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        isAdmin = user.admin =true;
      }
      // render page, passing the car, reviews, loggedIn status, and isAdmin status
      res.render('reviews', { car, reviews, loggedIn, isAdmin: req.session.isAdmin });

  } catch (error) {
      console.error("Error fetching reviews for car ID:", carId, "Error:", error);
      res.status(500).send('Server error');
  }
});


router.get('/models', async (req, res) => {
    const { make } = req.query;
    const cars = await Car.find({ make: make }).select('model _id'); // Assuming _id is the car ID
    res.json(cars); // Send the cars data with IDs
});


// route fetch years based on selected make and model
router.get('/years', async (req, res) => {
    const { make, model } = req.query;
    const years = await Car.find({ make: make, model: model }).distinct('year');
    res.json(years);
});



router.post('/submit-review', checkAuth, async (req, res) => {

  try {
      const { car_id, review_title, review_body, rating } = req.body;
      // fetch the user's username using session's userId
      const user = await User.findById(req.session.userId);
      if (!user) {
          return res.status(403).send('You must be logged in to submit a review.');
      }
      const author = user.username; // use the logged-in user's username as the author

      const newReview = new Review({
          car_id,
          review_title,
          review_body,
          rating,
          author
      });
      await newReview.save();
      res.redirect(`/reviews/${car_id}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error while submitting review');
  }
});

function checkAuth(req, res, next) {
    if (req.session.userId) {
      next();
    } else {
      res.send('You must be logged in to submit a review.');
    }
  }
  

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send('Email already in use');
        }

        user = new User({
            email,
            username,
            password // will be hashed in the pre-save middleware
        });

        await user.save(); // collection gets created if it doesnt exist
        // handle successful registration
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during registration');
    }
});

  // Logout route
  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('login'); // redirect to login page after logout
    });
  });


  router.get('/register', (req, res) => {
    res.render('register');
});
  // Login route
  router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      //this is boolean value from the database
      req.session.isAdmin = user.admin === true; 

      if (req.session.isAdmin) {
        console.log('Admin logged in:', username);
      }

      res.redirect('/');
    } else {
      res.status(401).send('Login failed');
    }
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).send('Server error during login');
  }
});

  
  module.exports = router;