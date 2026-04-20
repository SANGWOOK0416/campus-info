const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  student_id:    { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name:          { type: String, required: true },
  grade:         { type: Number, required: true },
  major:         { type: String, required: true },
  created_at:    { type: Date, required: true, default: Date.now },
  email:         { type: String, required: true },
  role:          { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);
