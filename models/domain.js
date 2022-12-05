const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

const Domain = sequelize.define('domains', {
  domainname: {
    type: DataTypes.STRING,
  },
  ads_code: {
    type: DataTypes.STRING,
  },
  // user: { type: Schema.Types.ObjectId, ref: 'users' },
  created_at: {
    type: DataTypes.DATE,
    default: Date.now,
  },
  updated_at: {
    type: DataTypes.DATE,
    default: Date.now,
  },

}, {
  // Other model options go here
});


module.exports = Domain;
