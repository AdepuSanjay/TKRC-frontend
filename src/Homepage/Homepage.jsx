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

/* ═══════════════════════════════════════════════════════════════════
   EMBEDDED CSS — Complete Design System
   ═══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display+SC:ital,wght@0,400;0,700;0,900;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --obsidian:    #090c12;
  --deep:        #0e1420;
  --surface:     #141a26;
  --surface2:    #1b2233;
  --ivory:       #f5f0e8;
  --ivory-dim:   #c8c0b0;
  --gold:        #c8943a;
  --gold-light:  #e8b865;
  --gold-pale:   #f5dfa0;
  --gold-glow:   rgba(200,148,58,.18);
  --white:       #ffffff;
  --ink:         #090c12;
  --muted:       rgba(245,240,232,.45);
  --border-dark: rgba(200,148,58,.15);
  --border-light: rgba(200,148,58,.25);

  --ff-display: 'Playfair Display', Georgia, serif;
  --ff-sc:      'Playfair Display SC', Georgia, serif;
  --ff-body:    'DM Sans', sans-serif;

  --ease:        cubic-bezier(.4,0,.2,1);
  --ease-out:    cubic-bezier(0,0,.3,1);
  --ease-spring: cubic-bezier(.34,1.4,.64,1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  font-family: var(--ff-body);
  background: var(--deep);
  color: var(--ivory);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { cursor: pointer; font-family: var(--ff-body); border: none; background: none; }
em { font-style: italic; color: var(--gold-light); }
strong { font-weight: 600; color: var(--ivory); }

@keyframes fadeUp    { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin      { to { transform: rotate(360deg); } }
@keyframes pulse     { 0%,100% { opacity:.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
@keyframes scrollBob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
@keyframes shimmer   { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

/* ──────── SHARED EYEBROW ──────── */
.tkr-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  font-size: .68rem;
  font-weight: 600;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.1rem;
}
.tkr-eyebrow--gold { color: var(--gold-light); }
.tkr-eyebrow-rule {
  display: block;
  width: 28px;
  height: 1.5px;
  background: var(--gold);
  border-radius: 1px;
  flex-shrink: 0;
}

/* ══════════════════════════════════
   NAVIGATION
══════════════════════════════════ */
.tkr-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  transition: background .4s var(--ease), backdrop-filter .4s var(--ease), border-color .4s var(--ease);
  border-bottom: 1px solid transparent;
}
.tkr-nav--solid {
  background: rgba(9,12,18,.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-color: var(--border-dark);
}
.tkr-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2.5rem;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tkr-nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideDown .5s var(--ease-out) both;
}
.tkr-nav-emblem {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--gold);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 0 20px var(--gold-glow);
}
.tkr-nav-emblem img { width: 100%; height: 100%; object-fit: cover; }
.tkr-nav-titles { display: flex; flex-direction: column; }
.tkr-nav-name {
  font-family: var(--ff-sc);
  font-size: clamp(.78rem, 1.4vw, 1rem);
  font-weight: 700;
  color: var(--ivory);
  letter-spacing: .03em;
  line-height: 1.3;
}
.tkr-nav-tagline {
  font-size: .62rem;
  font-weight: 400;
  color: var(--gold);
  letter-spacing: .1em;
  text-transform: uppercase;
  margin-top: 2px;
}
.tkr-nav-loc {
  display: flex;
  align-items: center;
  gap: .55rem;
  font-size: .72rem;
  font-weight: 500;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ivory-dim);
  animation: slideDown .5s .1s var(--ease-out) both;
}
.tkr-nav-loc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 2s infinite;
}

