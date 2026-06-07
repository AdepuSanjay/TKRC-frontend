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
      setAttendanceMenuVisible(!attendanceMenuVisible);
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
    <nav ref={navRef}>
      <div className="nav-left-section">
        <ul className="nav-menu-links">
          <Link to="/index">
            <li>Home</li>
          </Link>

          {/* FIXED: Everyone goes to /timetable now! */}
          <li id="time" style={{ cursor: "pointer" }} onClick={() => navigate("/timetable")}>
            Timetable
          </li>

          <li>
            <div className="menu-dropdown">
              <a onClick={handleAttendanceClick} id="attendance" style={{ cursor: "pointer" }}>
                Attendance
              </a>
              {attendanceMenuVisible && userData?.role === "faculty" && (
                <div className="menu-drop-container">
                  <div className="menu-dropdown-content">
                    <ul>
                      {showDynamicClasses ? (
                        loading ? (
                          <li>Loading classes...</li>
                        ) : classOptions.length === 0 ? (
                          <li>No classes listed</li>
                        ) : (
                          classOptions.map((option, index) => (
                            <li
                              key={index}
                              onClick={() => navigate(`/attendance?year=${option.yearId}&department=${option.deptName}&section=${option.sectionName}&subject=${option.subject}&period=${option.periodNumber}`)}
                            >
                              {`${option.yearId} ${option.deptName}-${option.sectionName} - ${option.subject} (P${option.periodNumber})`}
                            </li>
                          ))
                        )
                      ) : (
                        <>
                          <li id="g" onClick={() => setShowDynamicClasses(true)}>
                            Class
                          </li>
                          <Link id="g" to="/register">
                            <li>Register</li>
                          </Link>
                          <Link id="g" to="/activity">
                            <li>Activity Diary</li>
                          </Link>
                        </>
                      )}
                    </ul>
                  </div>
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
        <span>Welcome, {userData?.name || localStorage.getItem("userName") || "User"}</span>
        <div className="account-menu">
          <button
            className="account-menu-button"
            onClick={() => setAccountMenuVisible(!accountMenuVisible)}
          >
            Account
          </button>
          {accountMenuVisible && (
            <div className="account-menu-content">
              <ul>
                <li>Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
