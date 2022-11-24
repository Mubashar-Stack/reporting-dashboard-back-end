const mongoose = require("mongoose");
const Schema = mongoose.Schema


const DomainSchema = new mongoose.Schema({
  domainname: {
    type: String,
    // required: true,
  },
  ads_code: {
    type: String,
    // required: true,
  },
  // Owner:{
  //   type: Schema.Types.objectId,
  //   ref: 'users'
  // },
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  // domainReports: [{ type: Schema.Types.ObjectId, ref: 'reports' }],
});

const Domain = mongoose.model("domains", DomainSchema);

module.exports = Domain;
