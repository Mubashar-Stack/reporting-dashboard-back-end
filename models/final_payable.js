

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

const FinalPayable = sequelize.define('final_payables', {


  domain: {
    type: DataTypes.STRING,
  },
  gross_revenue: {
    type: DataTypes.DOUBLE,
  },
  deductions: {
    type: DataTypes.DOUBLE,
  },
  net_revenue: {
    type: DataTypes.DOUBLE,
  },
  // domainsOfUser: [{ type: Schema.Types.ObjectId, ref: 'domains' }],
  updated_at: {
    type: DataTypes.DATEONLY,
    default: Date.now,
  },
  created_at: {
    type: DataTypes.DATEONLY,
    default: Date.now,
  },

}, {
  // Other model options go here
});
module.exports = FinalPayable;
