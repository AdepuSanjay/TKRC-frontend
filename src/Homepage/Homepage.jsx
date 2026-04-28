import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Homepage.css';

const Homepage = () => {
    const navigate = useNavigate();

    const imagesLoader = [
        "./images/campus.webp",
        "./images/collage4.jpg",
        "./images/collage2.jpg",
        "./images/collage1.jpg"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fadeImg, setFadeImg] = useState(true);

    const delegateInfo = {
        chairman: {
            name: "Sri Teegala Krishna Reddy",
            role: "Chairman",
            photo: "../images/tkrcet-chairman.webp",
            description: "Teegala Krishna Reddy Engineering College has grown in leaps and bounds, hurtling across barriers along the way. This has been made possible with the collaborative effort of the Management, the Staff and the Students. Together, let's continue to strive for excellence and shape a brighter future."
        },
        secretary: {
            name: "Dr. T. Harinath Reddy",
            role: "Secretary",
            photo: "../images/tkrcet-secretary.webp",
            description: "Engineers play the most vital and important role in nation building. TEEGALA KRISHNA REDDY EDUCATIONAL SOCIETY is a venture contributing to this endeavour of providing world-class technical education and empowering students to become global leaders."
        },
        treasurer: {
            name: "Sri. T. Amaranath Reddy",
            role: "Treasurer",
            photo: "../images/tkres-treasurer1.webp",
            description: "The motive of TKRES is to develop a global perspective to cope with the fast changing technology scenario. Values with discipline are the hallmark of our college — emphasis not only on academic excellence but the development of the overall personality of a student."
        },
        principal: {
            name: "Dr. D. V. Ravi Shankar",
            role: "Principal",
            photo: "../images/tkr-principal.webp",
            description: "Dr. D. V. Ravi Shankar obtained his AMIE from Institution of Engineers, M.Tech in Materials Engineering from NIT Suratkal, and Ph.D in Mechanical Engineering from JNT University, Hyderabad. He has 23 years of distinguished academic experience."
        },
        dean: {
            name: "Dr. A. Suresh Rao",
            role: "Vice Principal & Dean",
            photo: "../images/suresh_cse.webp",
            description: "Dr. A. Suresh Rao, Professor in CSE, was conferred with a PhD from NIT Warangal in 2015. He currently serves as Vice Principal, Dean of Academics and HoD of CSE at TKRCET, with 20 years of experience spanning industry and academia."
        },
        coe: {
            name: "Dr. D. Nageshwar Rao",
            role: "Controller of Examinations",
            photo: "../images/coe.webp",
            description: "A distinguished academician with 20 years of teaching experience. He pursued Ph.D in VLSI from GITAM University and has published several research papers in National and International journals, guiding research scholars and resource persons."
        }
    };

    const delegateKeys = Object.keys(delegateInfo);
    const [currentDelegateIndex, setCurrentDelegateIndex] = useState(0);
    const [fadeDelegate, setFadeDelegate] = useState(true);

    // Image carousel with fade
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeImg(false);
            setTimeout(() => {
                setCurrentImageIndex(prev => (prev + 1) % imagesLoader.length);
                setFadeImg(true);
            }, 400);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Delegate carousel with fade
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeDelegate(false);
            setTimeout(() => {
                setCurrentDelegateIndex(prev => (prev + 1) % delegateKeys.length);
                setFadeDelegate(true);
            }, 300);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDelegateChange = (index) => {
        setFadeDelegate(false);
        setTimeout(() => {
            setCurrentDelegateIndex(index);
            setFadeDelegate(true);
        }, 200);
    };

    const currentDelegate = delegateInfo[delegateKeys[currentDelegateIndex]];
    const currentImage = imagesLoader[currentImageIndex];

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            let facultyResponse = await axios.post('https://tkrc-backend.vercel.app/faculty/login', { username, password });
            if (facultyResponse.data.success) {
                const faculty = facultyResponse.data.faculty;
                localStorage.setItem("facultyId", faculty.id);
                toast.success(`Welcome, ${faculty.name}!`, { position: "top-right" });
                setTimeout(() => navigate('/index'), 2000);
                return;
            }
        } catch (err) {}

        try {
            let studentResponse = await axios.post('https://tkrcet-backend-g3zu.onrender.com/Section/login', {
                rollNumber: username, password,
            });
            if (studentResponse.data.success) {
                const student = studentResponse.data.student;
                if (student && student.id) {
                    localStorage.setItem("studentId", student.rollNumber);
                    toast.success(`Welcome, ${student.name}!`, { position: "top-right" });
                    setTimeout(() => navigate('/index'), 2000);
                    return;
                }
            }
        } catch (err) {
            toast.error("Invalid credentials. Please try again.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="tkr-root">
            <ToastContainer />

            {/* ── HEADER ── */}
            <header className="tkr-header">
                <div className="tkr-header__inner">
                    <div className="tkr-header__brand">
                        <img className="tkr-header__logo" src="./images/logo.png" alt="TKRCET Logo" />
                        <div className="tkr-header__title-wrap">
                            <span className="tkr-header__title">T.K.R. College of Engineering & Technology</span>
                            <span className="tkr-header__sub">Affiliated to JNTUH · Approved by AICTE · Est. 2002</span>
                        </div>
                    </div>
                    <div className="tkr-header__badge">Meerpet, Hyderabad</div>
                </div>
            </header>

            {/* ── HERO CAROUSEL ── */}
            <section className="tkr-hero">
                <img
                    className={`tkr-hero__img ${fadeImg ? 'tkr-hero__img--visible' : ''}`}
                    src={currentImage}
                    alt="TKRCET Campus"
                />
                <div className="tkr-hero__overlay">
                    <div className="tkr-hero__text">
                        <p className="tkr-hero__eyebrow">Welcome to TKRCET</p>
                        <h1 className="tkr-hero__headline">Shaping Tomorrow's<br />Engineers Today</h1>
                    </div>
                    <div className="tkr-hero__dots">
                        {imagesLoader.map((_, i) => (
                            <button
                                key={i}
                                className={`tkr-hero__dot ${i === currentImageIndex ? 'tkr-hero__dot--active' : ''}`}
                                onClick={() => setCurrentImageIndex(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT SECTION ── */}
            <section className="tkr-about">
                <div className="tkr-about__inner">
                    <div className="tkr-section-label">About Us</div>
                    <h2 className="tkr-about__heading">About TKRCET Campus</h2>
                    <div className="tkr-about__divider" />
                    <p className="tkr-about__body">
                        TKR College of Engineering and Technology — a modern temple of learning, established in 2002 in a sprawling,
                        lush green 20-acre campus at Meerpet, Hyderabad. The college provides a serene and tranquil environment,
                        boosting students' mental potential and preparing them to face global competition with confidence.
                    </p>
                    <p className="tkr-about__body">
                        Founded by Sri Teegala Krishna Reddy, Mayor of Hyderabad and a visionary philanthropist, TKRCET is driven
                        by the mission to make quality education accessible to every student, upholding moral and ethical values.
                        The college is affiliated to JNTUH, approved by AICTE, New Delhi, and the State Government of Telangana.
                    </p>
                    <p className="tkr-about__body">
                        TKRCET offers seven UG programmes — Civil, EEE, CSE, ECE, Mechanical Engineering — along with PG courses
                        in M.Tech (CSE, PE) and MBA. The college also runs a second-shift Polytechnic in Civil, EEE, Mech, ECE & CSE.
                    </p>
                    <div className="tkr-about__stats">
                        <div className="tkr-stat">
                            <span className="tkr-stat__num">20+</span>
                            <span className="tkr-stat__label">Acre Campus</span>
                        </div>
                        <div className="tkr-stat">
                            <span className="tkr-stat__num">7+</span>
                            <span className="tkr-stat__label">UG Programmes</span>
                        </div>
                        <div className="tkr-stat">
                            <span className="tkr-stat__num">2002</span>
                            <span className="tkr-stat__label">Established</span>
                        </div>
                        <div className="tkr-stat">
                            <span className="tkr-stat__num">AICTE</span>
                            <span className="tkr-stat__label">Approved</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DELEGATES SECTION ── */}
            <section className="tkr-delegates">
                <div className="tkr-delegates__inner">
                    <div className="tkr-section-label tkr-section-label--light">Leadership</div>
                    <h2 className="tkr-delegates__heading">Our Magnificent Delegates</h2>
                    <div className="tkr-delegates__divider" />

                    {/* Tab Buttons */}
                    <div className="tkr-delegates__tabs">
                        {delegateKeys.map((key, index) => (
                            <button
                                key={key}
                                className={`tkr-delegates__tab ${currentDelegateIndex === index ? 'tkr-delegates__tab--active' : ''}`}
                                onClick={() => handleDelegateChange(index)}
                            >
                                {delegateInfo[key].role}
                            </button>
                        ))}
                    </div>

                    {/* Delegate Profile */}
                    <div className={`tkr-delegates__profile ${fadeDelegate ? 'tkr-delegates__profile--visible' : ''}`}>
                        <div className="tkr-delegates__photo-wrap">
                            <img
                                className="tkr-delegates__photo"
                                src={currentDelegate.photo}
                                alt={currentDelegate.name}
                            />
                            <div className="tkr-delegates__photo-ring" />
                        </div>
                        <div className="tkr-delegates__info">
                            <p className="tkr-delegates__role">{currentDelegate.role}</p>
                            <h3 className="tkr-delegates__name">{currentDelegate.name}</h3>
                            <p className="tkr-delegates__desc">{currentDelegate.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VISION & MISSION ── */}
            <section className="tkr-vm">
                <div className="tkr-vm__inner">
                    <div className="tkr-vm__block tkr-vm__block--vision">
                        <div className="tkr-vm__icon">◈</div>
                        <h3 className="tkr-vm__title">Institution Vision</h3>
                        <p className="tkr-vm__text">
                            To be a premier institution of excellence — empowering students with knowledge, skills, and ethical values
                            to become innovative engineers who contribute meaningfully to society and the nation.
                        </p>
                    </div>
                    <div className="tkr-vm__divider" />
                    <div className="tkr-vm__block tkr-vm__block--mission">
                        <div className="tkr-vm__icon">◆</div>
                        <h3 className="tkr-vm__title">Institution Mission</h3>
                        <ul className="tkr-vm__list">
                            <li>Ensuring excellent branch-wise infrastructural facilities for all disciplines</li>
                            <li>Making the institute a premier research and resource centre</li>
                            <li>Fostering industry-academia partnerships for real-world exposure</li>
                            <li>Nurturing holistic development — academic, personal, and professional</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── LOGIN SECTION ── */}
            <section className="tkr-login-section">
                <div className="tkr-login-section__inner">
                    <div className="tkr-login-section__left">
                        <div className="tkr-section-label">Portal Access</div>
                        <h2 className="tkr-login-section__heading">Sign In to<br />Your Account</h2>
                        <p className="tkr-login-section__sub">
                            Access your academic dashboard, attendance records, results and more — for both students and faculty.
                        </p>
                        <div className="tkr-login-section__features">
                            <div className="tkr-feature">
                                <span className="tkr-feature__icon">📋</span>
                                <span>Attendance Tracking</span>
                            </div>
                            <div className="tkr-feature">
                                <span className="tkr-feature__icon">📊</span>
                                <span>Academic Results</span>
                            </div>
                            <div className="tkr-feature">
                                <span className="tkr-feature__icon">📅</span>
                                <span>Timetable & Schedule</span>
                            </div>
                        </div>
                    </div>

                    <div className="tkr-login-box">
                        <div className="tkr-login-box__eyebrow">Student &amp; Faculty Portal</div>
                        <h3 className="tkr-login-box__title">Welcome Back</h3>
                        <p className="tkr-login-box__hint">Enter your credentials to continue</p>

                        <div className="tkr-field">
                            <label className="tkr-field__label">Username / Roll Number</label>
                            <input
                                className="tkr-field__input"
                                type="text"
                                placeholder="e.g. D600 or 20A81A0501"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                        </div>

                        <div className="tkr-field">
                            <label className="tkr-field__label">Password</label>
                            <input
                                className="tkr-field__input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                        </div>

                        {error && <p className="tkr-login-box__error">{error}</p>}

                        <button
                            className={`tkr-login-box__btn ${loading ? 'tkr-login-box__btn--loading' : ''}`}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="tkr-spinner" />
                            ) : (
                                <>Login <span className="tkr-login-box__arrow">→</span></>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="tkr-footer">
                <div className="tkr-footer__inner">
                    <div className="tkr-footer__brand">
                        <img className="tkr-footer__logo" src="./images/logo.png" alt="TKRCET" />
                        <span className="tkr-footer__name">TKRCET</span>
                    </div>
                    <div className="tkr-footer__copy">
                        <p>Copyright © 2024 TKR College of Engineering & Technology. All Rights Reserved.</p>
                        <p>Designed & Developed by Mr. Md. Shakeel (TKRES)</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
