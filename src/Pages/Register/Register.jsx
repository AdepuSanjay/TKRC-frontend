import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css"; // Ensure this matches the new CSS file name
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Register = () => {
  const [combinations, setCombinations] = useState([]);
  const [selectedCombination, setSelectedCombination] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [percentageData, setPercentageData] = useState([]);
  const [facultyId, setFacultyId] = useState(null);

  const mongoDbFacultyId = localStorage.getItem("facultyId");

  // Fetch faculty ID based on MongoDB facultyId from localStorage
  useEffect(() => {
    if (!mongoDbFacultyId) return;

    const fetchFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${mongoDbFacultyId}`
        );
        setFacultyId(response.data.facultyId);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyId();
  }, [mongoDbFacultyId]);

  // Fetch unique combinations for the dropdown based on facultyId
  useEffect(() => {
    if (!facultyId) return;

    const fetchCombinations = async () => {
      try {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${facultyId}/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };

    fetchCombinations();
  }, [facultyId]);

  // Fetch attendance records and percentage data based on the selected combination
  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      try {
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/Attendance/fetch-records?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`
        );

        setAttendanceRecords(response.data.data || []);
        setPercentageData(response.data.percentageData || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination]);

  return (
    <>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="saas-register-container">
        {/* Dropdown Section */}
        <div className="saas-dropdown-section">
          <select
            id="section-selector"
            onChange={(e) => setSelectedCombination(e.target.value)}
            className="saas-select-menu"
          >
            <option value="">Select Class Section</option>
            {combinations.map((combo, index) => (
              <option
                key={index}
                value={`${combo.year}-${combo.department}-${combo.section}-${combo.subject}`}
              >
                {combo.year} {combo.department}-{combo.section} ({combo.subject})
              </option>
            ))}
          </select>
        </div>

        {/* Table Section */}
        <div className="saas-attendance-card">
          {/* Header Title Section */}
          <div className="saas-table-header">
            <h3 className="saas-table-title">
              Attendance Register 
              <span className="saas-table-subtitle">
                {selectedCombination ? ` • ${selectedCombination.replace(/-/g, ' ')}` : " • No Class Selected"}
              </span>
            </h3>
            <span className="saas-table-year">{new Date().getFullYear()}</span>
          </div>

          {/* Table Wrapper for scrolling */}
          <div className="saas-table-wrapper">
            <table className="saas-attendance-table">
              <thead>
                <tr>
                  <th className="sticky-col">Roll No.</th>
                  {attendanceRecords.map((record, index) => (
                    <th key={index} colSpan={record.periods.length} className="date-header">
                      {record.date}
                    </th>
                  ))}
                  <th className="stat-header">Total</th>
                  <th className="stat-header">Attend</th>
                  <th className="stat-header">%</th>
                </tr>
                <tr>
                  <th className="sticky-col sub-header"></th>
                  {attendanceRecords.map((record) =>
                    record.periods.map((period, idx) => (
                      <th key={idx} className="sub-header">{period}</th>
                    ))
                  )}
                  <th className="sub-header"></th>
                  <th className="sub-header"></th>
                  <th className="sub-header"></th>
                </tr>
              </thead>
              <tbody>
                {percentageData.length === 0 ? (
                  <tr>
                    <td className="saas-no-data" colSpan={attendanceRecords.length + 4}>
                      No attendance records found for this selection.
                    </td>
                  </tr>
                ) : (
                  percentageData.map((student, index) => (
                    <tr key={index}>
                      <td className="sticky-col fw-bold">{student.rollNumber}</td>
                      {attendanceRecords.map((record) =>
                        record.students[student.rollNumber]
                          ? record.students[student.rollNumber].map((status, idx) => (
                              <td key={idx}>
                                <span className={`saas-status-pill ${status === "A" ? "absent" : "present"}`}>
                                  {status}
                                </span>
                              </td>
                            ))
                          : record.periods.map((_, idx) => <td key={idx} className="empty-cell">-</td>)
                      )}
                      <td className="fw-bold">{student.total}</td>
                      <td className="fw-bold">{student.attended}</td>
                      <td>
                        <span className={`saas-percentage-pill ${student.percentage < 75 ? "low" : "high"}`}>
                          {student.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
