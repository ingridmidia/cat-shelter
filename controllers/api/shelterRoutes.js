const express = require('express');
const router = express.Router();
const { Shelter } = require('../../models');

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
    // If no user is logged in, respond with a "Not Found" status code
    res.status(404).end();
  }
});

module.exports = router;
