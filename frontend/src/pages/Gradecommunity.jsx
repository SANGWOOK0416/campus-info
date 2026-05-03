import React, { useEffect } from 'react';
import communityLogo from '../assets/community.png';

const GradeBoard = () => {
  useEffect(() => {
  }, []);

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={communityLogo} alt="학년 게시판" className="header-icon-img" />
              <h2 className="board-title">학년 게시판</h2>
            </div>
          </div>
          <div className="board-content">
          </div>
        </div>
      </div>
    </main>
  );
};

export default GradeBoard;