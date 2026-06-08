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
      const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/attendance", { headers });

      if (response.data && Array.isArray(response.data)) {
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
      navigate(
        `/mark?year=${programYear}&department=${department}&section=${section}&subject=${subject}&date=${date}`
      );
    }
  };

  const isWithinTwoDays = (recordDateStr) => {
    const recordDate = new Date(recordDateStr);
    const today = new Date();
    recordDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = today.getTime() - recordDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    return daysDiff >= 0 && daysDiff <= 1; 
  };

  const handleEdit = (record) => {
    const canEdit = isWithinTwoDays(record.date);

    if (canEdit) {
      // FIXED: Now passing recordId securely in the URL so Marking.js knows exactly what to update
      navigate(
        `/mark?year=${record.year}&department=${record.department}&section=${record.section}&subject=${record.subject}&date=${record.date}&editPeriod=${record.period}&recordId=${record.id}`
      );
    } else {
      toast.warning("Editing past records (older than 2 days) is restricted.", { theme: "colored" });
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
              max={todayDate} 
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
                    const canEdit = isWithinTwoDays(record.date);

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
                            title={!canEdit ? "Editing past records is locked." : "Edit attendance"}
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
