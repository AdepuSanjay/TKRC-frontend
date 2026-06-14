import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Homepage.css';

import { MdVerified } from 'react-icons/md';
import {
  RiUser3Line, RiLockPasswordLine, RiArrowRightLine,
  RiLoginBoxLine, RiShieldCheckLine, RiGroupLine, 
  RiCalendarCheckLine, RiBarChartBoxLine, RiTimeLine, 
  RiAwardLine, RiEyeLine, RiEyeOffLine
} from 'react-icons/ri';
import { FaUniversity, FaEye, FaBullseye } from 'react-icons/fa';
import { TbBuildingBank, TbFlame } from 'react-icons/tb';
import { IoLocationSharp } from 'react-icons/io5';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiAcademicCap } from 'react-icons/hi';

const Homepage = () => {
  const navigate = useNavigate();

  const imagesLoader = [
    "./images/campus.webp",
    "./images/collage4.jpg",
    "./images/collage2.jpg",
    "./images/collage1.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgFade, setImgFade] = useState(true);
  const [loading, setLoading] = useState(false);

  // NEW: State to hold inline feedback messages
  const [loginMessage, setLoginMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const t = setInterval(() => {
      setImgFade(false);
      setTimeout(() => { 
        setCurrentImageIndex(p => (p + 1) % imagesLoader.length); 
        setImgFade(true); 
      }, 500); 
    }, 5000);
    return () => clearInterval(t);
  }, [imagesLoader.length]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);

  // --- INTEGRATED SPRING BOOT LOGIN LOGIC ---
  const handleLogin = async () => {
    // Clear previous messages
    setLoginMessage({ type: '', text: '' });

    if (!username || !password) { 
      const msg = 'Please fill in both username and password.';
      setLoginMessage({ type: 'warning', text: msg });
      toast.warning(msg); 
      return; 
    }

    setLoading(true);

    try {
      const response = await axios.post('https://tkrc-backend-lreo.onrender.com/api/auth/login', { 
        userId: username, 
        password: password 
      });

      const { token, role, name, profileImage, userId } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);

      if (profileImage) {
        localStorage.setItem('profileImage', profileImage);
      }

      if (role === 'teacher' || role === 'admin') {
        localStorage.setItem('facultyId', userId);
        localStorage.removeItem('studentId'); 
      } else {
        localStorage.setItem('studentId', userId);
        localStorage.removeItem('facultyId'); 
      }

      const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : 'User';
      const successMsg = `Login successful! Welcome back, ${formattedName}. Redirecting...`;
      
      // Trigger both inline message and toast for success
      setLoginMessage({ type: 'success', text: successMsg });
      toast.success(successMsg);
      
      setTimeout(() => navigate('/index'), 2000);

    } catch (error) {
      // Robust error handling to catch exact backend messages or fallback to generic
      let errorMsg = 'Server error. Ensure your backend is running.';
      
      if (error.response) {
        // Look for standard Spring Boot error message formats
        errorMsg = error.response.data?.message || error.response.data?.error || 'Invalid credentials. Please check your user ID and password.';
      } else if (error.request) {
        errorMsg = 'Network error. Please check your internet connection or server status.';
      }

      // Trigger both inline message and toast for error
      setLoginMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
      
    } finally { 
      setLoading(false); 
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: <TbBuildingBank />, num: '20+',    label: 'Acre Campus'  },
    { icon: <MdVerified />,     num: 'NAAC A', label: 'Grade Accredited' },
    { icon: <RiAwardLine />,    num: 'UGC',    label: 'Autonomous'   },
    { icon: <RiGroupLine />,    num: '5000+',  label: 'Students'     },
  ];

  const features = [
    { icon: <RiCalendarCheckLine />, label: 'Attendance Tracking'  },
    { icon: <RiBarChartBoxLine />,   label: 'Academic Results'     },
    { icon: <RiTimeLine />,          label: 'Timetable & Schedule' },
    { icon: <RiShieldCheckLine />,   label: 'Secure Access'        },
  ];

  const missions = [
    'Ensuring excellent branch-wise infrastructural facilities',
    'Making the institute a premier research and resource centre',
    'Fostering strong industry-academia partnerships',
    'Nurturing holistic development of every student',
  ];

  // Dynamic styling for the inline message box
  const getAlertStyle = (type) => {
    const baseStyle = { padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: '500' };
    switch (type) {
      case 'error': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171' };
      case 'success': return { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #4ade80' };
      case 'warning': return { ...baseStyle, backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #facc15' };
      default: return { display: 'none' };
    }
  };

  return (
    <div className="saas-root smooth-wrapper">
      {/* Increased z-index to ensure Toasts are always on top */}
      <ToastContainer position="top-center" hideProgressBar theme="light" style={{ zIndex: 9999 }} />

      <style>
        {`
          .smooth-wrapper {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .saas-hero__img {
            transition: opacity 0.5s ease-in-out;
          }
          .saas-btn {
            transition: all 0.2s ease-in-out;
          }
          .saas-btn:active {
            transform: scale(0.98);
          }
        `}
      </style>

      <header className="saas-header">
        <div className="saas-header__inner">
          <div className="saas-header__brand">
            <img className="saas-header__logo" src="./images/logo.png" alt="TKRCET Logo" style={{ height: '40px' }} />
            <span className="saas-header__title">TKRCET</span>
          </div>
          <div className="saas-header__actions">
            <span className="saas-pill"><IoLocationSharp /> Meerpet, Hyderabad</span>
            <button className="saas-btn saas-btn--outline" onClick={scrollToLogin}>Login</button>
          </div>
        </div>
      </header>

      <section className="saas-hero">
        <div className="saas-hero__content">
          <div className="saas-badge">
            <TbFlame className="saas-badge__icon" /> Welcome to TKRCET
          </div>
          <h1 className="saas-hero__title">
            Shaping Tomorrow's<br />Engineers Today
          </h1>
          <p className="saas-hero__subtitle">
            UGC Autonomous · NAAC 'A' Grade · NBA Accredited · Excellence since 2002.
          </p>
          <div className="saas-hero__actions">
            <button className="saas-btn saas-btn--primary" onClick={scrollToLogin}>
              Login to Portal <RiArrowRightLine />
            </button>
          </div>
        </div>

        <div className="saas-hero__visual">
          <img 
            className={`saas-hero__img ${imgFade ? 'in' : ''}`} 
            src={imagesLoader[currentImageIndex]} 
            alt="Campus" 
            style={{ maxWidth: '85%', height: 'auto', margin: '0 auto', display: 'block', borderRadius: '16px' }}
          />
          <div className="saas-hero__dots" style={{ justifyContent: 'center', marginTop: '10px' }}>
            {imagesLoader.map((_, i) => (
              <button key={i} className={`saas-hero__dot ${i === currentImageIndex ? 'on' : ''}`} onClick={() => setCurrentImageIndex(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="saas-stats">
        <div className="saas-stats__grid">
          {stats.map((s, i) => (
            <div className="saas-stat-card" key={i}>
              <div className="saas-stat-card__icon">{s.icon}</div>
              <strong className="saas-stat-card__num">{s.num}</strong>
              <span className="saas-stat-card__lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="saas-about">
        <div className="saas-about__inner">
          <div className="saas-badge saas-badge--white"><FaUniversity className="saas-badge__icon" /> About Us</div>
          <h2 className="saas-section-title">About TKRCET Campus</h2>
          <div className="saas-about__content">
            <p>TKR College of Engineering and Technology (TKRCET) was established in 2002 in a sprawling, lush green 20-acre campus at Meerpet, Hyderabad. Conferred with <strong>UGC Autonomous status</strong> and accredited by <strong>NAAC with an 'A' Grade</strong>, the college provides a serene environment, preparing students to face global competition.</p>
            <p>Founded by Sri Teegala Krishna Reddy — Mayor of Hyderabad and a visionary philanthropist — TKRCET is driven by the mission to make quality education accessible, bridging the rural-urban divide while upholding ethical standards.</p>
            <p>The college offers cutting-edge B.Tech programmes in <strong>CSE, AI & ML, Data Science, IT, ECE, EEE, Civil, and Mechanical Engineering</strong>, alongside PG courses in M.Tech and MBA. Many of our core programs are <strong>NBA Accredited</strong>, and the institution is proudly affiliated to JNTUH and approved by AICTE.</p>
          </div>
        </div>
      </section>

      <section className="saas-vm">
        <div className="saas-vm__grid">
          <div className="saas-vm__card">
            <div className="saas-vm__icon"><FaEye /></div>
            <h3>Institution Vision</h3>
            <p>To be a premier institution of excellence — empowering students with knowledge, skills, and ethical values to become innovative engineers and leaders who contribute meaningfully to society and the nation.</p>
          </div>

          <div className="saas-vm__card saas-vm__card--mint">
            <div className="saas-vm__icon"><FaBullseye /></div>
            <h3>Institution Mission</h3>
            <ul className="saas-vm__list">
              {missions.map((m, i) => (
                <li key={i}><BsCheck2Circle className="saas-list-check" /> <span>{m}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="login-section" className="saas-login">
        <div className="saas-login__container">
          <div className="saas-login__text">
            <div className="saas-badge saas-badge--dark"><RiLoginBoxLine className="saas-badge__icon" /> Portal Access</div>
            <h2>Login to<br/>Your Account</h2>
            <p>Access your full academic dashboard — attendance, results, timetable and more. Available for both students and faculty.</p>
            <ul className="saas-login__feats">
              {features.map((f, i) => (
                <li key={i}>
                  <div className="saas-feat-icon">{f.icon}</div>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="saas-login__box">
            <div className="saas-login__header">
              <HiAcademicCap className="saas-login__icon" />
              <div>
                <p className="saas-login__eyebrow">Student & Faculty Portal</p>
                <h3>Welcome Back</h3>
              </div>
            </div>

            {/* INLINE ALERT MESSAGE: Guarantees the user sees the response */}
            {loginMessage.text && (
              <div style={getAlertStyle(loginMessage.type)}>
                {loginMessage.text}
              </div>
            )}

            <div className="saas-field">
              <label><RiUser3Line /> Username / Roll Number</label>
              <input type="text" placeholder="e.g. FAC2026 or 20A81A0501" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} autoComplete="username" />
            </div>

            <div className="saas-field">
              <label><RiLockPasswordLine /> Password</label>
              <div className="saas-field__pw">
                <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} disabled={loading} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button className="saas-btn saas-btn--primary saas-btn--full" onClick={handleLogin} disabled={loading}>
              {loading ? <span className="saas-spin" /> : <>Login to Portal <RiArrowRightLine /></>}
            </button>

            <p className="saas-login__secure"><RiShieldCheckLine /> Secure & encrypted connection</p>
          </div>
        </div>
      </section>

      <footer className="saas-footer">
        <div className="saas-footer__inner">
          <div className="saas-footer__brand">
            <img className="saas-footer__logo" src="./images/logo.png" alt="TKRCET" style={{ height: '30px' }} />
            <div>
              <p className="saas-footer__name">TKRCET</p>
              <p className="saas-footer__tag">Engineering Excellence Since 2002</p>
            </div>
          </div>
          <div className="saas-footer__links">
            <p>© 2024 TKR College of Engineering & Technology. All Rights Reserved.</p>
            <p>Designed & Developed by Mr. Md. Shakeel (TKRES)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
