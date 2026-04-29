

import React, { useState, useEffect } from "react";      
import "./MobileNav.css";      
import { Link, useNavigate } from "react-router-dom";      
import axios from "axios";      

const MenuItem = ({ label, onClick, active }) => (      
  <div      
    className={`menu-item ${active ? "active" : ""}`}      
    onClick={onClick}      
    role="button"      
    tabIndex="0"      
    aria-pressed={active}      
  >      
    {label}      
  </div>      
);      

const Dropdown = ({ children, isOpen }) => (      
  <div className={`dropdown ${isOpen ? "open" : ""}`}>{children}</div>      
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
  };      

  // Handle Attendance Click      
  const handleAttendanceClick = () => {      
    if (userData?.role === "student") {      
      navigate("/student");      
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
    <div className="mobile-nav-container">      
      <div className="header">      
        <span className="logo">TKRCET</span>      
        <button      
          className="menu-toggle"      
          onClick={toggleMenu}      
          aria-label={menuOpen ? "Close menu" : "Open menu"}      
        >      
          {menuOpen ? "X" : "☰"}      
        </button>      
      </div>      

      {menuOpen && (      
        <div className="menu">      
          <span className="user-welcome">Welcome, {userData?.name || "User"}</span>      

          <Link id="h" to="/index">      
            <MenuItem label="Home" />      
          </Link>      

          <Link id="h" to={studentId ? "/Schedule" : "/timetable"}>      
            <MenuItem  label="Timetable" />      
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
                  <Link id="h" to="/register">      
                    <MenuItem label="Register" />      
                  </Link>      
                  <Link id="h" to="/activity">      
                    <MenuItem label="Activity Diary" />      
                  </Link>      
                </>      
              ) : (      
                <MenuItem label="Go to Attendance" onClick={() => navigate("/student")} />      
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