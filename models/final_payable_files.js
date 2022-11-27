const mongoose = require("mongoose");
const Schema = mongoose.Schema

const FinalPayableFilesSchema = new mongoose.Schema({
  
  file: {
    type: String,
    // required: true,
  },
  // domainsOfUser: [{ type: Schema.Types.ObjectId, ref: 'domains' }],
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const FinalPayableFiles = mongoose.model("final_payable_files", FinalPayableFilesSchema);

module.exports = FinalPayableFiles;