/* ══════════════════════════════════
   HERO
══════════════════════════════════ */
.tkr-hero {
  position: relative;
  height: 100vh;
  min-height: 640px;
  overflow: hidden;
  background: var(--obsidian);
}
.tkr-hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity .8s var(--ease);
  transform: scale(1.04);
  filter: brightness(.55) saturate(.8);
}
.tkr-hero-img.active { display: block; }
.tkr-hero-img.visible { opacity: 1; }
.tkr-hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: .5;
  mix-blend-mode: overlay;
}
.tkr-hero-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 100% at 20% 50%, rgba(9,12,18,.75) 0%, transparent 60%),
    linear-gradient(to bottom, rgba(9,12,18,.5) 0%, transparent 35%, transparent 65%, rgba(9,12,18,.8) 100%),
    linear-gradient(to right, rgba(9,12,18,.6) 0%, transparent 70%);
  pointer-events: none;
}
.tkr-hero-content {
  position: absolute;
  left: 7vw;
  bottom: 18%;
  max-width: 680px;
  animation: fadeUp .8s .2s var(--ease-out) both;
}
.tkr-hero-label {
  display: flex;
  align-items: center;
  gap: .7rem;
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--gold-light);
  margin-bottom: 1.5rem;
}
.tkr-hero-label-line {
  display: block;
  width: 40px;
  height: 1px;
  background: var(--gold);
  flex-shrink: 0;
}
.tkr-hero-headline {
  display: flex;
  flex-direction: column;
  font-family: var(--ff-display);
  line-height: 1.05;
  color: var(--white);
  margin-bottom: 1.5rem;
}
.tkr-hero-hl-top {
  font-size: clamp(2.8rem, 6vw, 5.5rem);
  font-weight: 400;
  font-style: italic;
  color: var(--gold-light);
  letter-spacing: -.02em;
}
.tkr-hero-hl-mid {
  font-size: clamp(3.5rem, 7.5vw, 7rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: .95;
}
.tkr-hero-hl-bot {
  font-size: clamp(3.5rem, 7.5vw, 7rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: .95;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-pale) 50%, var(--gold) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}
.tkr-hero-sub {
  font-size: clamp(.9rem, 1.4vw, 1.05rem);
  font-weight: 300;
  color: var(--ivory-dim);
  line-height: 1.7;
  max-width: 460px;
}
.tkr-hero-controls {
  position: absolute;
  bottom: 6%;
  left: 7vw;
  display: flex;
  align-items: center;
  gap: 2rem;
  animation: fadeIn 1s .5s var(--ease) both;
}
.tkr-hero-dots { display: flex; gap: .5rem; align-items: center; }
.tkr-hero-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,.25);
  border: none;
  transition: all .35s var(--ease);
}
.tkr-hero-dot--on {
  width: 32px;
  border-radius: 4px;
  background: var(--gold);
}
.tkr-hero-counter {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .14em;
  color: var(--ivory-dim);
  font-variant-numeric: tabular-nums;
}
.tkr-hero-scroll-cue {
  position: absolute;
  right: 3vw;
  bottom: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--ivory-dim);
  animation: fadeIn 1s .7s var(--ease) both;
}
.tkr-hero-scroll-arrow {
  font-size: 1rem;
  animation: scrollBob 2s ease infinite;
  color: var(--gold);
}

/* ══════════════════════════════════
   ABOUT
══════════════════════════════════ */
.tkr-about {
  position: relative;
  background: var(--ivory);
  padding: 8rem 2.5rem;
  overflow: hidden;
}
.tkr-about-bg-text {
  position: absolute;
  right: -2rem;
  bottom: -2rem;
  font-family: var(--ff-sc);
  font-size: clamp(8rem, 18vw, 18rem);
  font-weight: 900;
  color: rgba(9,12,18,.04);
  letter-spacing: -.05em;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.tkr-about-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 7rem;
  align-items: start;
  position: relative;
}
.tkr-about-left { position: sticky; top: 6rem; }
.tkr-about .tkr-eyebrow-rule { background: var(--gold); }
.tkr-about .tkr-eyebrow { color: var(--gold); }
.tkr-about-heading {
  font-family: var(--ff-display);
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  font-weight: 700;
  color: var(--ink);
  line-height: 1.15;
  letter-spacing: -.02em;
  margin-bottom: 2.5rem;
}
.tkr-about-heading em { color: var(--gold); font-style: italic; }
.tkr-about-divider {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  border-radius: 1px;
  margin-bottom: 3rem;
}
.tkr-about-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(9,12,18,.1);
}
.tkr-astat { display: flex; flex-direction: column; gap: .3rem; }
.tkr-astat-num {
  font-family: var(--ff-display);
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  letter-spacing: -.02em;
}
.tkr-astat-label {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(9,12,18,.45);
}
.tkr-about-right { padding-top: .5rem; }
.tkr-about-para {
  font-size: 1.05rem;
  line-height: 1.9;
  color: rgba(9,12,18,.72);
  font-weight: 300;
  margin-bottom: 1.6rem;
}
.tkr-about-accent-bar {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin-top: 1rem;
}

