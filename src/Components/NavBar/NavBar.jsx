
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NavBar.css";

function NavBar() {
  const [attendanceMenuVisible, setAttendanceMenuVisible] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [showDynamicClasses, setShowDynamicClasses] = useState(false);
  const [userData, setUserData] = useState(null); 

  const navRef = useRef(null);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("studentId");
  const facultyId = localStorage.getItem("facultyId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole")?.toLowerCase();

  // Fetch user details dynamically from the live Render backend
  const fetchUserData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (role === 'teacher' || role === 'admin') {
        const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
        const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
        if (me) setUserData({ ...me, role: "faculty" });
      } else if (role === 'student') {
        const response = await axios.get(`https://tkrc-backend-lreo.onrender.com/api/students/${studentId}/dashboard`, { headers });
        if (response.data && response.data.student) {
          setUserData({ ...response.data.student, role: "student" });
        }
      }
    } catch (error) {
      console.error("Error fetching user data from live server:", error);
    }
  };

  const fetchClassOptions = async () => {
    if (!userData || userData.role !== "faculty") return;
    setLoading(true);
    try {
      const response = await axios.get(`https://tkrc-backend-lreo.onrender.com/api/faculty`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());

      const classes = me?.personalTimetable || [];
      setClassOptions(classes);
    } catch (error) {
      console.error("Error fetching class choices:", error);
      setClassOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/"); 
  };

  const handleAttendanceClick = () => {
    if (userData?.role === "student") {
      navigate("/student");
    } else {
      // Toggle menu and reset the dynamic classes view so it always opens the parent menu
      setAttendanceMenuVisible(!attendanceMenuVisible);
      setShowDynamicClasses(false); 
      setAccountMenuVisible(false); // Close account menu if open
    }
  };

  const handleAccountClick = () => {
    setAccountMenuVisible(!accountMenuVisible);
    setAttendanceMenuVisible(false); // Close attendance menu if open
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAttendanceMenuVisible(false);
        setAccountMenuVisible(false);
        setShowDynamicClasses(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [role, studentId, facultyId]);

  useEffect(() => {
    if (userData?.role === "faculty") {
      fetchClassOptions();
    }
  }, [userData]);

  return (
    <nav className="saas-navbar" ref={navRef}>
      <div className="nav-left-section">
        <div className="nav-logo">
           {/* You can add a logo SVG or Image here */}
           <span className="logo-text">TKR Campus</span>
        </div>
        <ul className="nav-menu-links">
          <li>
            <Link to="/index">Home</Link>
          </li>
          <li onClick={() => navigate("/timetable")}>
            Timetable
          </li>

          <li>
            <div className="menu-dropdown">
              <span onClick={handleAttendanceClick} className={`dropdown-trigger ${attendanceMenuVisible ? 'active' : ''}`}>
                Attendance
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              
              {attendanceMenuVisible && userData?.role === "faculty" && (
                <div className="menu-dropdown-content">
                  <ul>
                    {showDynamicClasses ? (
                      <>
                        <li className="back-button" onClick={(e) => {
                          e.stopPropagation();
                          setShowDynamicClasses(false);
                        }}>
                          ← Back to options
                        </li>
                        <div className="dropdown-divider"></div>
                        {loading ? (
                          <li className="loading-state">Loading classes...</li>
                        ) : classOptions.length === 0 ? (
                          <li className="empty-state">No classes listed</li>
                        ) : (
                          classOptions.map((option, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                navigate(`/attendance?year=${option.yearId}&department=${option.deptName}&section=${option.sectionName}&subject=${option.subject}&period=${option.periodNumber}`);
                                setAttendanceMenuVisible(false);
                                setShowDynamicClasses(false);
                              }}
                            >
                              {`${option.yearId} ${option.deptName}-${option.sectionName} - ${option.subject} (P${option.periodNumber})`}
                            </li>
                          ))
                        )}
                      </>
                    ) : (
                      <>
                        <li onClick={(e) => {
                          e.stopPropagation();
                          setShowDynamicClasses(true);
                        }}>
                          Class
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{float: 'right', marginTop: '4px'}}>
                             <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </li>
                        <li onClick={() => {
                            navigate("/register");
                            setAttendanceMenuVisible(false);
                        }}>
                          Register
                        </li>
                        <li onClick={() => {
                            navigate("/activity");
                            setAttendanceMenuVisible(false);
                        }}>
                          Activity Diary
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </li>

          <li>
            <a href="#notifications">Notifications</a>
          </li>
        </ul>
      </div>

      <div className="nav-user-profile">
        <span className="welcome-text">Welcome, <strong>{userData?.name || localStorage.getItem("userName") || "User"}</strong></span>
        <div className="account-menu">
          <button
            className="account-menu-button"
            onClick={handleAccountClick}
          >
            Account
          </button>
          {accountMenuVisible && (
            <div className="account-dropdown-content">
              <ul>
                <li>Settings</li>
                <div className="dropdown-divider"></div>
                <li className="logout-btn" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
