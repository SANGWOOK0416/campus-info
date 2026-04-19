// TODO: jsonwebtoken import

// JWT 인증 미들웨어
// Authorization 헤더에서 Bearer 토큰을 추출하고 검증합니다.

// TODO: req.headers['authorization']에서 토큰 추출 ("Bearer <token>")

// TODO: 토큰이 없으면 401 응답

// TODO: jwt.verify로 토큰 검증 (process.env.JWT_SECRET 사용)

// TODO: 검증된 payload를 req.user에 저장 후 next() 호출

// TODO: 검증 실패 시 403 응답

// TODO: authMiddleware export

const { auth } = require('express-oauth2-jwt-bearer');

const authMiddleware = (req, res, next) => {
  // 1. 설정값 정의
  const audience = 'https://campus-info-api';
  const issuerBaseURL = 'https://dev-fbp6urdelvw2mwig.us.auth0.com/';

  console.log('--- 🔍 인증 시도 로그 ---');
  console.log('1. 설정된 Audience:', audience);
  console.log('2. 설정된 Issuer:', issuerBaseURL);
  
  // 2. 실제 인증 수행
  return auth({
    audience: audience,
    issuerBaseURL: issuerBaseURL,
    tokenSigningAlg: 'RS256',
  })(req, res, (err) => {
    if (err) {
      console.log('❌ 인증 실패 상세 사유:', err.message);
      // 만약 401이 뜨면, Auth0에서 공개키를 제대로 못 가져온 경우가 많아.
      if (err.inner) console.log('➡️ 내부 에러 메시지:', err.inner.message);
      return res.status(401).json({ error: err.message });
    }
    console.log('✅ 인증 성공!');
    next();
  });
};

module.exports = authMiddleware;