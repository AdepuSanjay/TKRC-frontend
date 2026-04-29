import React from 'react';
import './VideoSection.css';

function VideoSection() {
  return (
    <section className="saas-video-section">
      <div className="saas-video-wrapper">
        <video
          src="./images/tkr.mp4"
          autoPlay
          loop
          muted
          playsInline /* Required for iOS mobile autoplay */
          className="saas-video"
        />
      </div>
    </section>
  );
}

export default VideoSection;
