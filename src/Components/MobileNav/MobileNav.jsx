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
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole")?.toLowerCase();
  const navigate = useNavigate();      

  // Fetch user data based on role from local server configuration
  const fetchUserData = async () => {      
    try {      
      const headers = { Authorization: `Bearer ${token}` };

      if (role === 'teacher' || role === 'admin') {      
        const response = await axios.get("http://localhost:8080/api/faculty", { headers });      
        const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
        if (me) setUserData({ ...me, role: "faculty" });      
      } else if (role === 'student') {      
        const response = await axios.get(`http://localhost:8080/api/students/${studentId}/dashboard`, { headers });      
        if (response.data && response.data.student) {
          setUserData({ ...response.data.student, role: "student" });      
        }
      }      
    } catch (error) {      
      console.error("Error fetching user data on mobile layout:", error);      
    }      
  };      

  // Fetch faculty timetable slots dynamically      
  const fetchClassOptions = async () => {      
    if (!userData || userData.role !== "faculty") return;      

    setLoading(true);      
    try {      
      const response = await axios.get("http://localhost:8080/api/faculty", {
        headers: { Authorization: `Bearer ${token}` }
      });      
      const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
      const classes = me?.personalTimetable || [];      

      setClassOptions(classes);      
    } catch (error) {      
      console.error("Error fetching class options for mobile layout:", error);      
      setClassOptions([]);      
    } finally {      
      setLoading(false);      
    }      
  };      

  // Secure clearance logout function      
  const handleLogout = () => {      
    localStorage.clear(); // Wipe everything clean to avoid crossing IDs
    navigate("/"); 
  };      

  const toggleMenu = () => {      
    setMenuOpen(!menuOpen);      
    setActiveMenu(null);      
    setShowDynamicClasses(false);      
    setAccountMenuOpen(false);      
  };      

  const handleClassSelect = (option) => {      
    navigate(      
      `/attendance?year=${option.yearId}&department=${option.deptName}&section=${option.sectionName}&subject=${option.subject}&period=${option.periodNumber}`      
    );      
  };      

  const handleAttendanceClick = () => {      
    if (userData?.role === "student") {      
      navigate("/student");      
    } else {      
      setActiveMenu(activeMenu === "attendance" ? null : "attendance");      
    }      
  };      

  useEffect(() => {      
    fetchUserData();      
  }, [role, studentId, facultyId]);      

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
          <span className="user-welcome">Welcome, {userData?.name || localStorage.getItem("userName") || "User"}</span>      

          <Link id="h" to="/index">      
            <MenuItem label="Home" />      
          </Link>      

          <li 
            className="menu-item"
            style={{ listStyle: "none", cursor: "pointer" }} 
            onClick={() => {
              toggleMenu();
              navigate(studentId ? "/Schedule" : "/timetable");
            }}
          >
            Timetable
          </li>      

          <MenuItem label="Notifications" />      

          {/* Attendance Menu Section */}      
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
                            label={`${option.yearId} ${option.deptName}-${option.sectionName} - ${option.subject} (P${option.periodNumber})`}      
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

          {/* Account Menu Section */}      
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
