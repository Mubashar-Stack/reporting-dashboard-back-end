const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db")
const Domain = require('./domain')

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
    defaultValue:'user',
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
    defaultValue: '1',
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
    allowNull: true

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

// (async () => {
//   await sequelize.sync();
//   // Code here
// })();

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
User.hasMany(Domain)
Domain.belongsTo(User, {
  foreignKey: 'userId',
})

module.exports = User;
