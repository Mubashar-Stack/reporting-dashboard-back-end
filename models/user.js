// const mongoose = require("mongoose");
// const Schema = mongoose.Schema

// const UserSchema = new mongoose.Schema({
//   first_name: {
//     type: String,
//     // required: true,
//   },
//   last_name: {
//     type: String,
//     // required: true,
//   },
//   first_name: {
//     type: String,
//     // required: true,
//   },
//   type: {
//     type: String,
//     // required: true,
//   },
//   photo: {
//     type: String,
//     // required: true,
//   },
//   email: {
//     type: String,
//     // required: true,
//   },
//   enabled: {
//     type: String,
//     // required: true,
//   },
//   password: {
//     type: String,
//     // required: true,
//   },
//   card_name: {
//     type: String,
//     // required: true,
//   },
//   card_number: {
//     type: String,
//     // required: true,
//   },
//   cvc: {
//     type: String,
//     // required: true,
//   },
//   expiry_date: {
//     type: String,
//     // required: true,
//   },
//   banck_name: {
//     type: String,
//     // required: true,
//   },
//   bank_address: {
//     type: String,
//     // required: true,
//   },
//   bank_ac_holder_name: {
//     type: String,
//     // required: true,
//   },
//   account_number: {
//     type: String,
//     // required: true,
//   },
//   IFSC_code: {
//     type: String,
//     // required: true,
//   },
//   bank_account_holder_address: {
//     type: String,
//     // required: true,
//   },
//   paypal_email_address: {
//     type: String,
//     // required: true,
//   },
//   swift_bic_code: {
//     type: String,
//     // required: true,
//   },
//   upi: {
//     type: String,
//     // required: true,
//   },
//   // domains:[{
//   //   type: Schema.Types.objectId,
//   //   ref: 'domains'
//   // }],
//   domainsOfUser: [{ type: Schema.Types.ObjectId, ref: 'domains' }],
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
//   create_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = mongoose.model("users", UserSchema);

// module.exports = User;


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

const User = sequelize.define('users', {

  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,

    // required: true,
  },
  type: {
    type: DataTypes.STRING,

    // required: true,
  },
  photo: {
    type: DataTypes.STRING,

    // required: true,
  },
  email: {
    type: DataTypes.STRING,
    // type: Strrequired: true,
  },
  enabled: {
    type: DataTypes.STRING,

    // required: true,
  },
  password: {
    type: DataTypes.STRING,

    // required: true,
  },
  card_name: {
    type: DataTypes.STRING,

    // required: true,
  },
  card_number: {
    type: DataTypes.STRING,

    // required: true,
  },
  cvc: {
    type: DataTypes.STRING,

    // required: true,
  },
  expiry_date: {
    type: DataTypes.DATEONLY,

    // required: true,
  },
  banck_name: {
    type: DataTypes.STRING,

    // required: true,
  },
  bank_address: {
    type: DataTypes.STRING,

    // required: true,
  },
  bank_ac_holder_name: {
    type: DataTypes.STRING,

    // required: true,
  },
  account_number: {
    type: DataTypes.STRING,

    // required: true,
  },
  IFSC_code: {
    type: DataTypes.STRING,

    // required: true,
  },
  bank_account_holder_address: {
    type: DataTypes.STRING,

    // required: true,
  },
  paypal_email_address: {
    type: DataTypes.STRING,

    // required: true,
  },
  swift_bic_code: {
    type: DataTypes.STRING,

    // required: true,
  },
  upi: {
    type: DataTypes.STRING,

    // required: true,
  },

  updated_at: {
    type: DataTypes.DATEONLY,
    default: Date.now,
  },
  create_at: {
    type: DataTypes.DATEONLY,
    default: Date.now,
  },


  // Model attributes are defined here
  // firstName: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  // lastName: {
  //   type: DataTypes.STRING
  //   // allowNull defaults to true
  // }
}, {
  // Other model options go here
});

(async () => {
  await sequelize.sync();
  // Code here
})();

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true

module.exports = User;
