import React, { useState, useEffect } from 'react';
import './DelegatesInfo.css';

const DelegatesInfo = () => {
    const delegateInfo = {
        chairman: {
            name: "Sri Teegala Krishna Reddy",
            photo: "./images/tkrcet-chairman.webp",
            description: "The newsletter which is being rolled out today marks the launch of an effervescent activity that would enable the management to bring out to the eyes of the competitive world, the academic achievements of our prestigious institution. Teegala Krishna Reddy Engineering College has grown in leaps and bounds, hurtling across barriers along the way. This has been made possible with the collaborative effort of the Management, the Staff and the Students."
        },
        secretary: {
            name: "Dr. T. Harinath Reddy",
            photo: "./images/tkrcet-secretary.webp",
            description: "Engineers play the most vital and important role in nation building. In modern times, nations which have rich engineering and experienced management domains are flourishing economically. The essence of Engineering and Management education which has spread in India is a very positive sign not only to cater domestic needs but provide manpower to the entire world. TKRES is a venture contributing to this Endeavour."
        },
        treasurer: {
            name: "Sri. T. Amaranath Reddy",
            photo: "./images/tkres-treasurer1.webp",
            description: "The motive of TKRES is to develop a global perspective to cope-up with the fast changing technology scenario. Values with discipline are the hallmark of our college, ensuring quality of the students. The emphasis is not only on academic excellence but the development of the overall total personality of a student. We take special care to ensure that new ideas are not merely discussed here but executed."
        },
        principal: {
            name: "Dr. D. V. Ravi Shankar",
            photo: "./images/tkr-principal.webp",
            description: "Dr. D. V. Ravi Shankar, Principal, TKRCET obtained his AMIE from Institution of Engineers in 1987, and his M.Tech in Materials Engineering from NIT Suratkal in 1994. He obtained his Ph.D in Mechanical Engineering in 2010 from JNTUH under the guidance of Dr. P. Rami Reddy. He brings over 23 years of rich academic experience to our institution."
        },
        dean: {
            name: "Dr. A. Suresh Rao",
            photo: "./images/suresh_cse.webp",
            description: "Dr. A. Suresh Rao, Vice-Principal & Dean of Academics at TKRCET, is a Professor in the CSE Department. He was conferred with a PhD in Computer Science & Engineering from NIT Warangal in 2015. His experience spans 20 years; 2 years in the Industry and 18 Years in Teaching. Apart from teaching, he is also a highly discerning administrator."
        },
        coe: {
            name: "Dr. D. Nageshwar Rao",
            photo: "./images/coe.webp",
            description: "A distinguished academician with 20 Years of teaching experience. He pursued Masters from JNTU Hyderabad and Ph.D in VLSI from GITAM University, Vishakhapatnam. He has published several research papers in National and International journals and is presently guiding research scholars. He has been awarded the Certificate of Merit in NIET for two consecutive years."
        }
    };

    const delegateKeys = Object.keys(delegateInfo);
    const [currentDelegateIndex, setCurrentDelegateIndex] = useState(0);

    useEffect(() => {
        const delegateInterval = setInterval(() => {
            setCurrentDelegateIndex((prevIndex) => (prevIndex + 1) % delegateKeys.length);
        }, 5000);

        return () => clearInterval(delegateInterval);
    }, [delegateKeys.length]);

    const currentDelegate = delegateInfo[delegateKeys[currentDelegateIndex]];

    return (
        <div className="saas-del-widget">
            <div className="saas-del-nav-scroll">
                <div className="saas-del-nav">
                    {delegateKeys.map((key, index) => (
                        <button
                            key={key}
                            onClick={() => setCurrentDelegateIndex(index)}
                            className={`saas-del-btn ${currentDelegateIndex === index ? 'active' : ''}`}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* The 'key' attribute here forces React to re-render this block, triggering the CSS fade animation */}
            <div className="saas-del-content" key={currentDelegateIndex}>
                <img
                    src={currentDelegate.photo}
                    alt={currentDelegate.name}
                    className="saas-del-avatar"
                />
                <div className="saas-del-text">
                    <h4 className="saas-del-name">{currentDelegate.name}</h4>
                    <span className="saas-del-role">{delegateKeys[currentDelegateIndex].toUpperCase()}</span>
                    <p className="saas-del-desc">{currentDelegate.description}</p>
                </div>
            </div>
        </div>
    );
};

export default DelegatesInfo;
