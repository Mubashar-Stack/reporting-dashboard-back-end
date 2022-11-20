const mongoose = require("mongoose");

const FilesSchema = new mongoose.Schema({
  file: {
    type: String,
    // required: true,
  },
  commisssion: {
    type: Number,
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

const File = mongoose.model("files", FilesSchema);

module.exports = File;