/* ══════════════════════════════════
   VISION & MISSION
══════════════════════════════════ */
.tkr-vm {
  background: var(--obsidian);
  padding: 8rem 2.5rem;
  position: relative;
  overflow: hidden;
}
.tkr-vm::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 60% at 0% 50%, rgba(200,148,58,.06) 0%, transparent 70%),
    radial-gradient(ellipse 60% 60% at 100% 50%, rgba(200,148,58,.04) 0%, transparent 70%);
  pointer-events: none;
}
.tkr-vm-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  gap: 0;
  align-items: stretch;
  position: relative;
}
.tkr-vm-block {
  padding: 4rem;
}
.tkr-vm-block--vision {
  border: 1px solid var(--border-dark);
  border-right: none;
  border-radius: 2px 0 0 2px;
}
.tkr-vm-block--mission {
  border: 1px solid var(--border-dark);
  border-left: none;
  border-radius: 0 2px 2px 0;
  background: var(--surface);
}
.tkr-vm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  font-size: .65rem;
  font-weight: 600;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.2rem;
}
.tkr-vm-eyebrow--light { color: var(--gold-light); }
.tkr-vm-eyebrow-rule {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--gold);
  flex-shrink: 0;
}
.tkr-vm-eyebrow-rule--light { background: var(--gold-light); }
.tkr-vm-title {
  font-family: var(--ff-display);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--ivory);
  line-height: 1.2;
  letter-spacing: -.01em;
  margin-bottom: 1.8rem;
}
.tkr-vm-title--light { color: var(--white); }
.tkr-vm-title em { font-style: italic; color: var(--gold-light); }
.tkr-vm-glyph {
  font-size: 1.4rem;
  color: var(--gold);
  margin-bottom: 1.5rem;
  display: block;
  opacity: .6;
}
.tkr-vm-glyph--light { color: var(--gold-light); }
.tkr-vm-text {
  font-size: 1rem;
  line-height: 1.85;
  color: var(--muted);
  font-weight: 300;
}
.tkr-vm-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}
.tkr-vm-spine-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gold), transparent);
}
.tkr-vm-spine-diamond {
  font-size: 1rem;
  color: var(--gold);
  padding: .5rem 0;
  flex-shrink: 0;
}
.tkr-vm-list { margin-top: .5rem; }
.tkr-vm-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,.06);
  font-size: .95rem;
  line-height: 1.65;
  color: rgba(245,240,232,.6);
  font-weight: 300;
}
.tkr-vm-item:last-child { border-bottom: none; }
.tkr-vm-item-num {
  font-family: var(--ff-sc);
  font-size: .72rem;
  font-weight: 700;
  color: var(--gold);
  flex-shrink: 0;
  margin-top: .15rem;
  letter-spacing: .06em;
}

/* ══════════════════════════════════
   DELEGATES
══════════════════════════════════ */
.tkr-del {
  background: var(--deep);
  padding: 8rem 2.5rem;
  position: relative;
  overflow: hidden;
}
.tkr-del::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.tkr-del-inner { max-width: 1320px; margin: 0 auto; }
.tkr-del-header { margin-bottom: 5rem; }
.tkr-del .tkr-eyebrow { color: var(--gold-light); }
.tkr-del .tkr-eyebrow-rule { background: var(--gold-light); }
.tkr-del-heading {
  font-family: var(--ff-display);
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--ivory);
  line-height: 1.1;
  letter-spacing: -.02em;
}
.tkr-del-heading em { color: var(--gold-light); font-style: italic; }

