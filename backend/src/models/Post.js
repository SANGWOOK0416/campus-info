const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  board_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  user_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:      { type: String, required: true },
  content:    { type: String, required: true },
  view_count: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date },
  like_count: { type: Number, required: true, default: 0 },
  is_deleted: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('Post', postSchema);
