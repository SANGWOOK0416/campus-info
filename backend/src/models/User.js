// TODO: mongoose, bcryptjs import

// TODO: User 스키마 정의
// - username: String, required, unique
// - email: String, required, unique
// - password: String, required (bcrypt 해시 저장)
// - 필요한 필드 추가 (학번, 학과 등)
// - timestamps: true

// TODO: save 전 비밀번호 bcrypt 해싱 (pre hook)

// TODO: 비밀번호 비교 메서드 구현 (comparePassword)

// TODO: mongoose.model('User', userSchema) export

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0_id: { type: String, required: true, unique: true }, // Auth0 고유 식별자 (sub)
  student_id: { type: String, required: true, unique: true }, // 학번
  name: { type: String, required: true },
  grade: { type: Number, required: true }, // 학년
  major: { type: String, required: true }, // 전공
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // admin/user 구분
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: false } // 발표 자료 명세 준수함
});

module.exports = mongoose.model('User', userSchema);