const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    // required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  first_name: {
    type: String,
    // required: true,
  },
  type: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  enabled: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  card_name: {
    type: String,
    // required: true,
  },
  card_number: {
    type: String,
    // required: true,
  },
  cvc: {
    type: String,
    // required: true,
  },
  expiry_date: {
    type: String,
    // required: true,
  },
  banck_name: {
    type: String,
    // required: true,
  },
  bank_address: {
    type: String,
    // required: true,
  },
  bank_ac_holder_name: {
    type: String,
    // required: true,
  },
  account_number: {
    type: String,
    // required: true,
  },
  IFSC_code: {
    type: String,
    // required: true,
  },
  bank_account_holder_address: {
    type: String,
    // required: true,
  },
  paypal_email_address: {
    type: String,
    // required: true,
  },
  swift_bic_code: {
    type: String,
    // required: true,
  },
  upi: {
    type: String,
    // required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
