const { auth } = require('express-oauth2-jwt-bearer');

// 1. Auth0 도장 검사 설정 (audience 완벽 적용)
const checkJwt = auth({
  // 환경변수가 있으면 그걸 쓰고, 없으면 뒤에 있는 기본 주소를 쓰도록 안전하게 세팅
  audience: process.env.AUTH0_AUDIENCE || 'https://campus-info-api',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-fbp6urdelvw2mwig.us.auth0.com/', 
  tokenSigningAlg: 'RS256'
  // jwksUri는 issuerBaseURL이 있으면 라이브러리가 알아서 찾아오므로 생략해도 됨
});

// 2.커스텀 문지기 로직 (에러 처리 & 로그)
const authMiddleware = (req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      console.error('❌ [인증 실패]:', err.message);
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: '유효하지 않은 토큰입니다.',
        detail: err.message
      });
    }

    // 인증 통과 시, 뒤에 있는 로직(sync 등)에서 쓸 수 있도록 req.user에 정보 세팅
    req.user = req.auth.payload;
    console.log(`✅ [인증 성공]: 유저(${req.user.sub}) 접속`);
    next();
  });
};

module.exports = authMiddleware;