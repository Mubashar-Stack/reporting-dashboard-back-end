// const mongoose = require("mongoose");
// const Schema = mongoose.Schema

// const FinalPayableFilesSchema = new mongoose.Schema({
  
//   file: {
//     type: String,
//     // required: true,
//   },
//   // domainsOfUser: [{ type: Schema.Types.ObjectId, ref: 'domains' }],
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const FinalPayableFiles = mongoose.model("final_payable_files", FinalPayableFilesSchema);

// module.exports = FinalPayableFiles;



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

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true

module.exports = FinalPayableFiles;
