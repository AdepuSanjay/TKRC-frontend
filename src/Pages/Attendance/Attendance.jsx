import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Attendance.css";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract class details from the URL parameters (passed from NavBar)
  const queryParams = new URLSearchParams(location.search);
  const programYear = queryParams.get("year") || queryParams.get("programYear"); 
  const department = queryParams.get("department");
  const section = queryParams.get("section");
  const subject = queryParams.get("subject");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Only fetch if we have the class details
    if (programYear && department && section) {
      fetchAttendanceRecords();
    } else {
      setError("Class details missing. Please select a class from the menu.");
    }
  }, [date, programYear, department, section]);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all attendance from the new secure backend
      const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/attendance", { headers });

      if (response.data && Array.isArray(response.data)) {
        
        // Filter records strictly for the selected Date AND specific Class
        const matchingRecords = response.data.filter(
          (record) => 
            record.date === date && 
            record.year === programYear && 
            record.department === department && 
            record.section === section
        );

        if (matchingRecords.length === 0) {
          throw new Error(`No attendance records found for this class on ${date}.`);
        }

        // Process absentees cleanly from your nested MongoDB document array
        const processedData = matchingRecords.map((record) => ({
          ...record,
          classDetails: `${record.year} ${record.department}-${record.section}`,
          absentees: record.attendance
            ? record.attendance
                .filter((student) => student.status.toLowerCase() === "absent")
                .map((student) => student.rollNumber)
            : [],
        }));

        setAttendanceData(processedData);
      } else {
        throw new Error("Invalid data format received from server.");
      }
    } catch (err) {
      setAttendanceData([]);
      setError(err.message || "Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoClick = () => {
    const selectedDate = new Date(date).toISOString().split("T")[0];
    if (selectedDate !== todayDate) {
      toast.error("You can only mark new attendance for today's date.", { theme: "colored" });
      setDate(todayDate);
    } else {
      // Redirect to the marking sheet component with clean URL params
      navigate(
        `/mark?year=${programYear}&department=${department}&section=${section}&subject=${subject}&date=${date}`
      );
    }
  };

  const handleEdit = (record) => {
    // Basic validation: Allow editing only if the record is from today
    const canEdit = record.date === todayDate;

    if (canEdit) {
      navigate(
        `/mark?year=${record.year}&department=${record.department}&section=${record.section}&subject=${record.subject}&date=${record.date}&editPeriod=${record.period}`
      );
    } else {
      toast.warning("Editing past records is restricted.", { theme: "colored" });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="nav">
        <NavBar />
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
              max={todayDate} // Prevent selecting future dates
              onChange={(e) => setDate(e.target.value)} 
            />
            <button onClick={handleGoClick} className="go-button">Mark New Attendance</button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Loading attendance records...</p>
        ) : error ? (
          <p className="error-message" style={{ textAlign: "center", color: "red", padding: "2rem" }}>
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
                    <th>Remarks</th>
                    <th>Absentees</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => {
                    const canEdit = record.date === todayDate;

                    return (
                      <tr key={index}>
                        <td>{record.classDetails}</td>
                        <td>{record.subject}</td>
                        <td>{record.date}</td>
                        <td>{record.period}</td>
                        <td>{record.topic || "N/A"}</td>
                        <td>{record.remarks || "N/A"}</td>
                        <td>
                          {record.absentees.length > 0 ? record.absentees.join(", ") : "None"}
                        </td>
                        <td>
                          <button 
                            onClick={() => handleEdit(record)} 
                            disabled={!canEdit} 
                            className={`edit-button ${!canEdit ? "disabled-btn" : ""}`}
                            title={!canEdit ? "Editing past records is locked." : "Edit today's attendance"}
                            style={{ opacity: canEdit ? 1 : 0.5, cursor: canEdit ? "pointer" : "not-allowed" }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
