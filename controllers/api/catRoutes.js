const express = require('express');
const router = express.Router();
const { Cat } = require('../../models'); // Assuming you have these models
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

// POST /api/cat/new
router.post('/new', async (req, res) => {
  try {
    // Upload the cat's photo to Imgur
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
      "adoptable": req.body.adoptable,
      "shelter_id": req.body.shelter_id
    });

    // Log the Imgur response data and the new cat record
    console.log(response.data, newCat);

    // Respond with the newly created cat record
    res.status(201).json(newCat);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
