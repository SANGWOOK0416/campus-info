const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addClient, removeClient } = require('../notifications/sseManager');
const User = require('../models/User');

// GET /api/notifications/stream — SSE 연결
router.get('/stream', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ auth0_id: req.user.sub });
    if (!user) {
      return res.status(401).json({ message: 'DB에 등록되지 않은 사용자입니다.' });
    }

    const userId = user._id.toString();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    addClient(userId, res);

    // 연결 확인용 초기 이벤트
    res.write(`event: connected\n`);
    res.write(`data: ${JSON.stringify({ message: '알림 연결 성공' })}\n\n`);

    req.on('close', () => {
      removeClient(userId);
    });
  } catch (error) {
    res.status(500).json({ message: 'SSE 연결에 실패했습니다.', error: error.message });
  }
});

module.exports = router;
