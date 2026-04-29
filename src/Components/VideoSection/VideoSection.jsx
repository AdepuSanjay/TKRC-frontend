import React, { useState } from 'react';
import './VideoSection.css';

function VideoSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="saas-video-section">
      <div className={`saas-video-wrapper ${!isVideoLoaded ? 'skeleton-loading' : ''}`}>
        <video
          src="./images/tkr.mp4"
          autoPlay
          loop
          muted
          playsInline /* Required for iOS mobile autoplay */
          className={`saas-video ${isVideoLoaded ? 'loaded' : ''}`}
          onLoadedData={() => setIsVideoLoaded(true)}
        />
      </div>
    </section>
  );
}

export default VideoSection;
