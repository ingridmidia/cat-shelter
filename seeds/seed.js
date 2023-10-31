const sequelize = require('../config/connection');
const { Shelter, Cat } = require('../models');

const shelterData = require('./shelterData.json');
const catData = require('./catData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const shelters = await User.bulkCreate(shelterData, {
    individualHooks: true,
    returning: true,
  });

  for (const cat of catData) {
    await Cat.create({
      ...cat,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();