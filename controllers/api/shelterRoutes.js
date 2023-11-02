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

// router.get('/shelter', async (req, res) => {
//   try {
//     const allShelters = await Shelter.findAll();
//     res.json(allShelters);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const cat = await Cat.findAll(req.params.id, {

//       include: [{ model: Shelter }],
//     });
//     if (!cat) {
//       res.status(404).json({ message: 'No cat found with that ID!' });
//       return;
//     }
//     res.json(cat.Shelter);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

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

// // Create a new shelter
// router.post('/shelter', async (req, res) => {
//   try {
//     const shelterData = await Shelter.create(req.body);
//     // Optionally, you can generate a token or session here for automatic login
//     res.status(201).json(shelterData);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

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
