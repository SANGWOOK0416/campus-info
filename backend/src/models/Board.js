const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  board_name:   { type: String, required: true },
  target_grade: { type: Number },
  target_major: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
