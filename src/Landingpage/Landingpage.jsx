import React, { useEffect } from 'react';
import Header from '../Components/Header/Header';
import NavBar from '../Components/NavBar/NavBar.jsx';
import VideoSection from '../Components/VideoSection/VideoSection.jsx';
import Footer from '../Components/Footer/Footer.jsx';
import MobileNav from "../Components/MobileNav/MobileNav.jsx";
import "./Landingpage.css";
import DelegatesInfo from "../Components/DelegatesInfo/DelegatesInfo.jsx";

const Landingpage = () => {
  // NEW: Forces the page to scroll to the very top when it loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="nav">
        <NavBar />
      </div>
      
      <div className="mob-nav">
        <MobileNav />
      </div>

      <VideoSection />

      <DelegatesInfo />
      
      <Header />
    </div>
  );
};

export default Landingpage;
