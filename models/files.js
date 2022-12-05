
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

const Files = sequelize.define('files', {

  file: {
    type: DataTypes.STRING,
  },
  commission: {
    type: DataTypes.DOUBLE,
  },
  updated_at: {
    type: DataTypes.DATEONLY,
    default: Date.now,
  },
  create_at: {
    type: DataTypes.DATEONLY,
    default: Date.now,
  }

}, {
  // Other model options go here
});


module.exports = Files;
