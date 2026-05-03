import React from 'react';
import { Link } from 'react-router-dom';
import announceLogo from '../assets/announce.png';
import communityLogo from '../assets/community.png';

const BoardCard = ({ title, icon, isLarge, children, to }) => (
  <div className={`board-card ${isLarge ? 'large' : 'small'}`}>
    <div className="board-header">
      <Link to={to} className="header-left" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt={title} className="header-icon-img" />
        <h2 className="board-title">{title}</h2>
      </Link>
    </div>
    <div className="board-content">{children}</div>
  </div>
);

const Home = () => {
  return (
    <main className="main-container">
      <div className="grid-layout">
        <BoardCard title="공지사항" icon={announceLogo} isLarge={true} to="/announce" />
        <div className="side-boards" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <BoardCard title="전공 게시판" icon={communityLogo} to="/majorcommunity" />
          <BoardCard title="학년 게시판" icon={communityLogo} to="/gradecommunity" />
        </div>
      </div>
    </main>
  );
};

export default Home;