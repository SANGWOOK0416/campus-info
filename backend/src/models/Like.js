const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { 
  // 좋아요는 수정될 일이 없으므로 생성 시간만 기록
  timestamps: { createdAt: 'created_at', updatedAt: false } 
});

// 한 유저가 같은 게시글에 중복으로 좋아요를 생성하지 못하도록 복합 인덱스 설정
likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);