import React, { useState } from 'react';
import writecommentLogo from '../assets/writtencomment.png';
import { FaReply } from 'react-icons/fa';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const AnnounceDetail = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const data = {
    title: "글 제목",
    author: "본인",
    date: "2024.05.20",
    content: "글 내용입니다.",
    filename: "notice.pdf"
  };

  return (
    <main className="main-container">
      <div className="board-card large">
        <div className="board-header detail-header">
          <div className="header-left">
            <img src={writecommentLogo} alt="icon" className="header-icon-img" />
            <h2 className="board-title">글 내용</h2>
          </div>
          <button className="back-button" onClick={() => window.history.back()} style={{background:'none', border:'none', cursor:'pointer'}}>
             <FaReply style={{ transform: 'scaleX(-1)', color: '#ff6b00' }} />
          </button>
        </div>
        <div className="post-meta" style={{padding:'20px', borderBottom:'1px solid #eee'}}>
          <div><strong>제목 :</strong> {data.title}</div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
            <span><strong>작성자 :</strong> {data.author}</span>
            <span><strong>작성일 :</strong> {data.date}</span>
          </div>
        </div>
        <div className="board-content" style={{flex: 1, padding: '24px', display: 'flex', flexDirection: 'column'}}>
          <div style={{border:'1px solid #eee', borderRadius:'10px', padding:'20px', flex: 1, minHeight: '300px'}}>
            {data.content}
          </div>
        </div>
        <div className="footer" style={{padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div><strong>첨부파일 :</strong> {data.filename}</div>
          <button className="like-button" onClick={() => setLiked(!liked)}>
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>
        <div className="comment-wrapper">
          {isLoggedIn ? (
            <div className="comment-input-container">
              <textarea 
                className="comment-textarea"
                placeholder="댓글을 남겨보세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="comment-submit-row">
                <button className="comment-submit-btn">등록</button>
              </div>
            </div>
          ) : (
            <div className="comment-login-banner">
              <p>댓글을 작성하려면 <button onClick={() => navigate('/login')} className="login-link-btn">로그인</button>이 필요합니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AnnounceDetail;