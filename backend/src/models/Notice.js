const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  list_no:    { type: Number, required: true, unique: true },
  title:      { type: String, required: true },
  content:    { type: String },
  author:     { type: String, required: true },
  created_at: { type: Date, required: true },
  view_count: { type: Number, required: true, default: 0 },
  source_url: { type: String, required: true },
  is_pinned:  { type: Boolean, required: true, default: false },
  crawled_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date },
});

module.exports = mongoose.model('Notice', noticeSchema);
