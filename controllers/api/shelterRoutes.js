const router = require('express').Router();
const { Shelter } = require('../../models');

// Create a new shelter
router.post('/', async (req, res) => {
  try {
    const shelterData = await Shelter.create(req.body);
    // Optionally, you can generate a token or session here for automatic login
    res.status(201).json(shelterData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const shelterData = await Shelter.findOne({ where: { username } });

    if (!shelterData) {
      return res.status(400).json({ message: 'Incorrect username or password, please try again' });
    }

    const validPassword = await shelterData.checkPassword(password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect username or password, please try again' });
    }

    // Create a session or JWT token for authentication
    req.session.save(() => {
      req.session.shelter_id = shelterData.id;
      req.session.logged_in = true;

      return res.json({ shelter: shelterData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
