const express = require('express');
const router = express.Router();
const { Cat } = require('../../models'); // Assuming you have these models
const fileUpload = require('express-fileupload');
const imgur = require('imgur');
const { Model } = require('sequelize');

router.use(fileUpload());

const ImgurClient = require('imgur').ImgurClient;

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const client = new ImgurClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN,
});

// api/cat/new
router.post('/new', async (req, res) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).json(newCat);

    const response = await client.upload({
      image: createReadStream(req.body.image),
      type: 'image',
    });

    console.log(response.data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const allCats = await Cat.findAll();
    res.json(allCats);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findByPk(req.params.id);
    if (!cat) {
      console.log(`Cat with ID ${req.params.id} not found`);
      res.status(404).json({ message: 'No cat found with that ID!' });
      return;
    }
    console.log(`Cat with ID ${req.params.id} found:`, cat);
    res.json(cat);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json(err);
  }
});

router.get('/shelter/:id', async (req, res) => {
  try {
      const cat = await Cat.findByPk(req.params.id, {
          include: [{ model: Shelter }]
      });
      if (!cat) {
          res.status(404).json({ message: 'No cat found with that ID!' });
          return;
      }
      res.json(cat.Shelter);
  } catch (err) {
      res.status(500).json(err);
  }
});
router.put('/adoptable/:id', async (req, res) => {
  try {
      const cat = await Cat.update(
          { isAdoptable: true }, // Mark as adoptable
          { where: { id: req.params.id } }
      );
      if (!cat) {
          res.status(404).json({ message: 'No cat found with that ID!' });
          return;
      }
      res.json(cat);
  } catch (err) {
      res.status(500).json(err);
  }
});
router.delete('/:id', async (req, res) => {
    try {
        const cat = await Cat.destroy({
            where: { id: req.params.id }
        });
        if (!cat) {
            res.status(404).json({ message: 'No cat found with that ID!' });
            return;
        }
        res.json({ message: 'Cat deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;