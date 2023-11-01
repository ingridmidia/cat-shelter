const express = require('express');
const router = require('express').Router();
const Cat = require('../models/cat');
const Shelter = require('../models/shelter');

router.get('/', async (req, res) => {
  res.render('login');
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/dashboard', async (req, res) => {
  //   try {
  //   // Fetch data from the database (e.g., cats and shelters) as needed
  //   const catsData = await Cat.findAll();
  //   const sheltersData = await Shelter.findAll();

  //   // Map the data to plain objects for rendering
  //   const cats = catsData.map((cat) => cat.get({ plain: true }));
  //   const shelters = sheltersData.map((shelter) => shelter.get({ plain: true }));

  //   res.render('dashboard', {
  //     cats,
  //     shelters,
  //     logged_in: req.session.logged_in,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json(err);
  //   }

  try {
    const sheltersData = await Shelter.findAll();
    const shelters = sheltersData.map((shelter) => shelter.get({ plain: true }));
    res.render("dashboard", { shelters, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Define other routes for the homepage as needed
// For example, you can create additional routes for specific actions or pages on the homepage.

router.get("/shelter/:id", async (req, res) => {
  const catsData = await Cat.findAll({
    where: {
      shelter_id: req.params.id
    }
  });

  const cats = catsData.map((cat) => cat.get({ plain: true }));
  res.render("cats", {
    cats, logged_in: req.session.logged_in,
  });
});

module.exports = router;
