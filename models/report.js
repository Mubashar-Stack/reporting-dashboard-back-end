const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

const Report = sequelize.define('reports', {



  Domain_name: {
    type: DataTypes.STRING,
  },
  Ad_Requests: {
    type: DataTypes.DOUBLE,
  },
  Ad_Impressions: {
    type: DataTypes.DOUBLE,
  },
  Revenue: {
    type: DataTypes.DOUBLE,
  },
  Calculated_Ad_Requests: {
    type: DataTypes.DOUBLE,
  },
  Calculated_Ad_Impressions: {
    type: DataTypes.DOUBLE,
  },
  Calculated_Revenue: {
    type: DataTypes.DOUBLE,
  },
  eCPM: {
    type: DataTypes.DOUBLE,
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
  },
}, {
  // Other model options go here
});


module.exports = Report;
