import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

/* ─────────────────────────────────────────────────────────
   TKRCET Homepage — Cinematic Prestige Redesign
   Theme: Dark Cinematic · Obsidian × Molten Gold × Ivory
   Fonts: Playfair Display SC + DM Sans
   ───────────────────────────────────────────────────────── */

const IMAGES = [
  "./images/campus.webp",
  "./images/collage4.jpg",
  "./images/collage2.jpg",
  "./images/collage1.jpg"
];

const DELEGATES = [
  {
    key: "chairman",
    name: "Sri Teegala Krishna Reddy",
    role: "Chairman",
    initial: "TK",
    photo: "../images/tkrcet-chairman.webp",
    quote: "Together, let's continue to strive for excellence and shape a brighter future.",
    bio: "Teegala Krishna Reddy Engineering College has grown in leaps and bounds, hurtling across barriers along the way. This has been made possible with the collaborative effort of the Management, the Staff and the Students."
  },
  {
    key: "secretary",
    name: "Dr. T. Harinath Reddy",
    role: "Secretary",
    initial: "TH",
    photo: "../images/tkrcet-secretary.webp",
    quote: "Empowering students to become global leaders through world-class technical education.",
    bio: "TEEGALA KRISHNA REDDY EDUCATIONAL SOCIETY is a venture contributing to the endeavour of providing world-class technical education and empowering students to become global leaders."
  },
  {
    key: "treasurer",
    name: "Sri. T. Amaranath Reddy",
    role: "Treasurer",
    initial: "TA",
    photo: "../images/tkres-treasurer1.webp",
    quote: "Values with discipline are the hallmark of our college.",
    bio: "The motive of TKRES is to develop a global perspective to cope with the fast changing technology scenario. Emphasis not only on academic excellence but the development of the overall personality of a student."
  },
  {
    key: "principal",
    name: "Dr. D. V. Ravi Shankar",
    role: "Principal",
    initial: "DV",
    photo: "../images/tkr-principal.webp",
    quote: "23 years of distinguished academic experience shaping the institution's future.",
    bio: "Dr. D. V. Ravi Shankar obtained his AMIE from Institution of Engineers, M.Tech in Materials Engineering from NIT Suratkal, and Ph.D in Mechanical Engineering from JNT University, Hyderabad."
  },
  {
    key: "dean",
    name: "Dr. A. Suresh Rao",
    role: "Vice Principal & Dean",
    initial: "AS",
    photo: "../images/suresh_cse.webp",
    quote: "20 years of experience spanning industry and academia.",
    bio: "Dr. A. Suresh Rao, Professor in CSE, was conferred with a PhD from NIT Warangal in 2015. He currently serves as Vice Principal, Dean of Academics and HoD of CSE at TKRCET."
  },
  {
    key: "coe",
    name: "Dr. D. Nageshwar Rao",
    role: "Controller of Examinations",
    initial: "DN",
    photo: "../images/coe.webp",
    quote: "Distinguished academician guiding research scholars with 20 years of excellence.",
    bio: "A distinguished academician with 20 years of teaching experience. He pursued Ph.D in VLSI from GITAM University and has published several research papers in National and International journals."
  }
];

