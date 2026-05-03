import React, { useEffect, useState } from 'react';
import writtencommentLogo from '../assets/writtencomment.png';

const Announce = () => {
  useEffect(() => {
  }, []);

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={writtencommentLogo} alt="작성한 댓글" className="header-icon-img" />
              <h2 className="board-title">작성한 댓글</h2>
            </div>
          </div>
          <div className="board-content">

          </div>
        </div>
      </div>
    </main>
  );
};

export default Announce;