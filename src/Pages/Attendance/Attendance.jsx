import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const programYear = queryParams.get("programYear") || queryParams.get("year");
  const department = queryParams.get("department");
  const section = queryParams.get("section");
  const subject = queryParams.get("subject");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facultyName, setFacultyName] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];
  const facultyId = localStorage.getItem("facultyId"); 
  const token = localStorage.getItem("token");

  // Fetch verified faculty details securely
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        if (facultyId) {
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
          
          const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
          if (me) {
            setFacultyName(me.name);
          }
        }
      } catch (error) {
        console.error("Error fetching faculty details:", error);
      }
    };

    fetchFacultyDetails();
  }, [facultyId, token]);

  // Fetch records whenever the date changes
  useEffect(() => {
    fetchAttendanceRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all global records from the new backend
      const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/attendance", { headers });

      if (response.data && Array.isArray(response.data)) {
        // Filter records strictly by the selected date
        let filteredRecords = response.data.filter(record => record.date === date);

        // If the user navigated here from a specific class click, filter down to that class
        if (programYear && department && section) {
           filteredRecords = filteredRecords.filter(record => 
             record.year === programYear && 
             record.department === department && 
             record.section === section
           );
        }

        if (filteredRecords.length === 0) {
          setAttendanceData([]);
          throw new Error(`No attendance records found for ${date}.`);
        }

        // Process data neatly for the table view
        const processedData = filteredRecords.map((record) => {
          const absenteesList = record.attendance
            ? record.attendance.filter((student) => student.status === "absent").map((student) => student.rollNumber)
            : [];

          return {
            ...record,
            classDetails: `${record.year} ${record.department}-${record.section}`,
            absentees: absenteesList,
          };
        });

        // Sort by period number so the table looks organized
        processedData.sort((a, b) => a.period - b.period);
        setAttendanceData(processedData);

      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err) {
      setError(err.message);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoClick = () => {
    const selectedDate = new Date(date).toISOString().split("T")[0];
    if (selectedDate !== todayDate) {
      toast.error("You can only mark new attendance for today's date.", { theme: "colored" });
      setDate(todayDate);
    } else if (!programYear || !department || !section) {
      toast.warning("Please select a specific class from the NavBar to mark attendance.", { theme: "colored" });
    } else {
      navigate(
        `/mark?year=${programYear}&department=${department}&section=${section}&subject=${subject}&date=${date}`
      );
    }
  };

  const handleEdit = (record) => {
    // Basic frontend safety: only allow editing if it is today
    const canEdit = record.date === todayDate;

    if (canEdit) {
      navigate(
        `/mark?year=${record.year}&department=${record.department}&section=${record.section}&subject=${record.subject}&date=${record.date}&editPeriod=${record.period}`
      );
    } else {
      toast.error("Past attendance records are locked and cannot be edited.", { theme: "colored" });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <div className="nav">
        <NavBar facultyName={facultyName || "Dashboard"} />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="attendance-container">
        <div className="attendance-header">
          <div className="date-selector-container">
            <label htmlFor="date" className="date-label">Select Date: </label>
            <input 
              type="date" 
              id="date" 
              className="date-input"
              value={date} 
              max={todayDate} // Prevents selecting future dates visually
              onChange={(e) => setDate(e.target.value)} 
            />
            <button onClick={handleGoClick} className="go-button">Go Mark</button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Loading attendance records...</p>
        ) : error ? (
          <p className="error-message" style={{ textAlign: "center", color: "#d9534f", fontWeight: "bold" }}>
            {error}
          </p>
        ) : (
          <div className="attendance-table-wrapper">
            {attendanceData.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Period</th>
                    <th>Topic</th>
                    <th>Faculty</th>
                    <th>Absentees</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => {
                    const canEdit = record.date === todayDate;

                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: "bold" }}>{record.classDetails}</td>
                        <td>{record.subject}</td>
                        <td>{record.date}</td>
                        <td>{record.period}</td>
                        <td>{record.topic || "N/A"}</td>
                        <td>{record.facultyName || "N/A"}</td>
                        <td style={{ color: record.absentees.length > 0 ? "#d9534f" : "inherit" }}>
                          {record.absentees.length > 0 ? record.absentees.join(", ") : "All Present"}
                        </td>
                        <td>
                          <button 
                            onClick={() => handleEdit(record)} 
                            disabled={!canEdit} 
                            className="edit-button"
                            style={{ 
                              opacity: canEdit ? 1 : 0.5, 
                              cursor: canEdit ? "pointer" : "not-allowed",
                              backgroundColor: canEdit ? "#0275d8" : "#6c757d",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px"
                            }}
                            title={!canEdit ? "Past records are locked." : "Edit this period"}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center" }}>No attendance records available for the selected date.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
