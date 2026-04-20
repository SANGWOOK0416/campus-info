const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post_id:           { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:           { type: String, required: true },
  created_at:        { type: Date, required: true, default: Date.now },
  updated_at:        { type: Date },
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  is_deleted:        { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('Comment', commentSchema);
