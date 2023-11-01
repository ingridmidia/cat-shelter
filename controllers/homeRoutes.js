const express = require('express');
const router = express.Router();
const Cat = require('../models/cat');
const Shelter = require('../models/shelter');

router.get('/', async (req, res) => {
  try {
    // Fetch data from the database (e.g., cats and shelters) as needed
    const catsData = await Cat.findAll();
    const sheltersData = await Shelter.findAll();

    // Map the data to plain objects for rendering
    const cats = catsData.map((cat) => cat.get({ plain: true }));
    const shelters = sheltersData.map((shelter) => shelter.get({ plain: true }));

    res.render('dashboard', {
      cats,
      shelters,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Define other routes for the homepage as needed
// For example, you can create additional routes for specific actions or pages on the homepage.

module.exports = router;
