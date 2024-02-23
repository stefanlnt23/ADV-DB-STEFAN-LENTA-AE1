const express = require('express');
const router = express.Router();
const Car = require('../models/car');

// fetch makes
router.get('/makes', async (req, res) => {
    const makes = await Car.distinct('make');
    res.json(makes);
});

module.exports = router;
