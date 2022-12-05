// "use strict";

// const { db_read, db_write } = require("../config/db");

// // final_payable object constructor
// const final_payable = (data) => {
//   this.id = data.id;
//   this.domain = data.domain;
//   this.gross_revenue = data.gross_revenue;
//   this.deductions = data.deductions;
//   // id, domain, gross_revenue, deductions, net_revenue
//   this.net_revenue = data.net_revenue;
//   this.created_at = new Date();
//   this.updated_at = new Date();
// };


// final_payable.addFinalPayable = function addFinalPayable(data, result) {

//   db_write.query("INSERT INTO final_payable (domain, gross_revenue, deductions, net_revenue,created_at,updated_at) VALUES ? ", [data.map(item => [item.domain, item.gross_revenue, item.deductions, item.net_revenue, item.created_at, item.updated_at])], function (err, res) {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//     } else {
//       result(null, res);
//     }
//   });

// };

// final_payable.getFiles = function getFiles(result) {
//   db_read.query("SELECT * FROM `final_payable_files` ORDER BY id DESC", function (err, res) {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//     } else {
//       result(null, res);
//     }
//   });
// };

// final_payable.getMonthlyReport = function monthlyReport(filter, result) {

//   return new Promise(async (resolve) => {

//     console.log('filter', filter);

//     db_read.query("SELECT * FROM `final_payable` where created_at >= ? and created_at <= ? + interval 1 DAY ORDER BY id DESC", [filter.start, filter.end], function (err, res) {
//       if (err) {
//         console.log("error: ", err);
//         resolve(result(err, null));
//       } else {
//         // result(null, res);
//         resolve(result(null, res));
//       }
//     });
//   });

// };


// final_payable.getUserMonthlyReport = function monthlyReport(filter, result) {

//   return new Promise(async (resolve) => {

//     console.log('filter', filter);

//     db_read.query("SELECT * FROM users_domains join domains on domain_id = domains.id JOIN final_payable on domains.domainname= final_payable.domain where"+ (filter.userId ? " user_id = ? and" : "")+" final_payable.created_at >= ? and final_payable.created_at <= ? ORDER BY final_payable.id DESC", (filter.userId ? [filter.userId, filter.start, filter.end] : [filter.start, filter.end]), function (err, res) {
//       if (err) {
//         console.log("error: ", err);
//         resolve(result(err, null));
//       } else {
//         // result(null, res);
//         resolve(result(null, res));
//       }
//     });
//   });

// };

// final_payable.deleteFile = function deleteFile(id, result) {
//   db_read.query(
//     "SELECT id, file FROM final_payable_files where id = ?",
//     [id],
//     (err, response, fields) => {
//       if (!err && response.length === 1) {
//         db_write.query(
//           "DELETE FROM final_payable_files WHERE id=?",
//           [id],
//           function (err, res) {
//             if (err) {
//               console.log("error: ", err);
//               result(err, null);
//             } else {
//               result(null, res);
//             }
//           }
//         );
//       } else {
//         result({ error: "deletions Failed!", message: "File Not Found " });
//       }
//     }
//   );
// };


// module.exports = final_payable;


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema

// const FinalPayableSchema = new mongoose.Schema({
//   domain: {
//     type: String,
//     // required: true,
//   },
//   gross_revenue: {
//     type: Number,
//     // required: true,
//   },
//   deductions: {
//     type: Number,
//     // required: true,
//   },
//   net_revenue: {
//     type: Number,
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

// const FinalPayable = mongoose.model("Model", FinalPayableSchema,"final_payable");

// module.exports = FinalPayable;



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

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true

module.exports = FinalPayable;
