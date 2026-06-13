import React from 'react';
import './DelegatesInfo.css';

const DelegatesInfo = () => {
    return (
        <section className="saas-about-section">
            <div className="saas-about-container">
                
                {/* Main Campus Introduction */}
                <div className="saas-about-header">
                    <span className="saas-about-badge">Our Campus</span>
                    <h2 className="saas-about-title">About The Campus</h2>
                    <p className="saas-about-lead">
                        TKR College of Engineering and Technology – a modern temple of learning, an off shoot of the TKR Educational Society was established in the year 2002 in a sprawling, lush green 20 acre campus at Meerpet, Hyderabad. The college provides a serene and tranquil environment to the students, boosting their mental potential and preparing them in all aspects to face the cut-throat global competition with a smile on the face and emerge victorious.
                    </p>
                </div>

                {/* Information Grid Cards */}
                <div className="saas-about-grid">
                    
                    {/* Card 1: Chairman */}
                    <div className="saas-about-card">
                        <div className="saas-about-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <polyline points="16 11 18 13 22 9"></polyline>
                            </svg>
                        </div>
                        <h3>The Founder's Vision</h3>
                        <p>
                            Sri Teegala Krishna Reddy, the Mayor of Hyderabad, is the founder chairman of TKR Educational Society. A Philanthropist by nature, "the friend of man, to vice alone of foe", and an urge to see our students excelling themselves in all fields prompted him to start the educational society; making it easy for education to be within arm’s length of even a rural student and providing them with an independent and easy in the for pursuing their dreams and making them come true and in the process upholding moral and ethical values.
                        </p>
                    </div>

                    {/* Card 2: Secretary */}
                    <div className="saas-about-card">
                        <div className="saas-about-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <h3>Unwavering Dedication</h3>
                        <p>
                            The person puts in all his efforts to see the students excelling themselves and takes great pride in watching them carve out a niche for themselves is none other than Dr.T.Harinath Reddy, the Secretary of the college. A calm and serene countenance with sharp, twinkling eyes, he is the pivotal of encouragement and is always on the look out for avenues, which would provide the wherewithal for developing a cutting edge to their capabilities and potentialities.
                        </p>
                    </div>

                    {/* Card 3: Affiliations */}
                    <div className="saas-about-card">
                        <div className="saas-about-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <h3>Academic Excellence</h3>
                        <p>
                            The College is affiliated to Jawaharlal Nehru Technological University Kukatpally, Hyderabd. It has been approved by AICTE, New Delhi and the State Government of Telangana and has been sanctioned seven UG courses – Civil Engineering, Electrical & Electronics Engineering, Computer Science & Engineering, Electronics & Communication Engineering, Mechanical Engineering and PG Courses – M.Tech in CSE, PE & MBA. In addition the College is running second shift Polytechnic.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DelegatesInfo;
