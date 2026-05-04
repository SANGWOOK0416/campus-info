import React, { useState } from 'react';
import announceLogo from '../assets/announce.png';
import { FaReply } from 'react-icons/fa';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const AnnounceDetail = () => {
  const [liked, setLiked] = useState(false);
  const data = {
    title: "공지사항 제목",
    author: "관리자",
    date: "2024.05.20",
    content: "공지사항 내용입니다.",
    filename: "notice.pdf"
  };

  return (
    <main className="main-container">
      <div className="board-card large">
        <div className="board-header detail-header">
          <div className="header-left">
            <img src={announceLogo} alt="icon" className="header-icon-img" />
            <h2 className="board-title">공지사항</h2>
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
          <div style={{border:'1px solid #eee', borderRadius:'10px', padding:'20px', flex: 1}}>
            {data.content}
          </div>
        </div>
        <div className="footer" style={{padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div><strong>첨부파일 :</strong> {data.filename}</div>
          <button className="like-button" onClick={() => setLiked(!liked)}>
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AnnounceDetail;