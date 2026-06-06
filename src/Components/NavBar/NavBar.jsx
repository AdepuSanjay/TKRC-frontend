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

  // Fetch user details dynamically from the correct local backend server
  const fetchUserData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      if (role === 'teacher' || role === 'admin') {
        const response = await axios.get("http://localhost:8080/api/faculty", { headers });
        const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
        if (me) setUserData({ ...me, role: "faculty" });
      } else if (role === 'student') {
        // Hits the clean dashboard API we created for students
        const response = await axios.get(`http://localhost:8080/api/students/${studentId}/dashboard`, { headers });
        if (response.data && response.data.student) {
          setUserData({ ...response.data.student, role: "student" });
        }
      }
    } catch (error) {
      console.error("Error fetching user data from local server:", error);
    }
  };

  // Fetch today's classes for faculty
  const fetchClassOptions = async () => {
    if (!userData || userData.role !== "faculty") return;
    setLoading(true);
    try {
      // Adjusted to read from the structured personalTimetable map on localhost
      const response = await axios.get(`http://localhost:8080/api/faculty`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
      
      // Filter out slots that represent actual classes taught today
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
    localStorage.clear(); // Safely clear all tokens and ghost keys at once
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

          {/* Corrected Timetable routing based on real active localStorage session flags */}
          <li id="time" style={{ cursor: "pointer" }} onClick={() => navigate(studentId ? "/Schedule" : "/timetable")}>
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
