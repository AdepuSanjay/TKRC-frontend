import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className="saas-doc-header">
      <div className="saas-doc-header__left">
        <span className="saas-doc-badge">COLLEGE CODE: K9</span>
        <p className="saas-doc-text">
          Survey No.8/A, Medbowli, Meerpet<br />
          Hyderabad - 500097, Telangana, INDIA
        </p>
        <a href="http://www.tkrct.ac.in" className="saas-doc-link">
          www.tkrct.ac.in
        </a>
      </div>

      <div className="saas-doc-header__center">
        <img src="./images/logo.png" alt="TKRCET Logo" className="saas-doc-logo" />
        <h1 className="saas-doc-title">
          TKR COLLEGE OF ENGINEERING & TECHNOLOGY
        </h1>
      </div>

      <div className="saas-doc-header__right">
        <span className="saas-doc-highlight">An Autonomous Institution</span>
        <p className="saas-doc-text">
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
 