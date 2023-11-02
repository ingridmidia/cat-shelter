const express = require('express');
const router = express.Router();
const { Cat } = require('../../models');

const fileUpload = require('express-fileupload');
const imgur = require('imgur');
const { Model } = require('sequelize');
const fs = require('fs')

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
    const response = await client.upload({
      image: fs.createReadStream(req.body.photo), // Read the photo file
      type: 'stream',
    });
    
    // Get the Imgur link to the uploaded photo
    let imgurLink = response.data.link;

    // Create a new cat record in the database with the uploaded photo link
    const newCat = await Cat.create({
      "name": req.body.name,
      "breed": req.body.breed,
      "age": req.body.age,
      "description": req.body.description,
      "photo": imgurLink,
      "shelter_id": req.body.shelter_id
    })
    console.log(response.data, newCat);
    res.status(201).json(newCat)
    console.log("Imgur: " + imgurLink)
  } catch (err) {
    console.log(err);
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
