import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="동국대학교 로고" />
        </Link>

        <div className="navLinks">
          <Link to="/announce"><span>공지사항</span></Link>
          <Link to="/majorcommunity"><span>전공 게시판</span></Link>
          <Link to="/gradecommunity"><span>학년 게시판</span></Link>
          <Link to="/mypage"><span>마이 페이지</span></Link>
          <Link to="/login"><button className="loginBtn">{isLoggedIn ? 'Logout' : 'Login'}</button></Link>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {isOpen && <div className="invisible-overlay" onClick={closeMenu}></div>}

        <div className={`mobileMenu ${isOpen ? 'active' : ''}`}>
          <div className="mobileMenuLinks">
            <Link to="/announce" onClick={closeMenu}><span>공지사항</span></Link>
            <Link to="/majorcommunity" onClick={closeMenu}><span>전공 게시판</span></Link>
            <Link to="/gradecommunity" onClick={closeMenu}><span>학년 게시판</span></Link>
            <Link to="/mypage" onClick={closeMenu}><span>마이 페이지</span></Link>
          </div>
          <Link to="/login" onClick={closeMenu}>
            {/* 로그인 여부에 따라 텍스트 변경 */}
            <button className="mobileLoginBtn">{isLoggedIn ? 'Logout' : 'Login'}</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;