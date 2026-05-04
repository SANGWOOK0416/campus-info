import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // 동일한 CSS 사용
import logImg from '../assets/logimg.jpg';
import donggukLogo from '../assets/logo.png';

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="loginContainer">
      <div className="whiteBox">
        <div className="leftImage">
          <img src={logImg} alt="Signup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div className="rightForm">
          <img src={donggukLogo} alt="Logo" style={{ width: '250px', marginBottom: '20px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <input type="text" placeholder="이메일" />
            <input type="text" placeholder="아이디" />
            <input type="text" placeholder="닉네임" />
            <input type="password" placeholder="비밀번호" />
            
            <button className="btnPrimary">계정 만들기</button>
            
            <button 
              className="btnGoogle" 
              onClick={() => navigate('/login')} 
              style={{ marginTop: '10px' }}
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;