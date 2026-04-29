import React from 'react';
import Header from '../Components/Header/Header';
import NavBar from '../Components/NavBar/NavBar.jsx';
import VideoSection from '../Components/VideoSection/VideoSection.jsx';
import Footer from '../Components/Footer/Footer.jsx';
import MobileNav from "../Components/MobileNav/MobileNav.jsx"
import "./Landingpage.css"
import DelegatesInfo from "../Components/DelegatesInfo/DelegatesInfo.jsx"
const Landingpage=()=>{
  return(
    <div>
      
               
              <div class="nav">
          <NavBar/>
        </div>
        <div class="mob-nav">
        <MobileNav/>
        </div>
        
        <VideoSection/>
        
          <DelegatesInfo/>
  <Header />
               
    </div>
    )
}
export default Landingpage;
