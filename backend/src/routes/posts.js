// TODO: express, Post 모델, authMiddleware import

// GET /api/posts — 게시글 목록 조회
// query: ?page=1&limit=10
// TODO: 페이지네이션 적용하여 목록 반환

// POST /api/posts — 게시글 작성 (인증 필요)
// body: { title, content }
// TODO: authMiddleware 적용
// TODO: req.user.id를 author로 사용하여 Post 생성 및 저장

// GET /api/posts/:id — 게시글 상세 조회
// TODO: author populate하여 단건 반환

// PATCH /api/posts/:id — 게시글 수정 (인증 필요, 작성자 본인만)
// body: { title?, content? }
// TODO: authMiddleware 적용
// TODO: 게시글 조회 후 author 일치 여부 확인 후 수정

// DELETE /api/posts/:id — 게시글 삭제 (인증 필요, 작성자 본인만)
// TODO: authMiddleware 적용
// TODO: 게시글 조회 후 author 일치 여부 확인 후 삭제

// TODO: router export

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Read: 게시글 목록 조회

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // is_deleted가 false인 정상 게시글만 최신순으로 가져오기
    const posts = await Post.find({ is_deleted: false })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('user_id', 'name major grade') // 작성자의 이름, 전공, 학년 정보 포함
      .sort({ created_at: -1 });

    const total = await Post.countDocuments({ is_deleted: false });
    
    res.status(200).json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: '게시글 목록을 불러오지 못했습니다.', error: error.message });
  }
});

// Read: 게시글 상세 조회

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, is_deleted: false })
      .populate('user_id', 'name major grade');

    if (!post) {
      return res.status(404).json({ message: '존재하지 않거나 삭제된 게시글입니다.' });
    }

    // 상세 조회 시 조회수 1 증가
    post.view_count += 1;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '게시글 상세 조회에 실패했습니다.', error: error.message });
  }
});


// Create: 게시글 작성 (Auth0 인증 필요)

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, board_id } = req.body;
    
    // Auth0 토큰(req.auth.payload.sub)으로 DB의 진짜 유저(_id) 찾기
    const user = await User.findOne({ auth0_id: req.auth.payload.sub });
    if (!user) {
      return res.status(401).json({ message: 'DB에 등록되지 않은 사용자입니다. 먼저 동기화해주세요.' });
    }

    const newPost = new Post({
      title,
      content,
      board_id,
      user_id: user._id // 찾은 유저의 MongoDB 고유 ID를 작성자로 등록
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '게시글 작성에 실패했습니다.', error: error.message });
  }
});

// Update: 게시글 부분 수정 (Auth0 인증 및 본인 확인 필요)

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.is_deleted) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const user = await User.findOne({ auth0_id: req.auth.payload.sub });
    
    // 작성자 본인인지 확인
    if (post.user_id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
    }

    // 들어온 데이터만 업데이트
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '게시글 수정에 실패했습니다.', error: error.message });
  }
});

// Delete: 게시글 삭제 (Soft Delete 처리)

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.is_deleted) {
      return res.status(404).json({ message: '이미 삭제되었거나 찾을 수 없는 게시글입니다.' });
    }

    const user = await User.findOne({ auth0_id: req.auth.payload.sub });

    // 작성자 본인인지 확인
    if (post.user_id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
    }

    // 물리적 삭제 대신 is_deleted 플래그만 true로 변경 (Soft Delete)
    post.is_deleted = true;
    await post.save();

    res.status(204).send(); // 성공적으로 처리되었으나 돌려줄 본문이 없을 때 204 사용
  } catch (error) {
    res.status(500).json({ message: '게시글 삭제에 실패했습니다.', error: error.message });
  }
});

const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { notifyNewComment } = require('../notifications/sseManager');

// 댓글 작성 (Auth0 인증 필요)

router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ auth0_id: req.auth.payload.sub });
    const post = await Post.findById(req.params.id);

    if (!post || post.is_deleted) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    const newComment = new Comment({
      post_id: post._id,
      user_id: user._id,
      content: req.body.content
    });

    await newComment.save();

    // 본인 게시글에 본인이 댓글 달면 알림 제외
    if (post.user_id.toString() !== user._id.toString()) {
      notifyNewComment(post.user_id, newComment);
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: '댓글 작성에 실패했습니다.', error: error.message });
  }
});


// 좋아요 토글 (Auth0 인증 필요)

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ auth0_id: req.auth.payload.sub });
    const post = await Post.findById(req.params.id);

    if (!post || post.is_deleted) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await Like.findOne({ post_id: post._id, user_id: user._id });

    if (existingLike) {
      // 이미 눌렀다면 좋아요 취소 (-1)
      await existingLike.deleteOne();
      post.like_count = Math.max(0, post.like_count - 1);
      await post.save();
      return res.status(200).json({ message: '좋아요가 취소되었습니다.', like_count: post.like_count });
    } else {
      // 안 눌렀다면 좋아요 추가 (+1)
      const newLike = new Like({ post_id: post._id, user_id: user._id });
      await newLike.save();
      post.like_count += 1;
      await post.save();
      return res.status(200).json({ message: '좋아요가 반영되었습니다.', like_count: post.like_count });
    }
  } catch (error) {
    res.status(500).json({ message: '좋아요 처리에 실패했습니다.', error: error.message });
  }
});

module.exports = router;