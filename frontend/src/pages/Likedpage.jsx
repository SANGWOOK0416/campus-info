import React, { useEffect, useState } from 'react';
import heartLogo from '../assets/heart.png';

const Announce = () => {
  useEffect(() => {
  }, []);

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={heartLogo} alt="좋아요 남긴 글" className="header-icon-img" />
              <h2 className="board-title">좋아요 남긴 글</h2>
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