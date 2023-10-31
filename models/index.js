const Shelter = require('./shelter');
const Cat = require('./cat');

Shelter.hasMany(Cat, {
  foreignKey: 'shelter_id',
});

Cat.belongsTo(Shelter, {
  foreignKey: 'shelter_id',
});

module.exports = { Shelter, Cat };