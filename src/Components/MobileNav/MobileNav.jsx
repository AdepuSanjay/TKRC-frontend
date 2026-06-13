import React, { useState, useEffect } from "react";
import "./MobileNav.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Premium MenuItem component with optional Chevron for dropdowns
const MenuItem = ({ label, onClick, active, hasDropdown, isOpen }) => (
  <div
    className={`menu-item ${active ? "active" : ""}`}
    onClick={onClick}
    role="button"
    tabIndex="0"
    aria-pressed={active}
  >
    <span>{label}</span>
    {hasDropdown && (
      <svg
        className={`chevron ${isOpen ? "open" : ""}`}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    )}
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

  const fetchUserData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (role === "teacher" || role === "admin") {
        const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
        const me = response.data.find((f) => String(f.employeeId).trim() === String(facultyId).trim());
        if (me) setUserData({ ...me, role: "faculty" });
      } else if (role === "student") {
        const response = await axios.get(`https://tkrc-backend-lreo.onrender.com/api/students/${studentId}/dashboard`, { headers });
        if (response.data && response.data.student) {
          setUserData({ ...response.data.student, role: "student" });
        }
      }
    } catch (error) {
      console.error("Error fetching user data on mobile layout:", error);
    }
  };

  const fetchClassOptions = async () => {
    if (!userData || userData.role !== "faculty") return;

    setLoading(true);
    try {
      const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = response.data.find((f) => String(f.employeeId).trim() === String(facultyId).trim());
      const classes = me?.personalTimetable || [];

      setClassOptions(classes);
    } catch (error) {
      console.error("Error fetching class options for mobile layout:", error);
      setClassOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
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
      {/* Dimmed backdrop when menu is open */}
      <div className={`nav-backdrop ${menuOpen ? "visible" : ""}`} onClick={toggleMenu}></div>

      <div className="header">
        <span className="logo">TKRCET</span>
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="menu">
          <span className="user-welcome">
            WELCOME, {userData?.name || localStorage.getItem("userName") || "USER"}
          </span>

          <Link id="h" to="/index" onClick={toggleMenu}>
            <MenuItem label="Home" />
          </Link>

          <li
            className="menu-item link-override"
            onClick={() => {
              toggleMenu();
              navigate("/timetable");
            }}
          >
            <span>Timetable</span>
          </li>

          <MenuItem label="Notifications" />

          <MenuItem
            label="Attendance"
            onClick={handleAttendanceClick}
            active={activeMenu === "attendance"}
            hasDropdown={userData?.role === "faculty"}
            isOpen={activeMenu === "attendance"}
          />

          {activeMenu === "attendance" && (
            <Dropdown isOpen>
              {userData?.role === "faculty" ? (
                <>
                  <MenuItem
                    label="Class"
                    onClick={() => setShowDynamicClasses(!showDynamicClasses)}
                    active={showDynamicClasses}
                    hasDropdown={true}
                    isOpen={showDynamicClasses}
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
                            onClick={() => {
                              toggleMenu();
                              handleClassSelect(option);
                            }}
                          />
                        ))
                      )}
                    </Dropdown>
                  )}
                  <Link id="h" to="/register" onClick={toggleMenu}>
                    <MenuItem label="Register" />
                  </Link>
                  <Link id="h" to="/activity" onClick={toggleMenu}>
                    <MenuItem label="Activity Diary" />
                  </Link>
                </>
              ) : (
                <MenuItem label="Go to Attendance" onClick={() => { toggleMenu(); navigate("/student"); }} />
              )}
            </Dropdown>
          )}

          <MenuItem
            label="Account"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            active={accountMenuOpen}
            hasDropdown={true}
            isOpen={accountMenuOpen}
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
