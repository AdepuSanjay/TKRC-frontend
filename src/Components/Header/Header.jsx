import React from 'react';
import './Header.css';

function Header() {
  return (
    <footer className="saas-footer-block">
      <div className="saas-footer-block__inner">
        
        {/* Left Column: Branding */}
        <div className="saas-footer-block__brand">
          <img src="./images/logo.png" alt="TKRCET Logo" className="saas-footer-block__logo" />
          <div>
            <h2 className="saas-footer-block__title">
              TKR COLLEGE OF ENGINEERING & TECHNOLOGY
            </h2>
            <span className="saas-footer-block__highlight">An Autonomous Institution</span>
          </div>
        </div>

        {/* Center Column: Contact & Location */}
        <div className="saas-footer-block__info">
          <span className="saas-footer-block__badge">COLLEGE CODE: K9</span>
          <p className="saas-footer-block__text">
            Survey No.8/A, Medbowli, Meerpet<br />
            Hyderabad - 500097, Telangana, INDIA
          </p>
          <a href="http://www.tkrct.ac.in" className="saas-footer-block__link">
            www.tkrct.ac.in
          </a>
        </div>

        {/* Right Column: Accreditation */}
        <div className="saas-footer-block__accreditation">
          <p className="saas-footer-block__text">
            Accredited with 'A+' Grade by NAAC<br />
            Approved by AICTE, New Delhi<br />
            Affiliated to JNTUH<br />
            Recognized under 2(f) & 12(B) of UGC
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Header;
