import React, { useState, useEffect } from 'react';
import './VideoSection.css';

function VideoSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Array of your Cloudinary images
  const images = [
    "https://res.cloudinary.com/dppiuypop/image/upload/v1781322243/campus_g4ikzj.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1781322242/unnamed_1_zjglh2.webp"
  ];

  const typingPhrases = [
    "Welcome to TKRCET.",
    "Empowering Future Engineers.",
    "An Autonomous Institution.",
    "Excellence in Education."
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [images.length]);

  useEffect(() => {
    let timer;
    const handleType = () => {
      const i = loopNum % typingPhrases.length;
      const fullText = typingPhrases[i];

      setTypedText(
        isDeleting
          ? fullText.substring(0, typedText.length - 1)
          : fullText.substring(0, typedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && typedText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timer = setTimeout(() => {}, 500);
      } else {
        timer = setTimeout(handleType, typingSpeed);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed, typingPhrases]);

  return (
    <section className="saas-hero-slider-section">
      <div className="saas-slider-wrapper">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`TKRCET Campus Slide ${index + 1}`}
            className={`saas-slider-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      
      <div className="saas-slider-overlay"></div>

      <div className="saas-hero-content">
        <h1 className="saas-hero-typing-text">
          {typedText}
          <span className="saas-cursor">|</span>
        </h1>
        <p className="saas-hero-subtext">
          Shaping tomorrow's innovators with world-class facilities and global standards.
        </p>
        <button className="saas-hero-btn" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}>
          Explore Campus
        </button>
      </div>
    </section>
  );
}

export default VideoSection;