export default function Homepage() {
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [delIdx, setDelIdx] = useState(0);
  const [delVisible, setDelVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const heroRef = useRef(null);

  // Header scroll effect
  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Image carousel
  useEffect(() => {
    const t = setInterval(() => {
      setImgVisible(false);
      setTimeout(() => { setImgIdx(p => (p + 1) % IMAGES.length); setImgVisible(true); }, 500);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  // Delegate carousel
  useEffect(() => {
    const t = setInterval(() => {
      setDelVisible(false);
      setTimeout(() => { setDelIdx(p => (p + 1) % DELEGATES.length); setDelVisible(true); }, 350);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const switchDelegate = (i) => {
    if (i === delIdx) return;
    setDelVisible(false);
    setTimeout(() => { setDelIdx(i); setDelVisible(true); }, 280);
  };

  const handleLogin = async () => {
    if (!username || !password) { toast.error("Please enter credentials."); return; }
    setLoading(true);
    try {
      const fr = await axios.post('https://tkrc-backend.vercel.app/faculty/login', { username, password });
      if (fr.data.success) {
        const f = fr.data.faculty;
        localStorage.setItem("facultyId", f.id);
        toast.success(`Welcome, ${f.name}!`);
        setTimeout(() => navigate('/index'), 1800);
        return;
      }
    } catch (_) {}
    try {
      const sr = await axios.post('https://tkrcet-backend-g3zu.onrender.com/Section/login', { rollNumber: username, password });
      if (sr.data.success && sr.data.student?.id) {
        const s = sr.data.student;
        localStorage.setItem("studentId", s.rollNumber);
        toast.success(`Welcome, ${s.name}!`);
        setTimeout(() => navigate('/index'), 1800);
        return;
      }
    } catch (_) {
      toast.error("Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  const d = DELEGATES[delIdx];

  return (
    <>
      <style>{CSS}</style>
      <ToastContainer theme="dark" position="top-right" />

      <div className="tkr-page">

        {/* ══════════════════ HEADER ══════════════════ */}
        <header className={`tkr-nav ${headerScrolled ? 'tkr-nav--solid' : ''}`}>
          <div className="tkr-nav-inner">
            <div className="tkr-nav-brand">
              <div className="tkr-nav-emblem">
                <img src="./images/logo.png" alt="TKRCET" />
              </div>
              <div className="tkr-nav-titles">
                <span className="tkr-nav-name">T.K.R. College of Engineering & Technology</span>
                <span className="tkr-nav-tagline">Affiliated to JNTUH · AICTE Approved · Est. 2002</span>
              </div>
            </div>
            <div className="tkr-nav-loc">
              <span className="tkr-nav-loc-dot" />
              Meerpet, Hyderabad
            </div>
          </div>
        </header>

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="tkr-hero" ref={heroRef}>
          {IMAGES.map((src, i) => (
            <img
              key={src}
              className={`tkr-hero-img ${i === imgIdx ? (imgVisible ? 'visible' : '') : ''} ${i === imgIdx ? 'active' : ''}`}
              src={src}
              alt=""
            />
          ))}
          <div className="tkr-hero-grain" />
          <div className="tkr-hero-vignette" />

          <div className="tkr-hero-content">
            <div className="tkr-hero-label">
              <span className="tkr-hero-label-line" />
              Welcome to TKRCET
            </div>
            <h1 className="tkr-hero-headline">
              <span className="tkr-hero-hl-top">Shaping</span>
              <span className="tkr-hero-hl-mid">Tomorrow's</span>
              <span className="tkr-hero-hl-bot">Engineers</span>
            </h1>
            <p className="tkr-hero-sub">A premier institution of excellence since 2002 — where knowledge meets character.</p>
          </div>

          <div className="tkr-hero-controls">
            <div className="tkr-hero-dots">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`tkr-hero-dot ${i === imgIdx ? 'tkr-hero-dot--on' : ''}`}
                  onClick={() => { setImgVisible(false); setTimeout(() => { setImgIdx(i); setImgVisible(true); }, 300); }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
            <div className="tkr-hero-counter">{String(imgIdx + 1).padStart(2, '0')} / {String(IMAGES.length).padStart(2, '0')}</div>
          </div>

          <div className="tkr-hero-scroll-cue">
            <span>Scroll</span>
            <span className="tkr-hero-scroll-arrow">↓</span>
          </div>
        </section>

        {/* ══════════════════ ABOUT ══════════════════ */}
        <section className="tkr-about">
          <div className="tkr-about-bg-text" aria-hidden>TKRCET</div>
          <div className="tkr-about-inner">
            <div className="tkr-about-left">
              <div className="tkr-eyebrow">
                <span className="tkr-eyebrow-rule" />
                About the Institution
              </div>
              <h2 className="tkr-about-heading">
                A Modern Temple<br />
                <em>of Learning</em>
              </h2>
              <div className="tkr-about-divider" />
              <div className="tkr-about-stats">
                {[
                  { n: "20+", l: "Acre Campus" },
                  { n: "7+",  l: "UG Programmes" },
                  { n: "22",  l: "Years Legacy" },
                  { n: "AICTE", l: "Approved" },
                ].map(s => (
                  <div className="tkr-astat" key={s.l}>
                    <span className="tkr-astat-num">{s.n}</span>
                    <span className="tkr-astat-label">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tkr-about-right">
              <p className="tkr-about-para">
                TKR College of Engineering and Technology — established in 2002 in a sprawling, lush green 20-acre campus at Meerpet, Hyderabad — provides a serene and tranquil environment boosting students' mental potential and preparing them to face global competition with confidence.
              </p>
              <p className="tkr-about-para">
                Founded by <strong>Sri Teegala Krishna Reddy</strong>, Mayor of Hyderabad and a visionary philanthropist, TKRCET is driven by the mission to make quality education accessible to every student, upholding moral and ethical values. The college is affiliated to JNTUH, approved by AICTE, New Delhi, and the State Government of Telangana.
              </p>
              <p className="tkr-about-para">
                TKRCET offers seven UG programmes — Civil, EEE, CSE, ECE, Mechanical Engineering — along with PG courses in M.Tech (CSE, PE) and MBA. The college also runs a second-shift Polytechnic in Civil, EEE, Mech, ECE & CSE.
              </p>
              <div className="tkr-about-accent-bar" />
            </div>
          </div>
        </section>

        {/* ══════════════════ VISION & MISSION ══════════════════ */}
        <section className="tkr-vm">
          <div className="tkr-vm-inner">
            <div className="tkr-vm-block tkr-vm-block--vision">
              <div className="tkr-vm-eyebrow">
                <span className="tkr-vm-eyebrow-rule" />
                Vision
              </div>
              <h3 className="tkr-vm-title">Institution<br /><em>Vision</em></h3>
              <div className="tkr-vm-glyph">◈</div>
              <p className="tkr-vm-text">
                To be a premier institution of excellence — empowering students with knowledge, skills, and ethical values to become innovative engineers who contribute meaningfully to society and the nation.
              </p>
            </div>

            <div className="tkr-vm-spine">
              <div className="tkr-vm-spine-line" />
              <div className="tkr-vm-spine-diamond">◆</div>
              <div className="tkr-vm-spine-line" />
            </div>

            <div className="tkr-vm-block tkr-vm-block--mission">
              <div className="tkr-vm-eyebrow tkr-vm-eyebrow--light">
                <span className="tkr-vm-eyebrow-rule tkr-vm-eyebrow-rule--light" />
                Mission
              </div>
              <h3 className="tkr-vm-title tkr-vm-title--light">Institution<br /><em>Mission</em></h3>
              <div className="tkr-vm-glyph tkr-vm-glyph--light">◆</div>
              <ul className="tkr-vm-list">
                {[
                  "Ensuring excellent branch-wise infrastructural facilities for all disciplines",
                  "Making the institute a premier research and resource centre",
                  "Fostering industry-academia partnerships for real-world exposure",
                  "Nurturing holistic development — academic, personal, and professional",
                ].map((item, i) => (
                  <li key={i} className="tkr-vm-item">
                    <span className="tkr-vm-item-num">{String(i + 1).padStart(2, '0')}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══════════════════ DELEGATES ══════════════════ */}
        <section className="tkr-del">
          <div className="tkr-del-inner">
            <div className="tkr-del-header">
              <div className="tkr-eyebrow tkr-eyebrow--gold">
                <span className="tkr-eyebrow-rule" />
                Leadership
              </div>
              <h2 className="tkr-del-heading">Our Esteemed<br /><em>Delegates</em></h2>
            </div>

            <div className="tkr-del-layout">
              {/* Left: selector list */}
              <nav className="tkr-del-nav">
                {DELEGATES.map((item, i) => (
                  <button
                    key={item.key}
                    className={`tkr-del-btn ${i === delIdx ? 'tkr-del-btn--active' : ''}`}
                    onClick={() => switchDelegate(i)}
                  >
                    <span className="tkr-del-btn-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="tkr-del-btn-text">
                      <span className="tkr-del-btn-role">{item.role}</span>
                      <span className="tkr-del-btn-name">{item.name}</span>
                    </span>
                    <span className="tkr-del-btn-arrow">→</span>
                  </button>
                ))}
              </nav>

              {/* Right: profile display */}
              <div className={`tkr-del-profile ${delVisible ? 'tkr-del-profile--in' : 'tkr-del-profile--out'}`}>
                <div className="tkr-del-photo-area">
                  <div className="tkr-del-photo-ring tkr-del-photo-ring--outer" />
                  <div className="tkr-del-photo-ring tkr-del-photo-ring--inner" />
                  <img className="tkr-del-photo" src={d.photo} alt={d.name} />
                  <div className="tkr-del-photo-badge">{d.initial}</div>
                </div>
                <div className="tkr-del-info">
                  <p className="tkr-del-role-label">{d.role}</p>
                  <h3 className="tkr-del-name">{d.name}</h3>
                  <blockquote className="tkr-del-quote">"{d.quote}"</blockquote>
                  <p className="tkr-del-bio">{d.bio}</p>
                  <div className="tkr-del-progress">
                    {DELEGATES.map((_, i) => (
                      <div key={i} className={`tkr-del-pip ${i === delIdx ? 'tkr-del-pip--on' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ LOGIN ══════════════════ */}
        <section className="tkr-auth">
          <div className="tkr-auth-inner">

            <div className="tkr-auth-left">
              <div className="tkr-eyebrow">
                <span className="tkr-eyebrow-rule" />
                Portal Access
              </div>
              <h2 className="tkr-auth-heading">
                Sign In to<br />Your <em>Account</em>
              </h2>
              <p className="tkr-auth-sub">
                Access your academic dashboard, attendance records, results and more — available for both students and faculty members.
              </p>

              <div className="tkr-auth-features">
                {[
                  { icon: "📋", label: "Attendance Tracking" },
                  { icon: "📊", label: "Academic Results" },
                  { icon: "📅", label: "Timetable & Schedule" },
                ].map(f => (
                  <div className="tkr-auth-feat" key={f.label}>
                    <span className="tkr-auth-feat-icon">{f.icon}</span>
                    <span className="tkr-auth-feat-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tkr-auth-form-wrap">
              <div className="tkr-auth-form-glow" />
              <div className="tkr-auth-form">
                <div className="tkr-auth-form-top">
                  <span className="tkr-auth-form-eyebrow">Student & Faculty Portal</span>
                  <h3 className="tkr-auth-form-title">Welcome Back</h3>
                  <p className="tkr-auth-form-hint">Enter your credentials to continue</p>
                </div>

                <div className="tkr-auth-field">
                  <label className="tkr-auth-label">Username / Roll Number</label>
                  <input
                    className="tkr-auth-input"
                    type="text"
                    placeholder="e.g. D600 or 20A81A0501"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>

                <div className="tkr-auth-field">
                  <label className="tkr-auth-label">Password</label>
                  <input
                    className="tkr-auth-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  className={`tkr-auth-btn ${loading ? 'tkr-auth-btn--loading' : ''}`}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="tkr-auth-spinner" />
                  ) : (
                    <>
                      <span>Login</span>
                      <span className="tkr-auth-btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ FOOTER ══════════════════ */}
        <footer className="tkr-footer">
          <div className="tkr-footer-inner">
            <div className="tkr-footer-brand">
              <img className="tkr-footer-logo" src="./images/logo.png" alt="TKRCET" />
              <span className="tkr-footer-name">TKRCET</span>
            </div>
            <div className="tkr-footer-copy">
              <p>Copyright © 2024 TKR College of Engineering & Technology. All Rights Reserved.</p>
              <p>Designed & Developed by Mr. Md. Shakeel (TKRES)</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}


  
  
  
  
  