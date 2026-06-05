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
  RiAwardLine, RiEyeLine, RiEyeOffLine, RiBookReadLine
} from 'react-icons/ri';
import { FaUniversity, FaEye, FaBullseye, FaBus, FaLaptopCode } from 'react-icons/fa';
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

  // Smooth image slider interval
  useEffect(() => {
    const t = setInterval(() => {
      setImgFade(false);
      setTimeout(() => { 
        setCurrentImageIndex(p => (p + 1) % imagesLoader.length); 
        setImgFade(true); 
      }, 500); // slightly longer fade for smoothness
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);

  // --- INTEGRATED SPRING BOOT LOGIN LOGIC ---
  const handleLogin = async () => {
    if (!username || !password) { 
      toast.warning('Please fill in all fields.'); 
      return; 
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { 
        userId: username, 
        password: password 
      });

      const { token, role, name, profileImage } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);

      if (profileImage) {
        localStorage.setItem('profileImage', profileImage);
      }

      if (role === 'teacher' || role === 'admin') {
        localStorage.setItem('facultyId', username);
      } else {
        localStorage.setItem('studentId', username);
      }

      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      toast.success(`Welcome back, ${formattedName}!`);
      setTimeout(() => navigate('/index'), 2000);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid credentials. Please check your user ID and password.');
      } else {
        toast.error('Server error. Ensure your backend is running.');
      }
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

  const facilities = [
    { icon: <TbFlame />, title: "Sports Complex", desc: "Home to a world-class international standard cricket ground and indoor arenas." },
    { icon: <FaLaptopCode />, title: "Modern Labs", desc: "State-of-the-art laboratories for AI, ML, Data Science, and core engineering." },
    { icon: <RiBookReadLine />, title: "Central Library", desc: "Vast collection of physical volumes, e-journals, and digital resources." },
    { icon: <FaBus />, title: "Transport Fleet", desc: "Extensive bus network ensuring safe transit across Hyderabad and Secunderabad." }
  ];

  return (
    <div className="saas-root smooth-wrapper">
      <ToastContainer position="top-center" hideProgressBar theme="light" />

      {/* INJECTED STYLES FOR SMOOTHING & NEW FACILITIES UI */}
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
          
          /* Consistent Facilities Grid */
          .saas-facilities-wrap {
            padding: 5rem 2rem;
            background-color: var(--bg-secondary, #f8fafc);
          }
          .saas-facilities__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .saas-facility-card {
            background: #ffffff;
            padding: 2.5rem 2rem;
            border-radius: 16px;
            border: 1px solid rgba(0,0,0,0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
            position: relative;
            overflow: hidden;
          }
          .saas-facility-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
            border-color: rgba(0,0,0,0.1);
          }
          .saas-facility-icon {
            font-size: 2.5rem;
            color: #ff5722; /* Vibrant accent color */
            margin-bottom: 1.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: rgba(255, 87, 34, 0.1);
            border-radius: 12px;
            transition: transform 0.3s ease;
          }
          .saas-facility-card:hover .saas-facility-icon {
            transform: scale(1.1);
          }
          .saas-facility-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.75rem;
            letter-spacing: -0.01em;
          }
          .saas-facility-desc {
            color: #64748b;
            font-size: 0.95rem;
            line-height: 1.6;
          }
          
          /* Button smoothing */
          .saas-btn {
            transition: all 0.2s ease-in-out;
          }
          .saas-btn:active {
            transform: scale(0.98);
          }
        `}
      </style>

      {/* HEADER */}
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

      {/* HERO */}
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

      {/* STATS */}
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

      {/* ABOUT */}
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

      {/* FACILITIES (STYLED TO MATCH SAAS TEMPLATE) */}
      <section className="saas-facilities-wrap">
        <div className="saas-section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="saas-badge" style={{ margin: '0 auto' }}><RiAwardLine className="saas-badge__icon" /> Campus Life</div>
          <h2 className="saas-section-title">World-Class Facilities</h2>
        </div>
        <div className="saas-facilities__grid">
          {facilities.map((fac, idx) => (
            <div key={idx} className="saas-facility-card">
              <div className="saas-facility-icon">{fac.icon}</div>
              <h3 className="saas-facility-title">{fac.title}</h3>
              <p className="saas-facility-desc">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VISION & MISSION */}
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

      {/* LOGIN */}
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

      {/* FOOTER */}
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
