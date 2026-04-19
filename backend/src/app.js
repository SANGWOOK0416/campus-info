// TODO: express, mongoose, cors, dotenv import

// TODO: Express 앱 초기화

// TODO: cors, express.json() 미들웨어 등록

// TODO: /api/auth, /api/posts, /api/notices 라우트 연결

// TODO: MongoDB 연결 (process.env.MONGO_URI)

// TODO: 크롤러 스케줄러 시작 (./crawler/scheduler)

// TODO: process.env.PORT로 서버 listen
require('dotenv').config();

const express = require('express');
const app = express();

// 1. "손님들(프론트엔드)이 주는 JSON 데이터를 읽을 수 있게 준비해 둬!"
app.use(express.json());

// 2. "이 주소(/api/auth)로 오면 문지기(Auth0)한테 검사받게 해!"
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 3. 🚨 가장 중요한 핵심 🚨 (서버를 안 꺼지게 하는 마법의 코드)
// "5000번 포트 문 열어두고, 누가 요청 보낼 때까지 계속 켜져서 기다려!"
app.listen(5000, () => {
  console.log('🚀 서버가 포트 5000에서 작동 중입니다.');
});