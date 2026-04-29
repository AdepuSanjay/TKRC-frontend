import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className="header-container">
      
      <div className="info-left">
        <p className="college-code">COLLEGE CODE: K9</p>
        <p className="address">
          Survey No.8/A, Medbowli, Meerpet<br />
          Hyderabad - 500097, Telangana, INDIA
        </p>
        <p>
          <a href="http://www.tkrct.ac.in" className="website-link" target="_blank" rel="noopener noreferrer">
            www.tkrct.ac.in
          </a>
        </p>
      </div>

      <div className="content-center">
        <img src="./images/logo.png" alt="TKRCET Logo" className="college-logo" />
        <h1 className="college-name">
          TKR COLLEGE OF ENGINEERING & TECHNOLOGY
        </h1>
      </div>

      <div className="info-right">
        <p className="autonomous-text">An Autonomous Institution</p>
        <p className="accreditation-info">
          Accredited with 'A+' Grade by NAAC<br />
          Approved by AICTE, New Delhi<br />
          Affiliated to JNTUH<br />
          Recognized under 2(f) & 12(B) of UGC
        </p>
      </div>

    </div>
  );
}

export default Header;
