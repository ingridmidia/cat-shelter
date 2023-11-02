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

// creates new cat
router.post('/new', async (req, res) => {
  try {


    const response = await client.upload({
      image: fs.createReadStream(req.body.photo),
      type: 'stream',
    });
    let imgurLink = response.data.link;
    const newCat = await Cat.create({
      "name": req.body.name,
      "breed": req.body.breed,
      "age": req.body.age,
      "description": req.body.description,
      "photo": imgurLink,
      "adoptable": req.body.adoptable,
      "shelter_id": req.body.shelter_id
    });
    console.log(response.data, newCat);
    res.status(201).json(newCat);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;