const Shelter = require('./Shelter');
const Cat = require('./Cat');

Shelter.hasMany(Cat, {
  foreignKey: 'shelter_id',
});

Cat.belongsTo(Shelter, {
  foreignKey: 'shelter_id',
});

module.exports = { Shelter, Cat };