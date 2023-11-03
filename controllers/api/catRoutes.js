const express = require('express');
const router = express.Router();
const { Cat } = require('../../models');
const fileUpload = require('express-fileupload');
router.use(fileUpload());

const ImgurClient = require('imgur').ImgurClient;

// Load environment variables for Imgur API
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Create an Imgur client instance using environment variables
const client = new ImgurClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN,
});

// Create a new cat with a photo - POST /api/cat/new/:id
router.post('/new/:id', async (req, res) => {
  try {
    // Upload the photo to Imgur
    const response = await client.upload({
      image: req.files.photo.data,
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
      "shelter_id": req.params.id
    });

    // Redirect to the shelter page
    res.redirect(`/shelter/${req.params.id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete cat by ID - DELETE /api/cat/:id
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
