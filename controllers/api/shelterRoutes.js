const express = require('express');
const router = express.Router();
const { Shelter, Cat } = require('../../models');

// Handle the POST request to create a new shelter
router.post('/', async (req, res) => {
  try {
    // Extract data from the request body
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingShelter = await Shelter.findOne({
      where: { username },
    });

    if (existingShelter) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new shelter record in the database
    const newShelter = await Shelter.create({
      username,
      password, // Remember to hash the password before storing it in production
    });

    // Optionally, you can create a session or JWT token for automatic login
    req.session.shelter_id = newShelter.id;
    req.session.logged_in = true;
    return res.json({ shelter: newShelter, message: 'Shelter registered and logged in!' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get shelter and associated cats by ID - GET /api/shelters/:id
router.get('/:id', async (req, res) => {
  try {
    const shelterData = await Shelter.findByPk(req.params.id);
    const catsData = await Cat.findAll({
      where: {
        shelter_id: req.params.id
      }
    });
    if (!shelterData) {
      console.log(`Shelter with ID ${req.params.id} not found`);
      res.status(404).end();
      return;
    }
    res.json({
      shelter: shelterData,
      cats: catsData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find a shelter in the database with the provided username
    const shelterData = await Shelter.findOne({ where: { username } });

    // If no shelter with that username is found, respond with an error message
    if (!shelterData) {
      return res.status(400).json({ message: 'Incorrect username or password, please try again' });
    }

    // Check if the provided password matches the shelter's password
    const validPassword = await shelterData.checkPassword(password);

    // If the password is invalid, respond with an error message
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect username or password, please try again' });
    }

    // Create a session or JWT token for authentication
    req.session.save(() => {
      req.session.shelter_id = shelterData.id;
      req.session.logged_in = true;

      // Respond with a success message and the shelter's data
      return res.json({ shelter: shelterData, message: 'You are now logged in!' });
    });

  } catch (err) {
    // Handle any errors that occur during the login process
    res.status(400).json(err);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // If the user is logged in, destroy the session to log them out
    req.session.destroy(() => {
      res.status(204).end(); // Respond with a success status code
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
