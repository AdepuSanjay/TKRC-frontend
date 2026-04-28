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
  RiGroupLine, RiBuilding2Line,
  RiCalendarCheckLine, RiBarChartBoxLine, RiTimeLine,
  RiTeamLine, RiAwardLine, RiEyeLine, RiEyeOffLine,
} from 'react-icons/ri';
import { FaUniversity, FaEye, FaBullseye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TbBuildingBank, TbFlame, TbCertificate } from 'react-icons/tb';
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
    <div className="tkr-root">
      <ToastContainer />

      {/* HEADER */}
      <header className="tkr-header">
        <div className="tkr-header__inner">
          <div className="tkr-header__brand">
            <div className="tkr-header__logo-ring">
              <img className="tkr-header__logo" src="./images/logo.png" alt="TKRCET" />
            </div>
            <div className="tkr-header__text">
              <h1 className="tkr-header__title">T.K.R. College of Engineering &amp; Technology</h1>
              <p className="tkr-header__sub">
                <IoLocationSharp className="tkr-sub-icon" />
                Meerpet, Hyderabad &nbsp;·&nbsp; JNTUH Affiliated &nbsp;·&nbsp; AICTE Approved
              </p>
            </div>
          </div>
          <div className="tkr-header__pills">
            <span className="tkr-pill tkr-pill--year">Est. 2002</span>
            <span className="tkr-pill tkr-pill--naac"><MdVerified className="tkr-pill-icon" /> NAAC</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="tkr-hero">
        <img className={`tkr-hero__bg${imgFade ? ' in' : ''}`} src={imagesLoader[currentImageIndex]} alt="Campus" />
        <div className="tkr-hero__veil" />
        <div className="tkr-hero__body">
          <div className="tkr-hero__eyebrow"><TbFlame className="tkr-hero__flame" /> Welcome to TKRCET</div>
          <h2 className="tkr-hero__h">Shaping Tomorrow's<br /><em>Engineers</em> Today</h2>
          <p className="tkr-hero__p">20 acres of serene campus · world-class faculty · excellence since 2002</p>
          <div className="tkr-hero__dots">
            {imagesLoader.map((_, i) => (
              <button key={i} className={`tkr-dot${i === currentImageIndex ? ' on' : ''}`}
                onClick={() => setCurrentImageIndex(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="tkr-stats">
        <div className="tkr-stats__inner">
          {stats.map((s, i) => (
            <div className="tkr-stat" key={i}>
              <span className="tkr-stat__icon">{s.icon}</span>
              <div className="tkr-stat__content">
                <strong className="tkr-stat__num">{s.num}</strong>
                <span className="tkr-stat__lbl">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="tkr-about">
        <div className="tkr-about__wrap">
          <div className="tkr-tag"><FaUniversity className="tkr-tag__icon" /> About Us</div>
          <h2 className="tkr-about__h">About TKRCET Campus</h2>
          <div className="tkr-rule" />
          <p className="tkr-about__p">TKR College of Engineering and Technology was established in 2002 in a sprawling, lush green 20-acre campus at Meerpet, Hyderabad. The college provides a serene and tranquil environment, preparing students in every aspect to face global competition with confidence and emerge victorious.</p>
          <p className="tkr-about__p">Founded by Sri Teegala Krishna Reddy — Mayor of Hyderabad and a visionary philanthropist — TKRCET is driven by the mission to make quality education accessible to every student, bridging the rural-urban divide while upholding the highest moral and ethical standards.</p>
          <p className="tkr-about__p">The college offers seven UG programmes in Civil, EEE, CSE, ECE, and Mechanical Engineering, along with PG courses in M.Tech (CSE, PE) and MBA. Affiliated to JNTUH, approved by AICTE, New Delhi, and recognized by the Government of Telangana.</p>
        </div>
      </section>

      {/* DELEGATES */}
      <section className="tkr-del">
        <div className="tkr-del__wrap">
          <div className="tkr-tag tkr-tag--lt"><RiTeamLine className="tkr-tag__icon" /> Leadership</div>
          <h2 className="tkr-del__h">Our Magnificent Delegates</h2>
          <div className="tkr-rule tkr-rule--lt" />

          <div className="tkr-del__tabs">
            {delegateKeys.map((key, i) => (
              <button key={key}
                className={`tkr-del__tab${i === currentDelegateIndex ? ' on' : ''}`}
                onClick={() => handleTab(i)}>
                {delegateInfo[key].role}
              </button>
            ))}
          </div>

          <div className={`tkr-del__profile${delegateFade ? ' in' : ''}`}>
            <div className="tkr-del__photo-col">
              <div className="tkr-del__frame">
                <img className="tkr-del__photo" src={currentDelegate.photo} alt={currentDelegate.name} />
              </div>
              <div className="tkr-del__nav">
                <button className="tkr-del__nav-btn" onClick={handlePrev}><FaChevronLeft /></button>
                <span className="tkr-del__nav-count">{currentDelegateIndex + 1}/{delegateKeys.length}</span>
                <button className="tkr-del__nav-btn" onClick={handleNext}><FaChevronRight /></button>
              </div>
            </div>
            <div className="tkr-del__info">
              <BiSolidQuoteLeft className="tkr-del__quote" />
              <span className="tkr-del__role">{currentDelegate.role}</span>
              <h3 className="tkr-del__name">{currentDelegate.name}</h3>
              <p className="tkr-del__desc">{currentDelegate.description}</p>
              <div className="tkr-del__badges">
                <span className="tkr-del__badge"><RiMedalLine /> TKRCET Leadership</span>
                <span className="tkr-del__badge"><RiShieldCheckLine /> Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="tkr-vm">
        <div className="tkr-vm__wrap">
          <div className="tkr-vm__panel tkr-vm__panel--v">
            <div className="tkr-vm__icon-wrap"><FaEye /></div>
            <h3 className="tkr-vm__h">Institution Vision</h3>
            <div className="tkr-vm__rule" />
            <p className="tkr-vm__p">To be a premier institution of excellence — empowering students with knowledge, skills, and ethical values to become innovative engineers and leaders who contribute meaningfully to society and the nation.</p>
          </div>
          <div className="tkr-vm__divider" />
          <div className="tkr-vm__panel tkr-vm__panel--m">
            <div className="tkr-vm__icon-wrap tkr-vm__icon-wrap--m"><FaBullseye /></div>
            <h3 className="tkr-vm__h">Institution Mission</h3>
            <div className="tkr-vm__rule tkr-vm__rule--m" />
            <ul className="tkr-vm__list">
              {missions.map((m, i) => (
                <li key={i} className="tkr-vm__item">
                  <BsCheck2Circle className="tkr-vm__check" /><span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* LOGIN */}
      <section className="tkr-login">
        <div className="tkr-login__wrap">
          <div className="tkr-login__copy">
            <div className="tkr-tag"><RiLoginBoxLine className="tkr-tag__icon" /> Portal Access</div>
            <h2 className="tkr-login__h">Sign In to<br />Your Account</h2>
            <p className="tkr-login__sub">Access your full academic dashboard — attendance, results, timetable and more. Available for both students and faculty.</p>
            <ul className="tkr-login__feats">
              {features.map((f, i) => (
                <li key={i} className="tkr-login__feat">
                  <span className="tkr-login__feat-icon">{f.icon}</span>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tkr-login__box">
            <div className="tkr-login__box-top">
              <HiAcademicCap className="tkr-login__cap-icon" />
              <div>
                <p className="tkr-login__eyebrow">Student &amp; Faculty Portal</p>
                <h3 className="tkr-login__box-title">Welcome Back</h3>
              </div>
            </div>

            <div className="tkr-login__field">
              <label className="tkr-login__lbl">
                <RiUser3Line className="tkr-login__lbl-icon" /> Username / Roll Number
              </label>
              <input className="tkr-login__input" type="text"
                placeholder="e.g. D600 or 20A81A0501"
                value={username} onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                disabled={loading} autoComplete="username" />
            </div>

            <div className="tkr-login__field">
              <label className="tkr-login__lbl">
                <RiLockPasswordLine className="tkr-login__lbl-icon" /> Password
              </label>
              <div className="tkr-login__pw">
                <input className="tkr-login__input" type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  disabled={loading} autoComplete="current-password" />
                <button className="tkr-login__eye" type="button"
                  onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button className={`tkr-login__btn${loading ? ' loading' : ''}`}
              onClick={handleLogin} disabled={loading}>
              {loading
                ? <span className="tkr-spin" />
                : <><RiArrowRightLine className="tkr-btn-arrow" /> Login to Portal</>}
            </button>

            <p className="tkr-login__secure"><RiShieldCheckLine /> Secure &amp; encrypted connection</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tkr-footer">
        <div className="tkr-footer__inner">
          <div className="tkr-footer__brand">
            <img className="tkr-footer__logo" src="./images/logo.png" alt="TKRCET" />
            <div>
              <p className="tkr-footer__name">TKRCET</p>
              <p className="tkr-footer__tag">Engineering Excellence Since 2002</p>
            </div>
          </div>
          <div className="tkr-footer__copy">
            <p>© 2024 TKR College of Engineering &amp; Technology. All Rights Reserved.</p>
            <p>Designed &amp; Developed by Mr. Md. Shakeel (TKRES)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
