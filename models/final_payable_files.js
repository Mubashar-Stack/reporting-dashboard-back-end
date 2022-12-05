const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

const FinalPayableFiles = sequelize.define('final_payable_files', {


  file: {
    type: DataTypes.STRING,
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

module.exports = FinalPayableFiles;
