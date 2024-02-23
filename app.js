// /

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
// connect to MongoDB
mongoose.connect('mongodb://localhost/car_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'my_key',
  resave: false,
  saveUninitialized: false,
}));

// require routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
