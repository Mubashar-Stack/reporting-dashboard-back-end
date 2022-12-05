// const mongoose = require("mongoose");
// const Schema = mongoose.Schema


// const DomainSchema = new mongoose.Schema({
//   domainname: {
//     type: String,
//     // required: true,
//   },
//   ads_code: {
//     type: String,
//     // required: true,
//   },
//   // Owner:{
//   //   type: Schema.Types.objectId,
//   //   ref: 'users'
//   // },
//   user: { type: Schema.Types.ObjectId, ref: 'users' },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
//   // domainReports: [{ type: Schema.Types.ObjectId, ref: 'reports' }],
// });

// const Domain = mongoose.model("domains", DomainSchema);

// module.exports = Domain;


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

(async () => {
  await sequelize.sync();
  // Code here
})();

module.exports = Domain;
