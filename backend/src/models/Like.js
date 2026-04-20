const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
