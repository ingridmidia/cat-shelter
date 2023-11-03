// const express = require('express'); not being used
const router = require('express').Router();
const Cat = require('../models/cat');
const Shelter = require('../models/shelter');

// Render login page
router.get('/', async (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// Render dashboard with shelter locations
router.get('/dashboard', async (req, res) => {
  try {
    console.log(req.session);
    const sheltersData = await Shelter.findAll();
    const shelters = sheltersData.map((shelter) => shelter.get({ plain: true }));
    res.render("dashboard", { shelters, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Render cats by shelter
router.get("/shelter/:id", async (req, res) => {
  try {

    const shelterData = await Shelter.findByPk(req.params.id);
    const shelter = shelterData.get({ plain: true });

    const catsData = await Cat.findAll({
      where: {
        shelter_id: req.params.id
      }
    });
    if (!catsData) {
      console.log(`Shelter with ID ${req.params.id} not found`);
      res.status(404).end();
      return;
    }
    const cats = catsData.map((cat) => cat.get({ plain: true }));
    res.render("myShelter", {
      cats, shelter, logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).end();
  }
});

// Render a cat
router.get('/cat/:id', async (req, res) => {
  try {
    const catData = await Cat.findByPk(req.params.id);

    if (!catData) {
      console.log(`Cat with ID ${req.params.id} not found`);
      res.status(404).end();
      return;
    }
    const cat = catData.get({ plain: true });
    res.render("cat", { cat, logged_in: req.session.logged_in });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).end();
  }
});

// Render page to add a new cat
router.get("/cat/new/:id", async (req, res) => {

  if (!req.session.logged_in) {
    res.redirect("/login");
  } else {
    res.render("newCat", { logged_in: req.session.logged_in, shelter_id:req.params.id });
  }
});

module.exports = router;
