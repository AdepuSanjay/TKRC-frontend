import React, { useState, useEffect } from 'react';
import './VideoSection.css';

function VideoSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of your Cloudinary images
  const images = [
    "https://res.cloudinary.com/dppiuypop/image/upload/v1781322243/campus_g4ikzj.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1781322242/unnamed_1_zjglh2.webp"
  ];

  // Auto-slide logic: Changes the image every 4 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    // Cleanup interval on unmount to prevent memory leaks
    return () => clearInterval(slideInterval);
  }, [images.length]);

  return (
    <section className="saas-video-section">
      <div className="saas-slider-wrapper">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Campus Slide ${index + 1}`}
            // Add 'active' class to the current image for the fade effect
            className={`saas-slider-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      
      {/* Optional: Add a dark overlay so text placed on top is readable */}
      <div className="saas-slider-overlay"></div>
    </section>
  );
}

export default VideoSection;
