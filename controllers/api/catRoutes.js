const express = require('express');
const router = express.Router();
const { Cat, Shelter } = require('../../models'); // Assuming you have these models
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

router.post('/new', async (req, res) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).json(newCat);
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
      res.status(404).json({ message: 'No cat found with that ID!' });
      return;
    }
    res.json(cat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/shelter/:id', async (req, res) => {
  try {
    const cat = await Cat.findByPk(req.params.id, {
      include: [{ model: Shelter }],
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

module.exports=router;
