// TODO: express, User 모델, jsonwebtoken, bcryptjs import

// POST /api/auth/register — 회원가입
// body: { username, email, password }
// TODO: 이메일 중복 체크
// TODO: User 생성 및 저장 (비밀번호는 User 모델에서 자동 해싱)
// TODO: JWT 발급 후 응답

// POST /api/auth/login — 로그인
// body: { email, password }
// TODO: 이메일로 유저 조회
// TODO: 비밀번호 비교 (bcrypt)
// TODO: JWT 발급 후 응답

// TODO: router export

const express = require('express');
const router = express.Router();

// 아까 만든 문지기(middleware)와 유저(User) 모델을 데려옴
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// POST /api/auth/sync
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const auth0_id = req.user.sub;
    
    // [추가된 부분] 클라이언트가 Body에 담아 보낸 정보들을 꺼내옴
    const { email, name, major, grade, student_id } = req.body;

    let user = await User.findOne({ auth0_id: auth0_id });

    if (!user) {
      // [수정된 부분] 내 DB에 없으면 새로 가입할 때 필수 정보들을 다 넣어서 생성
      user = new User({ 
        auth0_id: auth0_id,
        email: email,
        name: name,
        major: major,
        grade: grade,
        student_id: student_id
      });
      await user.save();
      console.log('✅ [Sync] 새로운 유저 DB 등록 완료!');
      return res.status(201).json({ message: '회원가입 및 동기화 완료', user });
    }

    // 이미 가입되어 있으면 통과
    console.log('✅ [Sync] 기존 유저 동기화 완료!');
    res.status(200).json({ message: '동기화 완료', user });

  } catch (error) {
    console.error('🔥 [Sync] 에러 발생:', error.message);
    res.status(500).json({ message: '동기화 중 서버 에러가 발생했습니다.', error: error.message });
  }
});

module.exports = router;