const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Shelter extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

Shelter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Sheltername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newShelterData) => {
        newShelterData.password = await bcrypt.hash(newShelterData.password, 10);
        return newShelterData;
      },
      beforeUpdate: async (updatedShelterData) => {
        updatedShelterData.password = await bcrypt.hash(updatedShelterData.password, 10);
        return updatedShelterData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Shelter',
  }
);

module.exports = Shelter;