.tkr-del-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 0;
  min-height: 480px;
  border: 1px solid var(--border-dark);
}
.tkr-del-nav {
  border-right: 1px solid var(--border-dark);
  display: flex;
  flex-direction: column;
}
.tkr-del-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.4rem 1.6rem;
  border: none;
  border-bottom: 1px solid rgba(200,148,58,.07);
  background: transparent;
  text-align: left;
  transition: background .22s var(--ease);
  cursor: pointer;
  position: relative;
}
.tkr-del-btn:last-child { border-bottom: none; }
.tkr-del-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gold);
  transform: scaleY(0);
  transition: transform .22s var(--ease);
  border-radius: 0 1px 1px 0;
}
.tkr-del-btn:hover { background: rgba(200,148,58,.05); }
.tkr-del-btn--active { background: rgba(200,148,58,.08); }
.tkr-del-btn--active::before { transform: scaleY(1); }
.tkr-del-btn-num {
  font-family: var(--ff-sc);
  font-size: .65rem;
  font-weight: 700;
  color: var(--gold);
  opacity: .5;
  flex-shrink: 0;
  letter-spacing: .06em;
  min-width: 22px;
}
.tkr-del-btn--active .tkr-del-btn-num { opacity: 1; }
.tkr-del-btn-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: .15rem;
  min-width: 0;
}
.tkr-del-btn-role {
  font-size: .68rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: .7;
}
.tkr-del-btn--active .tkr-del-btn-role { opacity: 1; }
.tkr-del-btn-name {
  font-size: .85rem;
  font-weight: 500;
  color: var(--ivory-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tkr-del-btn--active .tkr-del-btn-name { color: var(--ivory); }
.tkr-del-btn-arrow {
  font-size: .9rem;
  color: var(--gold);
  opacity: 0;
  transition: opacity .2s var(--ease), transform .2s var(--ease);
  flex-shrink: 0;
}
.tkr-del-btn--active .tkr-del-btn-arrow,
.tkr-del-btn:hover .tkr-del-btn-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.tkr-del-profile {
  padding: 3.5rem 4rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: start;
  transition: opacity .3s var(--ease), transform .3s var(--ease);
}
.tkr-del-profile--in  { opacity: 1; transform: translateX(0); }
.tkr-del-profile--out { opacity: 0; transform: translateX(16px); }

.tkr-del-photo-area {
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 160px;
}
.tkr-del-photo-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--border-light);
  pointer-events: none;
}
.tkr-del-photo-ring--outer { inset: -14px; opacity: .4; }
.tkr-del-photo-ring--inner { inset: -6px; opacity: .7; }
.tkr-del-photo {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold);
  box-shadow: 0 0 40px rgba(200,148,58,.2);
}
.tkr-del-photo-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--gold);
  color: var(--obsidian);
  font-family: var(--ff-sc);
  font-size: .65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: .04em;
  border: 2px solid var(--deep);
}
.tkr-del-info {}
.tkr-del-role-label {
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: .6rem;
}
.tkr-del-name {
  font-family: var(--ff-display);
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  color: var(--ivory);
  line-height: 1.2;
  letter-spacing: -.01em;
  margin-bottom: 1rem;
}
.tkr-del-quote {
  font-family: var(--ff-display);
  font-size: 1.05rem;
  font-style: italic;
  color: var(--gold-light);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  padding-left: 1.2rem;
  border-left: 2px solid var(--gold);
}
.tkr-del-bio {
  font-size: .92rem;
  line-height: 1.8;
  color: var(--muted);
  font-weight: 300;
  margin-bottom: 2rem;
}
.tkr-del-progress {
  display: flex;
  gap: .4rem;
}
.tkr-del-pip {
  width: 20px;
  height: 2px;
  border-radius: 1px;
  background: rgba(200,148,58,.2);
  transition: all .3s var(--ease);
}
.tkr-del-pip--on {
  background: var(--gold);
  width: 32px;
}

