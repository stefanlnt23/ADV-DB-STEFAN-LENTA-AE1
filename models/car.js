const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: String,
  base_model: String,
});

module.exports = mongoose.model('Car', carSchema);
