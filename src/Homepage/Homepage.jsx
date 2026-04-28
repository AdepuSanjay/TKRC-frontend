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
      description: "TKRCET has grown in leaps and bounds through the collaborative effort of Management, Staff and Students. My vision is to see every student excel while upholding the moral values that define our institution's character.",
    },
    secretary: {
      name: "Dr. T. Harinath Reddy",
      role: "Secretary",
      photo: "../images/tkrcet-secretary.webp",
      description: "Engineers play the most vital role in nation building. TKRES is committed to providing world-class technical education, empowering students to become leaders who contribute to the global community.",
    },
    treasurer: {
      name: "Sri. T. Amaranath Reddy",
      role: "Treasurer",
      photo: "../images/tkres-treasurer1.webp",
      description: "Our emphasis is not only on academic excellence but the holistic development of a student's personality. We ensure new ideas are executed, turning promise into remarkable achievement.",
    },
    principal: {
      name: "Dr. D. V. Ravi Shankar",
      role: "Principal",
      photo: "../images/tkr-principal.webp",
      description: "With M.Tech from NIT Suratkal and Ph.D from JNTUH, I bring 23 years of academic distinction. My goal is to foster an environment where curiosity thrives and innovation flourishes.",
    },
    dean: {
      name: "Dr. A. Suresh Rao",
      role: "Vice Principal & Dean",
      photo: "../images/suresh_cse.webp",
      description: "Holding a Ph.D from NIT Warangal, I oversee academics with a commitment to excellence. My 20 years bridging industry and academia ensures our curriculum remains rigorous and relevant.",
    },
    coe: {
      name: "Dr. D. Nageshwar Rao",
      role: "Controller of Examinations",
      photo: "../images/coe.webp",
      description: "With a Ph.D in VLSI from GITAM University and 20 years of teaching experience, I ensure examination integrity and academic standards. Our processes are truly world-class.",
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
  }, []);

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
  }, [currentDelegateIndex]);

  const handlePrev = () => doSwitchDelegate((currentDelegateIndex - 1 + delegateKeys.length) % delegateKeys.length);
  const handleNext = () => doSwitchDelegate((currentDelegateIndex + 1) % delegateKeys.length);
  const handleTab  = (i) => { if (i !== currentDelegateIndex) doSwitchDelegate(i); };

  const currentDelegate = delegateInfo[delegateKeys[currentDelegateIndex]];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { toast.warning('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const r = await axios.post('https://tkrc-backend.vercel.app/faculty/login', { username, password });
      if (r.data.success) {
        localStorage.setItem('facultyId', r.data.faculty.id);
        toast.success(`Welcome, ${r.data.faculty.name}!`);
        setTimeout(() => navigate('/index'), 2000);
        return;
      }
    } catch (_) {}
    try {
      const r = await axios.post('https://tkrcet-backend-g3zu.onrender.com/Section/login', { rollNumber: username, password });
      if (r.data.success && r.data.student?.id) {
        localStorage.setItem('studentId', r.data.student.rollNumber);
        toast.success(`Welcome, ${r.data.student.name}!`);
        setTimeout(() => navigate('/index'), 2000);
        return;
      }
    } catch (_) {
      toast.error('Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  const stats = [
    { icon: <TbBuildingBank />, num: '20+',   label: 'Acre Campus'  },
    { icon: <MdSchool />,       num: '7+',    label: 'UG Programs'  },
    { icon: <RiGroupLine />,    num: '5k+',   label: 'Students'     },
    { icon: <RiAwardLine />,    num: 'AICTE', label: 'Approved'     },
  ];

  return (
    <div className="saas-root">
      <ToastContainer position="top-center" hideProgressBar theme="light" />

      {/* HEADER */}
      <header className="saas-header">
        <div className="saas-header__inner">
          <div className="saas-header__brand">
            <img className="saas-header__logo" src="./images/logo.png" alt="TKRCET" />
            <span className="saas-header__title">TKRCET</span>
          </div>
          <div className="saas-header__actions">
            <span className="saas-pill">Est. 2002</span>
            <button className="saas-btn saas-btn--outline" onClick={() => document.getElementById('login-section').scrollIntoView()}>Sign in</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="saas-hero">
        <div className="saas-hero__content">
          <div className="saas-badge">
            <MdVerified className="saas-badge__icon" /> NAAC Accredited Institution
          </div>
          <h1 className="saas-hero__title">
            Shape tomorrow's<br />engineers today
          </h1>
          <p className="saas-hero__subtitle">
            Experience world-class technical education in our serene 20-acre campus. Track attendance, forecast results, and focus on learning.
          </p>
          <div className="saas-hero__actions">
            <button className="saas-btn saas-btn--primary" onClick={() => document.getElementById('login-section').scrollIntoView()}>
              Get started free <RiArrowRightLine />
            </button>
          </div>
        </div>
        
        <div className="saas-hero__visual">
          <img className={`saas-hero__img ${imgFade ? 'in' : ''}`} src={imagesLoader[currentImageIndex]} alt="Campus" />
          <div className="saas-hero__dots">
            {imagesLoader.map((_, i) => (
              <button key={i} className={`saas-hero__dot ${i === currentImageIndex ? 'on' : ''}`} onClick={() => setCurrentImageIndex(i)} />
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

      {/* MINT FEATURE CARD */}
      <section className="saas-feature">
        <div className="saas-feature__card">
          <div className="saas-badge saas-badge--white">DESIGNED FOR ACADEMIC EXCELLENCE</div>
          <h2 className="saas-feature__title">Everything you need.<br/>Nothing you don't.</h2>
          <p className="saas-feature__desc">
            TKR College of Engineering and Technology provides a tranquil environment, preparing students to face global competition with confidence. 
            Bridging the rural-urban divide while upholding moral standards.
          </p>
          
          <div className="saas-feature__grid">
            <div className="saas-feature-mini">
              <FaEye className="saas-feature-mini__icon" />
              <h3>Vision</h3>
              <p>Empowering students with ethical values to become innovative leaders.</p>
            </div>
            <div className="saas-feature-mini">
              <FaBullseye className="saas-feature-mini__icon" />
              <h3>Mission</h3>
              <p>Fostering strong industry partnerships and holistic development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="saas-delegates">
        <div className="saas-section-header">
          <h2>Magnificent Delegates</h2>
          <p>The visionary minds driving TKRCET towards excellence.</p>
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
          <img className="saas-delegates__img" src={currentDelegate.photo} alt={currentDelegate.name} />
          <div className="saas-delegates__info">
            <span className="saas-delegates__role">{currentDelegate.role}</span>
            <h3 className="saas-delegates__name">{currentDelegate.name}</h3>
            <p className="saas-delegates__desc">"{currentDelegate.description}"</p>
          </div>
        </div>
      </section>

      {/* DARK LOGIN SECTION */}
      <section id="login-section" className="saas-login">
        <div className="saas-login__container">
          <div className="saas-login__text">
            <h2>Ready in minutes. No complex setup required.</h2>
            <p>Access your academic dashboard, track attendance, and view your schedule instantly.</p>
          </div>

          <div className="saas-login__box">
            <div className="saas-login__header">
              <HiAcademicCap className="saas-login__icon" />
              <h3>Student & Faculty Portal</h3>
            </div>

            <div className="saas-field">
              <label>Roll Number / Username</label>
              <input type="text" placeholder="e.g. 20A81A0501" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
            </div>

            <div className="saas-field">
              <label>Password</label>
              <div className="saas-field__pw">
                <input type={showPw ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} disabled={loading} />
                <button type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button className="saas-btn saas-btn--primary saas-btn--full" onClick={handleLogin} disabled={loading}>
              {loading ? 'Authenticating...' : <>Sign in to Portal <RiArrowRightLine /></>}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="saas-footer">
        <div className="saas-footer__inner">
          <div className="saas-footer__brand">
            <img className="saas-footer__logo" src="./images/logo.png" alt="TKRCET" />
            <span className="saas-footer__name">TKRCET</span>
          </div>
          <div className="saas-footer__links">
            <p>© 2024 TKRCET</p>
            <p>Designed by Md. Shakeel</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
