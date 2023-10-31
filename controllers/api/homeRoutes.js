const express = require('express');
const router = express.Router();
const { Cat, Shelter } = require('../../models');

router.get('/', async (req, res) => {
  try {
    // Fetch data from the database (e.g., cats and shelters) as needed
    const catsData = await Cat.findAll();
    const sheltersData = await Shelter.findAll();

    // Map the data to plain objects for rendering
    const cats = catsData.map((cat) => cat.get({ plain: true }));
    const shelters = sheltersData.map((shelter) => shelter.get({ plain: true }));

    res.render('main', {
      cats,
      shelters,
      loggedIn: req.session.loggedIn, // Assuming 'loggedIn' is stored in the session
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Define other routes for the homepage as needed
// For example, you can create additional routes for specific actions or pages on the homepage.

module.exports = router;
