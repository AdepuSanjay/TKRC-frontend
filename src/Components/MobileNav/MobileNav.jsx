import React, { useState, useEffect } from "react";      
import "./MobileNav.css";      
import { Link, useNavigate } from "react-router-dom";      
import axios from "axios";      

const MenuItem = ({ label, onClick, active }) => (      
  <div      
    className={`saas-mobile-item ${active ? "active" : ""}`}      
    onClick={onClick}      
    role="button"      
    tabIndex="0"      
    aria-pressed={active}      
  >      
    {label}      
  </div>      
);      

const Dropdown = ({ children, isOpen }) => (      
  <div className={`saas-mobile-dropdown ${isOpen ? "open" : ""}`}>{children}</div>      
);      

const MobileNav = () => {      
  const [menuOpen, setMenuOpen] = useState(false);      
  const [activeMenu, setActiveMenu] = useState(null);      
  const [showDynamicClasses, setShowDynamicClasses] = useState(false);      
  const [classOptions, setClassOptions] = useState([]);      
  const [loading, setLoading] = useState(false);      
  const [userData, setUserData] = useState(null);      
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);      

  const facultyId = localStorage.getItem("facultyId");      
  const studentId = localStorage.getItem("studentId");      
  const navigate = useNavigate();      

  // Fetch user data based on role      
  const fetchUserData = async () => {      
    try {      
      if (facultyId) {      
        const response = await axios.get(      
          `https://tkrc-backend.vercel.app/faculty/${facultyId}`      
        );      
        setUserData(response.data);      
      } else if (studentId) {      
        const response = await axios.get(      
          `https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`      
        );      
        setUserData(response.data.student);      
      }      
    } catch (error) {      
      console.error("Error fetching user data:", error);      
    }      
  };      

  // Fetch faculty timetable dynamically      
  const fetchClassOptions = async () => {      
    if (!userData || userData.role !== "faculty") return;      

    setLoading(true);      
    try {      
      const response = await axios.get(      
        `https://tkrc-backend.vercel.app/faculty/${userData.facultyId}/timetable-today`      
      );      
      const classes = response.data.classes || [];      

      // Remove empty periods and duplicate classes      
      const uniqueClasses = classes.filter((period, index, self) => {      
        return (      
          period.subject &&      
          self.findIndex(      
            (item) =>      
              item.subject === period.subject &&      
              item.programYear === period.programYear &&      
              item.department === period.department &&      
              item.section === period.section      
          ) === index      
        );      
      });      

      setClassOptions(uniqueClasses);      
    } catch (error) {      
      console.error("Error fetching class options:", error);      
      setClassOptions([]);      
    } finally {      
      setLoading(false);      
    }      
  };      

  // Logout function      
  const handleLogout = () => {      
    localStorage.removeItem("facultyId");      
    localStorage.removeItem("studentId");      
    navigate("/"); // Redirect to login page      
  };      

  // Toggle main menu      
  const toggleMenu = () => {      
    setMenuOpen(!menuOpen);      
    setActiveMenu(null);      
    setShowDynamicClasses(false);      
    setAccountMenuOpen(false);      
  };      

  // Handle class selection for faculty      
  const handleClassSelect = (option) => {      
    const { programYear, department, section, subject } = option;      
    navigate(      
      `/attendance?programYear=${programYear}&department=${department}&section=${section}&subject=${subject}`      
    );      
    setMenuOpen(false); // Close menu on navigation
  };      

  // Handle Attendance Click      
  const handleAttendanceClick = () => {      
    if (userData?.role === "student") {      
      navigate("/student");      
      setMenuOpen(false);
    } else {      
      setActiveMenu(activeMenu === "attendance" ? null : "attendance");      
    }      
  };      

  // Fetch user data on component mount      
  useEffect(() => {      
    fetchUserData();      
  }, []);      

  // Fetch faculty's timetable once data is available      
  useEffect(() => {      
    if (userData?.role === "faculty") {      
      fetchClassOptions();      
    }      
  }, [userData]);      

  return (      
    <div className="saas-mobile-nav-container">      
      <div className="saas-mobile-header">      
        <div className="saas-mobile-brand">
          <img src="./images/logo.png" alt="TKRCET Logo" className="saas-mobile-logo-img" />
          <span className="saas-mobile-logo-text">TKRCET</span>      
        </div>
        
        {/* Animated Hamburger Menu */}
        <button      
          className={`saas-hamburger ${menuOpen ? "open" : ""}`}      
          onClick={toggleMenu}      
          aria-label={menuOpen ? "Close menu" : "Open menu"}      
        >      
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>      
      </div>      

      {menuOpen && (      
        <div className="saas-mobile-menu">      
          <div className="saas-mobile-welcome">
            <div className="welcome-avatar">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span>Welcome, {userData?.name || "User"}</span>
          </div>      

          <Link to="/index" onClick={() => setMenuOpen(false)}>      
            <MenuItem label="Home" />      
          </Link>      

          <Link to={studentId ? "/Schedule" : "/timetable"} onClick={() => setMenuOpen(false)}>      
            <MenuItem label="Timetable" />      
          </Link>      

          <MenuItem label="Notifications" />      

          {/* Attendance Menu */}      
          <MenuItem      
            label="Attendance"      
            onClick={handleAttendanceClick}      
            active={activeMenu === "attendance"}      
          />      

          {activeMenu === "attendance" && (      
            <Dropdown isOpen>      
              {userData?.role === "faculty" ? (      
                <>      
                  <MenuItem      
                    label="Class"      
                    onClick={() => setShowDynamicClasses(!showDynamicClasses)}      
                    active={showDynamicClasses}      
                  />      
                  {showDynamicClasses && (      
                    <Dropdown isOpen>      
                      {loading ? (      
                        <MenuItem label="Loading..." />      
                      ) : classOptions.length === 0 ? (      
                        <MenuItem label="No Classes Today" />      
                      ) : (      
                        classOptions.map((option, index) => (      
                          <MenuItem      
                            key={index}      
                            label={`${option.programYear} ${option.department}-${option.section} - ${option.subject}`}      
                            onClick={() => handleClassSelect(option)}      
                          />      
                        ))      
                      )}      
                    </Dropdown>      
                  )}      
                  <Link to="/register" onClick={() => setMenuOpen(false)}>      
                    <MenuItem label="Register" />      
                  </Link>      
                  <Link to="/activity" onClick={() => setMenuOpen(false)}>      
                    <MenuItem label="Activity Diary" />      
                  </Link>      
                </>      
              ) : (      
                <MenuItem label="Go to Attendance" onClick={() => { navigate("/student"); setMenuOpen(false); }} />      
              )}      
            </Dropdown>      
          )}      

          {/* Account Menu */}      
          <MenuItem      
            label="Account"      
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}      
            active={accountMenuOpen}      
          />      
          {accountMenuOpen && (      
            <Dropdown isOpen>      
              <MenuItem label="Settings" />      
              <MenuItem label="Logout" onClick={handleLogout} />      
            </Dropdown>      
          )}      
        </div>      
      )}      
    </div>      
  );      
};      

export default MobileNav;
