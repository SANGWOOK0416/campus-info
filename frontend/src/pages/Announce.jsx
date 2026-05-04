import React, { useEffect, useState } from 'react';
import announceLogo from '../assets/announce.png';

const Announce = () => {
  useEffect(() => {
  }, []);

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={announceLogo} alt="공지사항" className="header-icon-img" />
              <h2 className="board-title">공지사항</h2>
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