/* ══════════════════════════════════
   AUTH / LOGIN
══════════════════════════════════ */
.tkr-auth {
  background: var(--ivory);
  padding: 8rem 2.5rem;
  position: relative;
  overflow: hidden;
}
.tkr-auth::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: var(--obsidian);
  clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
}
.tkr-auth-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  position: relative;
  z-index: 2;
}
.tkr-auth-left {}
.tkr-auth .tkr-eyebrow { color: var(--gold); }
.tkr-auth .tkr-eyebrow-rule { background: var(--gold); }
.tkr-auth-heading {
  font-family: var(--ff-display);
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  font-weight: 700;
  color: var(--ink);
  line-height: 1.15;
  letter-spacing: -.02em;
  margin-bottom: 1.2rem;
}
.tkr-auth-heading em { color: var(--gold); font-style: italic; }
.tkr-auth-sub {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(9,12,18,.6);
  font-weight: 300;
  margin-bottom: 2.5rem;
  max-width: 380px;
}
.tkr-auth-features { display: flex; flex-direction: column; gap: .8rem; }
.tkr-auth-feat {
  display: flex;
  align-items: center;
  gap: .9rem;
}
.tkr-auth-feat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(200,148,58,.1);
  border: 1px solid rgba(200,148,58,.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.tkr-auth-feat-label {
  font-size: .9rem;
  font-weight: 500;
  color: rgba(9,12,18,.7);
}
.tkr-auth-form-wrap {
  position: relative;
}
.tkr-auth-form-glow {
  position: absolute;
  inset: -30px;
  border-radius: 28px;
  background: radial-gradient(ellipse at center, rgba(200,148,58,.12), transparent 70%);
  pointer-events: none;
  filter: blur(20px);
}
.tkr-auth-form {
  background: var(--surface);
  border: 1px solid var(--border-dark);
  border-radius: 4px;
  padding: 3rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 40px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(200,148,58,.1);
}
.tkr-auth-form-top { margin-bottom: 2.5rem; }
.tkr-auth-form-eyebrow {
  display: block;
  font-size: .63rem;
  font-weight: 700;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: .6rem;
}
.tkr-auth-form-title {
  font-family: var(--ff-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--ivory);
  line-height: 1.1;
  letter-spacing: -.01em;
  margin-bottom: .4rem;
}
.tkr-auth-form-hint {
  font-size: .85rem;
  font-weight: 300;
  color: var(--muted);
}
.tkr-auth-field { margin-bottom: 1.2rem; }
.tkr-auth-label {
  display: block;
  font-size: .66rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(245,240,232,.4);
  margin-bottom: .55rem;
}
.tkr-auth-input {
  width: 100%;
  padding: .9rem 1.1rem;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(200,148,58,.15);
  border-radius: 2px;
  font-family: var(--ff-body);
  font-size: .95rem;
  font-weight: 400;
  color: var(--ivory);
  outline: none;
  transition: border-color .2s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease);
}
.tkr-auth-input::placeholder { color: rgba(245,240,232,.2); }
.tkr-auth-input:focus {
  border-color: var(--gold);
  background: rgba(200,148,58,.06);
  box-shadow: 0 0 0 3px rgba(200,148,58,.1);
}
.tkr-auth-input:disabled { opacity: .5; cursor: not-allowed; }
.tkr-auth-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  margin-top: 1.75rem;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: var(--obsidian);
  border: none;
  border-radius: 2px;
  font-size: .92rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .7rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform .2s var(--ease-spring), box-shadow .2s var(--ease), opacity .2s;
}
.tkr-auth-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
  opacity: 0;
  transition: opacity .2s;
}
.tkr-auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(200,148,58,.4);
}
.tkr-auth-btn:hover:not(:disabled)::before { opacity: 1; }
.tkr-auth-btn:active:not(:disabled) { transform: translateY(0); }
.tkr-auth-btn:disabled { opacity: .55; cursor: not-allowed; }
.tkr-auth-btn-arrow {
  font-size: 1.1rem;
  transition: transform .2s var(--ease);
}
.tkr-auth-btn:hover:not(:disabled) .tkr-auth-btn-arrow { transform: translateX(4px); }
.tkr-auth-btn--loading { opacity: .65; pointer-events: none; }
.tkr-auth-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(9,12,18,.2);
  border-top-color: var(--obsidian);
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}

