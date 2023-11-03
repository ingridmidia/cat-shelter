const sequelize = require('../config/connection');

const { Shelter, Cat } = require('../models');

const shelterData = require('./shelterData.json');
const catData = require('./catData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const shelters = await Shelter.bulkCreate(shelterData, {
    individualHooks: true,
    returning: true,
  });

  const cats = await Cat.bulkCreate(catData);

  process.exit(0);
};

seedDatabase();