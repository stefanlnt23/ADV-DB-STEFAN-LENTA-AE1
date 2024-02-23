# Advanced Database Systems Project

### Module Information
- **Module Leader:** Dhouha Kbaier
- **Level:** 5
- **Assessment Title:** Project with Report
- **Issue Date:** January 2024
- **Hand In Date:** 5th April 2024 before 4pm (UK local time)
- **Student:** Stefan Lenta
- **Student ID:** 10174078
- **Application Link:** [Link to Web-App](https://adb-db-stefan-lenta-936fbd902e10.herokuapp.com)

## Introduction

In todays digital landscape, the automotive sector utilises the power of online platforms, transforming the way people share and discover insights about vehicles. This evolution created a big demand for an advanced, intuitive platform that is dedicated to facilitating comprehensive car reviews. 

As a student deeply interested in the both technology and automobiles, I found  this gap and decited to take advantage of an existing car database (car_database) and create a application designed to enrich the car buying experience through detailed reviews and user engagement.

At the core of the project we have car_database which haas three designed collections: car_reviews, car, and users. Each collection has different purposes, such as ensuring the platform can store and manage a wide range of data, from detailed car reviews to user profiles. The car_reviews collection, for example, not only stores user-generated content about different cars but also establishes a dynamic relationship between reviews and cars, as well as between reviews and users

## Technologies Used

- **Node.js:**  JavaScript runtime environment that executes JavaScript code outside a web browser.
- **Express:** A web app framework for Node.js, designed for building web applications and APIs.
- **MongoDB:** A NoSQL database used for storing application data.
- **Bcrypt:** Secure password hashing algorithm.
- **Express-session:** Express middleware for managing sessions.
- **Body-parser:** Express middleware for parsing request bodies.
- **Bootstrap 4:** Make interface modern and friendly
- **MongoDB / MongoDB Atlas:** Depending on running environment Local/Production

##

# How to for Local Development

## Requirements:
- [Node.js](https://nodejs.org/) installed
- MongoDB installed locally or a MongoDB Atlas account for the database

## Step 1: Clone the Project Repository
```bash
git clone <repository-url>
cd <project-directory>
```
### Step 2: Install Dependencies:
```bash
npm install

```
### Step 2: Install Dependencies:
```cmd
npm install
```
### Step 3: Configure MongoDB Connection

For local development use MongoDB compass. Make sure MongoDB is running.

Alternatively,for production use MongoDB Atlas, just replace the connection string in app.js with your Atlas connection string.

### For local MongoDB:
```js
mongoose.connect('mongodb://localhost:27017/car_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```
### For MongoDB Atlas:
```js
mongoose.connect('your_atlas_connection_string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### Step 5: Running the Application
```cmd
node app.js
```


## Database Name: car_database:

### Collections and Relationships:

#### Collection: car_reviews

This collection is storing reviews made by users about different cars. Each review is linked to a specific car through the `car_id`, establishing a one-to-many relationship between car and car_reviews (one car can have many reviews).

- `_id`: ObjectId – A unique identifier for each review.
- `car_id`: String – Links the review to a specific car in the car collection.
- `review_title`: String – The title of the review.
- `review_body`: String – The detailed text of the review.
- `rating`: Int32 – The rating given by the reviewer, typically on a scale of 1-5.
- `author`: String – The username of the review's author, linking indirectly to the users collection.
- `likes`: Int32 – The number of likes the review has received.
- `dislikes`: Int32 – The number of dislikes the review has received.
- `date_posted`: Date – When the review was posted.
- `likedBy`: Array of ObjectIds – User IDs from the users collection who liked the review.
- `dislikedBy`: Array of ObjectIds – User IDs from the users collection who disliked the review.

##### The relationships:
- Links to car via `car_id`.
- Many-to-many relationship with users through `likedBy` and `dislikedBy` arrays (users can like/dislike multiple reviews, and each review can be liked/disliked by multiple users).

#### Collection: car

Stores the information about cars that are reviewed on the platform. Each car can be associated with multiple reviews in the car_reviews collection.

- `_id`: ObjectId – A unique identifier for each car.
- `make`: String – Manufacturer of the car.
- `model`: String – Model of the car.
- `year`: String – Year of the car.
- `base_model`: Not used in this project but it represents the base model of cars.

##### Relationships:

- One-to-many relationship with car_reviews (a single car can have multiple reviews).

#### Collection: users

Has user information, including authentication and preference data.

- `_id`: ObjectId – A unique identifier for each user.
- `email`: String – User's email address.
- `username`: String – User's chosen username.
- `password`: String – Hhashed password for user authentication with bycript
- `admin`: Boolean – Shows if user is Admin ( true) or not (false). this has to be manualy adjusted in the database.

##### Relationships:

- Many-to-many relationship with car_reviews through likes and dislikes. Users can interact with multiple reviews by liking or disliking them, and their IDs are stored in the `likedBy` and `dislikedBy` fields of the car_reviews collection.
#

#
 
#

# Project development:

```javascript
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
```
The initial step involved setting up the project and installing necessary Node.js packages. Each package serves a distinct purpose, from creating an Express application (express), connecting to MongoDB (mongoose), parsing request bodies (body-parser), to managing sessions (express-session).

### Application Architecture
The application follows a simplified Model-View-Controller (MVC) architecture, focusing on separating the database management (Model), the interface (View), and the application logic (Controller).

### Database Connection
```javascript
mongoose.connect('mongodb://localhost/car_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```
Connecting to MongoDB involves specifying the database URL and options to ensure compatibility and performance. This step is crucial for enabling the application to interact with the database.

### Middleware and Static Files

```javascript
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

```
Middleware in Express helps in processing requests, from serving static files located in the public directory to parsing form data and overriding HTTP methods for RESTful services.

### Session Management

```javascript
app.use(session({
  secret: 'my_key',
  resave: false,
  saveUninitialized: false,
}));

```
Sessions are managed using express-session, which is essential for tracking users across requests, enhancing both functionality and security.

### Routing and Views
The application uses Express routing to handle requests and EJS for rendering HTML based on data, making it dynamic and interactive.
- `home.ejs:` Home page for user to select cars
- `login.ejs:` Login page
- `register.ejs:` Register page
- `reviews.ejs:` Second main page where writing or viewing reviews is happening.


## Challenges and Learnings

### Asynchronous Programming
One of the main challenges was dealing with asynchronous operations, especially in database interactions. Learning to effectively use JavaScript's async/await patterns was crucial for managing these operations.

### Security Concerns
Security is very important. Implementing sessions for user authentication highlighted the importance of securing applications against common vulnerabilities.


## Models

### Car Model

The `Car` model is designed to store information about cars. It is defined using Mongoose's schema definition. Here's the schema structure for the `Car` model:

```javascript
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: String,
  base_model: String,
});

module.exports = mongoose.model('Car', carSchema);

```
This model includes fields for the make, model, year, and base model of the car. although base_model is not used, im planning in the near future to utilise this aspect.

### Review Model

The Review model is used for storing user reviews of cars. It includes fields for the car ID, review title, review body, rating, author, date posted, likes, dislikes, liked by users, and disliked by users. Here's the schema definition:

```javascript
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
```

This schema also demonstrates the relationship between reviews and users, with likedBy and dislikedBy fields referencing the User model.

### User Model
The User model is for storing user account information, including email, username, password, and admin status. It employs bcryptjs for password hashing to enhance security. The schema also includes a pre-save hook to automatically hash passwords before saving them to the database:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
});

userSchema.pre('save', async function(next) {
    try {
      if (!this.isModified('password')) return next();
      this.password = await bcrypt.hash(this.password, 12);
      next();
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
```


# Car Selection & Form Interaction

This JavaScript code is designed to enhance a car selection form on a web page. It dynamically updates model and year dropdowns based on the user's selections and handles form submission. Below is a breakdown of its functionality:

## Initial Setup

When the document is fully loaded, event listeners are attached to dropdown menus and the car form:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const makeDropdown = document.getElementById('makeDropdown');
    const modelDropdown = document.getElementById('modelDropdown');
    const yearDropdown = document.getElementById('yearDropdown');
    const carForm = document.getElementById('carForm');
```

### Dynamic Model Dropdown Update

When a make is selected, the model dropdown is dynamically populated based on the selected make:

```javascript
makeDropdown.addEventListener('change', function() {
    const selectedMake = this.value;
    fetch(`/models?make=${selectedMake}`)
        .then(response => response.json())
        .then(models => {
            modelDropdown.innerHTML = '<option value="">Select Model</option>';
            models.forEach(car => {
                const option = new Option(car.model, car.model);
                option.dataset.carId = car._id;
                modelDropdown.append(option);
            });
            modelDropdown.disabled = false;
        })
        .catch(error => console.error('Error:', error));
});

```

### Dynamic Year Dropdown Update
Once a model is selected, the year dropdown is updated based on the selected make and model:

```javascript
modelDropdown.addEventListener('change', function() {
    const selectedMake = makeDropdown.value;
    const selectedModel = this.value;
    fetch(`/years?make=${selectedMake}&model=${selectedModel}`)
        .then(response => response.json())
        .then(years => {
            yearDropdown.innerHTML = '<option value="">Select Year</option>';
            years.forEach(year => {
                yearDropdown.append(new Option(year, year));
            });
            yearDropdown.disabled = false;
        })
        .catch(error => console.error('Error:', error));
});

```

### Form Submission Handling
The form submission is intercepted to perform a custom action based on the selected car ID:

```javascript
carForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const selectedCarId = modelDropdown.options[modelDropdown.selectedIndex].dataset.carId;
    if(selectedCarId) {
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'block';
            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 10000); //timeout
        }
        console.log("Form submitted for car ID:", selectedCarId);
        window.location.href = `/reviews/${selectedCarId}`;
    } else {
        alert("Please select a valid model.");
    }
});

```
This code enhances the user experience by providing immediate feedback and tailored options based on previous selections, without the need for page reloads.

## Index.js

### Home Page Route

```javascript
router.get('/', async (req, res) => {
  const makes = await Car.distinct('make');
  const username = req.session.userId ? (await User.findById(req.session.userId)).username : null;
  res.render('home', { makes, username });
});
```
This route handler is responsible for rendering the home page. It asynchronously retrieves a distinct list of car makes from the Car model and the username of the currently logged-in user from the User model. It then passes these data to the home view template for rendering. The use of await ensures that the database queries complete before the page is rendered, while the ternary operator checks if a user is logged in to conditionally retrieve the username.

### Page route
```javascript
router.get('page',(req,res) =>{
  res.render('page')
})

```
This snippet defines a simple route that renders a view called page. This route handler doesn't perform any data fetching or manipulation and directly renders a view, indicating a static page within the application.

### Dislike Review Route

```javascript
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
```
This route allows users to "dislike" a review. It first checks if the user is authenticated using the checkAuth middleware. Then, it attempts to find the review by ID and updates the dislike count and dislikedBy array if the user hasn't already disliked it. It uses MongoDB's $inc to increment the dislike count and $push to add the user's ID to the dislikedBy array. Error handling is provided to catch and respond to any issues during the process.

### Like Review Route
```javascript

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

```
Mirroring the dislike route, this route enables users to "like" a review. It employs the same checkAuth middleware to ensure that only authenticated users can like a review. The logic checks whether the user has already liked the review to prevent duplicate likes. Successful execution results in incrementing the like count and adding the user's ID to the likedBy array, followed by a redirection to the previous page.


### Delete Review Route
```javascript
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
```
This route handler allows for the deletion of a review, restricted to admin users. It checks the session for an isAdmin flag and proceeds to delete the review if the user has administrative privileges. The method findOneAndDelete is used to remove the review from the database, ensuring that only a single document is deleted. Error handling is included to manage any exceptions and provide feedback.


### Reviews Route with Sorting Options
```javascript
router.get('/reviews/:id', async (req, res) => {
  try {
      const carId = req.params.id;
      const car = await Car.findById(carId);
      if (!car) {
          return res.status(404).send('Car not found');
      }

      const sortOption = req.query.sort;
      let sortQuery = { date_posted: -1 }; // Default to newest first
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

      const reviews = await Review.find({ car_id: carId }).sort(sortQuery);
      const loggedIn = req.session.userId ? true : false;
      let isAdmin = false;
      if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        isAdmin = user.admin === true;
      }
      res.render('reviews', { car, reviews, loggedIn, isAdmin: req.session.isAdmin });
  } catch (error) {
      console.error("Error fetching reviews for car ID:", carId, "Error:", error);
      res.status(500).send('Server error');
  }
});

```
This route fetches and displays reviews for a specific car, identified by carId. It includes functionality to sort reviews based on the sort query parameter (newest, oldest, most liked, most disliked). The route also checks if a user is logged in and if they are an admin to conditionally render parts of the view and perform admin actions. This demonstrates a dynamic content display based on user interaction and privileges.

### Models Route for Car Make and Model
```javascipt
router.get('/models', async (req, res) => {
    const { make } = req.query;
    const cars = await Car.find({ make: make }).select('model _id');
    res.json(cars);
});

```
This route provides a JSON response containing car models and their IDs based on the selected make. It demonstrates how to handle AJAX requests in Express, allowing for dynamic updating of form options based on user selection without reloading the page.

### Years Route for Car Make and Model
```javascript
router.get('/years', async (req, res) => {
    const { make, model } = req.query;
    const years = await Car.find({ make: make, model: model }).distinct('year');
    res.json(years);
});

```

Similar to the /models route, this route fetches and returns distinct years for cars based on the selected make and model. This supports dynamic content generation in client-side forms, enhancing user experience by allowing users to narrow down their search or input criteria.


### Submit Review Route
```javascript
router.post('/submit-review', checkAuth, async (req, res) => {
  try {
      const { car_id, review_title, review_body, rating } = req.body;
      const user = await User.findById(req.session.userId);
      if (!user) {
          return res.status(403).send('You must be logged in to submit a review.');
      }
      const author = user.username;

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
```
This route allows authenticated users to submit reviews for a car. It checks for user authentication, retrieves the user's details, and creates a new Review document in the database. This demonstrates handling form submissions, interacting with the database, and redirecting users after an action is completed.

###  User Registration Route

```javascript
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
            password
        });

        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during registration');
    }
});


```
This segment allows new users to register. It checks if the email is already in use and, if not, creates a new User document. 

### Logout and Login Routes

```javascript
// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.isAdmin = user.admin === true;
      res.redirect('/');
    } else {
      res.status(401).send('Login failed');
    }
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).send('Server error during login');
  }
});
```
These routes manage user sessions for logging in and out. The logout route destroys the user session, effectively logging them out, while the login route checks user credentials against the database and sets session variables accordingly. This showcases session management and secure password handling using bcrypt for authentication.

### Fetching Reviews for a Specific Car

```js
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
```
This route is responsible for fetching and displaying reviews for a specific car identified by carId in the URL parameter. It attempts to find the car and its associated reviews in the database. Reviews are sorted by their posting date in descending order to display the most recent reviews first. The route also checks if the user is logged in by examining the session data to optionally include the user's username in the rendered page, enhancing the personalized experience. Error handling is present to catch and respond to any issues that may arise during the process.

### Liking a Review

```js
router.post('/reviews/:id/like', async (req, res) => {
    try {
        await Review.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } });
        res.redirect('back'); // Redirect back to the page the request came from
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
```
This route enables users to like a review. It increments the likes field of a specific review document by one using the $inc operator in MongoDB. After successfully updating the document, it redirects the user back to the page they came from, creating a seamless user experience. Error handling ensures any issues encountered during the process are managed appropriately.

### Disliking a Review

```js
router.post('/reviews/:id/dislike', async (req, res) => {
    try {
        await Review.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 } });
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
```
This route allows users to dislike a review. It works similarly by incrementing the dislikes field for a given review document in the database. The user is then redirected back to their previous page, maintaining a smooth interaction flow. As with the like route, error handling is included to address any operational errors effectively.



# Conclusion
To sum up, the code exhibits a strong web application that improves the automobile purchasing process through in-depth reviews and user interaction. It provides secure password hashing, dynamic content, and user authentication using Node.js, Express, and MongoDB.

 The code guarantees scalability and clear organisation by adhering to the MVC architecture. Important features include sorting options for reviews and dynamic dropdowns for choosing cars. There are security protocols in place, such as session management and password hashing. 
