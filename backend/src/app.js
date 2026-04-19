require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

console.log('--- 🛡️ 서버 설정 확인 ---');
console.log('설정된 포트:', process.env.PORT || 5000);
console.log('설정된 Audience:', process.env.AUTH0_AUDIENCE || 'https://campus-info-api');
console.log('설정된 Issuer:', process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-fbp6urdelvw2mwig.us.auth0.com/');
console.log('설정된 DB 주소:', process.env.MONGO_URI ? '있음' : '없음 (체크필요)');
console.log('-----------------------');

// 미들웨어 설정
app.use(cors()); 
app.use(express.json());

// DB 연결
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB 연결 성공!'))
    .catch(err => console.error('❌ MongoDB 연결 실패:', err.message));
}

// ---------------------------------------------------
// 🛣️ 라우터 연결 구역
// ---------------------------------------------------
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');     
// const noticeRoutes = require('./routes/notices'); // 👈 동기가 완성할 때까지 주석 유지!

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);     
// app.use('/api/notices', noticeRoutes); // 👈 여기도 주석 유지!

// 크롤러 스케줄러 (에러 방지용 방어막)
try {
  require('./crawler/scheduler');
  console.log('✅ 크롤러 작동 시작!');
} catch (error) {
  console.log('⚠️ 크롤러 파일을 찾을 수 없어 건너뜁니다.');
}

// ---------------------------------------------------
// 🚨 에러 처리 구역
// ---------------------------------------------------
// 404 핸들러
app.use((req, res) => {
  console.log(`⚠️ 404 발생: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found', message: '찾으시는 주소가 서버에 없습니다.' });
});

// 500 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('🔥 서버 내부 에러:', err.message);
  res.status(err.status || 500).json({ error: err.name, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [ID: ${Math.floor(Math.random() * 1000)}] 서버가 포트 ${PORT}에서 작동 중입니다.`);
});