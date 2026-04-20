// TODO: mongoose import

// TODO: Post 스키마 정의
// - title: String, required
// - content: String, required
// - author: ObjectId, ref 'User', required
// - comments: 배열 (author, content, createdAt) 또는 별도 모델로 분리
// - 필요한 필드 추가 (카테고리, 좋아요 수, 조회수 등)
// - timestamps: true

// TODO: mongoose.model('Post', postSchema) export

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  board_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  view_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  is_deleted: { type: Boolean, default: false }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('Post', postSchema);