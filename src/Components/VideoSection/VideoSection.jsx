import React, { useState } from 'react';
import './VideoSection.css';

function VideoSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="saas-video-section">
      <div className="saas-video-wrapper">
        <div className="saas-video-inner">
          {/* Skeleton Loader - Shows while video is downloading */}
          {!isVideoLoaded && <div className="saas-skeleton-loader"></div>}
          
          <video
            src="./images/tkr.mp4"
            autoPlay
            loop
            muted
            playsInline /* Required for iOS mobile autoplay */
            onLoadedData={() => setIsVideoLoaded(true)} /* Triggers when video is ready */
            className={`saas-video ${isVideoLoaded ? 'loaded' : ''}`}
          />
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
