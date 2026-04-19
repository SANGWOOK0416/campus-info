const { auth } = require('express-oauth2-jwt-bearer');

// 1. Auth0 도장 검사 설정
const checkJwt = auth({
  audience: 'https://campus-info-api',
  issuerBaseURL: 'https://dev-fbp6urdelvw2mwig.us.auth0.com/', 
  jwksUri: 'https://dev-fbp6urdelvw2mwig.us.auth0.com/.well-known/jwks.json',
  tokenSigningAlg: 'RS256'
});

// 2. 문지기 로직
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

    req.user = req.auth.payload;
    console.log(`✅ [인증 성공]: 유저(${req.user.sub}) 접속`);
    next();
  });
};

module.exports = authMiddleware;