const express = require('express');
const router = express.Router();
const { Cat } = require('../../models');
const fileUpload = require('express-fileupload');
router.use(fileUpload());

// Not being used
// const imgur = require('imgur');
// const { Model } = require('sequelize');
// const fs = require("fs");

const ImgurClient = require('imgur').ImgurClient;

// const ACCESS_TOKEN = process.env.ACCESS_TOKEN; Not being used
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const client = new ImgurClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN,
});

// Create a new cat api/cat/new
router.post('/new/:id', async (req, res) => {
  console.log("request body", req.body);
  console.log("request files", req.files);
  try {
    const response = await client.upload({
      image: req.files.photo.data,
      type: 'stream',
    });
    console.log("imgur response", response);
    let imgurLink = response.data.link;
    console.log("Imgur: " + imgurLink)

    await Cat.create({
      "name": req.body.name,
      "breed": req.body.breed,
      "age": req.body.age,
      "description": req.body.description,
      "photo": imgurLink,
      "shelter_id": req.params.id
    });

    res.redirect(`/shelter/${req.params.id}`);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// Routes from 58 to 95 are not being used
router.get('/', async (req, res) => {
  try {
    const allCats = await Cat.findAll();
    res.json(allCats);
  } catch (err) {
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

// TODO: connect this route with a delete button on the UI
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