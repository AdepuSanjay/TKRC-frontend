import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Homepage.css';

import { MdSchool, MdVerified } from 'react-icons/md';
import {
  RiUser3Line, RiLockPasswordLine, RiArrowRightLine,
  RiLoginBoxLine, RiShieldCheckLine, RiMedalLine,
  RiGroupLine, RiCalendarCheckLine, RiBarChartBoxLine, 
  RiTimeLine, RiTeamLine, RiAwardLine, RiEyeLine, RiEyeOffLine,
} from 'react-icons/ri';
import { FaUniversity, FaEye, FaBullseye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TbBuildingBank, TbFlame } from 'react-icons/tb';
import { BiSolidQuoteLeft } from 'react-icons/bi';
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

  const delegateInfo = {
    chairman: {
      name: "Sri Teegala Krishna Reddy",
      role: "Chairman",
      photo: "../images/tkrcet-chairman.webp",
      description: "TKRCET has grown in leaps and bounds through the collaborative effort of Management, Staff and Students. My vision is to see every student excel while upholding the moral values that define our institution's character and enduring legacy.",
    },
    secretary: {
      name: "Dr. T. Harinath Reddy",
      role: "Secretary",
      photo: "../images/tkrcet-secretary.webp",
      description: "Engineers play the most vital role in nation building. TKRES is committed to providing world-class technical education, empowering students to become leaders who contribute to both the nation and the global community.",
    },
    treasurer: {
      name: "Sri. T. Amaranath Reddy",
      role: "Treasurer",
      photo: "../images/tkres-treasurer1.webp",
      description: "Our emphasis is not only on academic excellence but the holistic development of a student's personality. We ensure new ideas are not merely discussed but executed, turning every student's promise into remarkable achievement.",
    },
    principal: {
      name: "Dr. D. V. Ravi Shankar",
      role: "Principal",
      photo: "../images/tkr-principal.webp",
      description: "With M.Tech from NIT Suratkal and Ph.D from JNTUH, I bring 23 years of academic distinction. My goal is to foster an environment where curiosity thrives, innovation flourishes, and every student reaches their full potential.",
    },
    dean: {
      name: "Dr. A. Suresh Rao",
      role: "Vice Principal & Dean",
      photo: "../images/suresh_cse.webp",
      description: "Holding a Ph.D from NIT Warangal, I oversee academics with a commitment to excellence. My 20 years bridging industry and academia ensures our curriculum remains rigorous, relevant, and aligned with global industry demands.",
    },
    coe: {
      name: "Dr. D. Nageshwar Rao",
      role: "Controller of Examinations",
      photo: "../images/coe.webp",
      description: "With a Ph.D in VLSI from GITAM University and 20 years of teaching experience, I ensure examination integrity and academic standards. My research and industry interactions keep our academic processes truly world-class.",
    },
  };

  const delegateKeys = Object.keys(delegateInfo);
  const [currentDelegateIndex, setCurrentDelegateIndex] = useState(0);
  const [delegateFade, setDelegateFade] = useState(true);
  const delegateTimerRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setImgFade(false);
      setTimeout(() => { setCurrentImageIndex(p => (p + 1) % imagesLoader.length); setImgFade(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, [imagesLoader.length]);

  const doSwitchDelegate = (nextIndex) => {
    setDelegateFade(false);
    setTimeout(() => { setCurrentDelegateIndex(nextIndex); setDelegateFade(true); }, 250);
  };

  useEffect(() => {
    clearInterval(delegateTimerRef.current);
    delegateTimerRef.current = setInterval(() => {
      doSwitchDelegate((currentDelegateIndex + 1) % delegateKeys.length);
    }, 6000);
    return () => clearInterval(delegateTimerRef.current);
  }, [currentDelegateIndex, delegateKeys.length]);

  const handlePrev = () => doSwitchDelegate((currentDelegateIndex - 1 + delegateKeys.length) % delegateKeys.length);
  const handleNext = () => doSwitchDelegate((currentDelegateIndex + 1) % delegateKeys.length);
  const handleTab  = (i) => { if (i !== currentDelegateIndex) doSwitchDelegate(i); };

  const currentDelegate = delegateInfo[delegateKeys[currentDelegateIndex]];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);

  // Updated Unified Login Function for Spring Boot backend
  const handleLogin = async () => {
    if (!username || !password) { 
      toast.warning('Please fill in all fields.'); 
      return; 
    }
    
    setLoading(true);
    
    try {
      // Connect to your new Spring Boot endpoint deployed on Render
      const response = await axios.post('https://my-section-data-api.onrender.com/api/auth/login', { 
        userId: username, 
        password: password 
      });

      const data = response.data; // Extract JSON payload { token, role, name, profileImage }

      // Store JWT token and generic user info globally
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);
      
      if (data.profileImage) {
        localStorage.setItem('profileImage', data.profileImage);
      }

      // Store role-specific IDs so the rest of your app routes properly
      if (data.role === 'teacher') {
        localStorage.setItem('facultyId', username);
      } else {
        localStorage.setItem('studentId', username);
      }

      toast.success(`Welcome, ${data.name}!`);
      setTimeout(() => navigate('/index'), 2000);

    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error("Login Failed:", error.response?.data || error.message);
    } finally { 
      setLoading(false); 
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: <TbBuildingBank />, num: '20+',   label: 'Acre Campus'  },
    { icon: <MdSchool />,       num: '7+',    label: 'UG Programs'  },
    { icon: <RiGroupLine />,    num: '5000+', label: 'Students'     },
    { icon: <RiAwardLine />,    num: 'AICTE', label: 'Approved'     },
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

  return (
    <div className="saas-root">
      <ToastContainer position="top-center" hideProgressBar theme="light" />

      {/* HEADER */}
      <header className="saas-header">
        <div className="saas-header__inner">
          <div className="saas-header__brand">
            <img className="saas-header__logo" src="./images/logo.png" alt="TKRCET Logo" />
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
            20 acres of serene campus · world-class faculty · excellence since 2002.
          </p>
          <div className="saas-hero__actions">
            <button className="saas-btn saas-btn--primary" onClick={scrollToLogin}>
              Login to Portal <RiArrowRightLine />
            </button>
          </div>
        </div>

        <div className="saas-hero__visual">
          <img className={`saas-hero__img ${imgFade ? 'in' : ''}`} src={imagesLoader[currentImageIndex]} alt="Campus" />
          <div className="saas-hero__dots">
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
            <p>TKR College of Engineering and Technology was established in 2002 in a sprawling, lush green 20-acre campus at Meerpet, Hyderabad. The college provides a serene and tranquil environment, preparing students in every aspect to face global competition with confidence and emerge victorious.</p>
            <p>Founded by Sri Teegala Krishna Reddy — Mayor of Hyderabad and a visionary philanthropist — TKRCET is driven by the mission to make quality education accessible to every student, bridging the rural-urban divide while upholding the highest moral and ethical standards.</p>
            <p>The college offers seven UG programmes in Civil, EEE, CSE, ECE, and Mechanical Engineering, along with PG courses in M.Tech (CSE, PE) and MBA. Affiliated to JNTUH, approved by AICTE, New Delhi, and recognized by the Government of Telangana.</p>
          </div>
        </div>
      </section>

      {/* DELEGATES */}
      <section className="saas-delegates">
        <div className="saas-section-header">
          <div className="saas-badge"><RiTeamLine className="saas-badge__icon" /> Leadership</div>
          <h2 className="saas-section-title">Our Magnificent Delegates</h2>
        </div>

        <div className="saas-delegates__tabs-scroll">
          <div className="saas-delegates__tabs">
            {delegateKeys.map((key, i) => (
              <button key={key} className={`saas-tab ${i === currentDelegateIndex ? 'on' : ''}`} onClick={() => handleTab(i)}>
                {delegateInfo[key].role}
              </button>
            ))}
          </div>
        </div>

        <div className={`saas-delegates__content ${delegateFade ? 'in' : ''}`}>
          <div className="saas-delegates__photo-wrapper">
            <img className="saas-delegates__img" src={currentDelegate.photo} alt={currentDelegate.name} />
            <div className="saas-delegates__nav">
              <button onClick={handlePrev}><FaChevronLeft /></button>
              <span>{currentDelegateIndex + 1} / {delegateKeys.length}</span>
              <button onClick={handleNext}><FaChevronRight /></button>
            </div>
          </div>
          <div className="saas-delegates__info">
            <BiSolidQuoteLeft className="saas-quote-icon" />
            <span className="saas-delegates__role">{currentDelegate.role}</span>
            <h3 className="saas-delegates__name">{currentDelegate.name}</h3>
            <p className="saas-delegates__desc">{currentDelegate.description}</p>
            <div className="saas-delegates__badges">
              <span className="saas-del-badge"><RiMedalLine /> Leadership</span>
              <span className="saas-del-badge"><RiShieldCheckLine /> Verified</span>
            </div>
          </div>
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
              <input type="text" placeholder="e.g. D600 or 20A81A0501" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} autoComplete="username" />
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
            <img className="saas-footer__logo" src="./images/logo.png" alt="TKRCET" />
            <div>
              <p className="saas-footer__name">TKRCET</p>
              <p className="saas-footer__tag">Engineering Excellence Since 2002</p>
            </div>
          </div>
          <div className="saas-footer__links">
            <p>© 2024 TKR College of Engineering & Technology.</p>
            <p>Designed & Developed by Mr. Md. Shakeel (TKRES)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
