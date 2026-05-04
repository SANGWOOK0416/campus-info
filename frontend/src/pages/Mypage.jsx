import React from 'react';
import { Link } from 'react-router-dom';
import writtnLogo from '../assets/write.png';
import writtencommentsLogo from '../assets/writtencomment.png';
import heartLogo from '../assets/heart.png';

const BoardCard = ({ title, icon, isLarge, to }) => (
  <div className={`board-card ${isLarge ? 'large' : 'small'}`}>
    <div className="board-header">
      <Link to={to} className="header-left" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt={title} className="header-icon-img" />
        <h2 className="board-title">{title}</h2>
      </Link>
    </div>
    <div className="board-content"></div>
  </div>
);

const Mypage = () => {
  return (
    <main className="main-container">
      <div className="grid-layout">
        <BoardCard title="작성한 글" icon={writtnLogo} isLarge={true} to="/written" />
        <div className="side-boards" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <BoardCard title="작성한 댓글" icon={writtencommentsLogo} to="/writtencomment" />
          <BoardCard title="좋아요 남긴 글" icon={heartLogo} to="/liked" />
        </div>
      </div>
    </main>
  );
};

export default Mypage;