const sequelize = require('../config/connection');
const { User, Shelter } = require('../models');

const userData = require('./userData.json');
const shelterData = require('./shelterData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const shelte of shelterData) {
    await shelte.create({
      ...shelte,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