/* ══════════════════════════════════
   FOOTER
══════════════════════════════════ */
.tkr-footer {
  background: var(--obsidian);
  border-top: 1px solid var(--border-dark);
  padding: 2.2rem 2.5rem;
}
.tkr-footer-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.tkr-footer-brand { display: flex; align-items: center; gap: .75rem; }
.tkr-footer-logo {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--gold);
  object-fit: cover;
  opacity: .9;
}
.tkr-footer-name {
  font-family: var(--ff-sc);
  font-size: 1rem;
  font-weight: 700;
  color: var(--ivory);
  letter-spacing: .06em;
}
.tkr-footer-copy { text-align: right; }
.tkr-footer-copy p {
  font-size: .75rem;
  color: rgba(245,240,232,.35);
  line-height: 1.8;
}
.tkr-footer-copy p:first-child { color: rgba(245,240,232,.6); font-weight: 500; }

/* ══════════════════════════════════
   RESPONSIVE — TABLET ≤ 960px
══════════════════════════════════ */
@media (max-width: 960px) {
  .tkr-about-inner { grid-template-columns: 1fr; gap: 3.5rem; }
  .tkr-about-left  { position: static; }

  .tkr-vm-inner    { grid-template-columns: 1fr; }
  .tkr-vm-block--vision { border-right: 1px solid var(--border-dark); border-bottom: none; border-radius: 2px 2px 0 0; }
  .tkr-vm-block--mission { border-left: 1px solid var(--border-dark); border-radius: 0 0 2px 2px; }
  .tkr-vm-spine    { flex-direction: row; padding: 0 4rem; height: 50px; }
  .tkr-vm-spine-line { flex: 1; height: 1px; width: auto; background: linear-gradient(to right, transparent, var(--gold), transparent); }

  .tkr-del-layout  { grid-template-columns: 1fr; }
  .tkr-del-nav     { border-right: none; border-bottom: 1px solid var(--border-dark); flex-direction: row; flex-wrap: wrap; }
  .tkr-del-btn     { flex: 1; min-width: 150px; border-bottom: none; border-right: 1px solid rgba(200,148,58,.07); padding: 1rem; }
  .tkr-del-btn-name { display: none; }
  .tkr-del-btn-arrow { display: none; }
  .tkr-del-profile { grid-template-columns: 1fr; gap: 2rem; padding: 2.5rem; text-align: center; }
  .tkr-del-photo-area { margin: 0 auto; }

  .tkr-auth::before { display: none; }
  .tkr-auth { background: var(--ivory); }
  .tkr-auth-inner { grid-template-columns: 1fr; gap: 3.5rem; }
  .tkr-auth-form { background: var(--surface); }
}

/* ══════════════════════════════════
   RESPONSIVE — MOBILE ≤ 640px
══════════════════════════════════ */
@media (max-width: 640px) {
  .tkr-nav-inner   { padding: 0 1.25rem; }
  .tkr-nav-loc     { display: none; }
  .tkr-nav-tagline { display: none; }

  .tkr-hero-content { left: 5vw; bottom: 16%; }
  .tkr-hero-controls { left: 5vw; }
  .tkr-hero-scroll-cue { display: none; }

  .tkr-about, .tkr-vm, .tkr-del, .tkr-auth { padding: 5rem 1.5rem; }
  .tkr-about-bg-text { display: none; }
  .tkr-about-stats { grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; }

  .tkr-vm-block   { padding: 2.5rem 1.75rem; }
  .tkr-vm-spine   { padding: 0 2rem; }

  .tkr-del-header { margin-bottom: 3rem; }
  .tkr-del-btn-role { font-size: .6rem; }

  .tkr-auth-form  { padding: 2rem 1.5rem; }
  .tkr-footer     { padding: 1.75rem 1.5rem; }
  .tkr-footer-inner { justify-content: center; text-align: center; }
  .tkr-footer-copy { text-align: center; }
}
`;
