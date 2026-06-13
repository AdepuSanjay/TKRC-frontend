import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css"; 
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [combinations, setCombinations] = useState([]);
  const [selectedCombination, setSelectedCombination] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Holds column data (Dates & Periods)
  const [percentageData, setPercentageData] = useState([]);       // Holds row data (Students & Stats)
  const [facultyName, setFacultyName] = useState("");
  const [loading, setLoading] = useState(false);

  const facultyId = localStorage.getItem("facultyId");
  const token = localStorage.getItem("token");

  // 1. Fetch Faculty Timetable & Unique Combinations
  useEffect(() => {
    const fetchCombinations = async () => {
      if (!facultyId || !token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
        const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());

        if (me) {
          setFacultyName(me.name);

          if (me.personalTimetable) {
            const uniqueCombos = [];
            const seen = new Set();

            me.personalTimetable.forEach((slot) => {
              if (slot.subject) {
                const identifier = `${slot.yearId}-${slot.deptName}-${slot.sectionName}-${slot.subject}`;
                if (!seen.has(identifier)) {
                  seen.add(identifier);
                  uniqueCombos.push({
                    year: slot.yearId,
                    department: slot.deptName,
                    section: slot.sectionName,
                    subject: slot.subject
                  });
                }
              }
            });
            setCombinations(uniqueCombos);
          }
        }
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };

    fetchCombinations();
  }, [facultyId, token]);

  // 2. Fetch Students & History, then transform into the Grid Matrix
  useEffect(() => {
    if (!selectedCombination || !facultyName) return;

    const fetchRegisterData = async () => {
      setLoading(true);
      try {
        const [year, department, section, subject] = selectedCombination.split("|");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch 1: Get the list of all students in this section
        const studentsRes = await axios.get(
          `https://tkrc-backend-lreo.onrender.com/api/attendance/students-list?year=${year}&department=${department}&section=${section}`,
          { headers }
        );
        const studentsList = studentsRes.data || [];

        // Fetch 2: Get all attendance sheets for this specific class & subject
        const historyRes = await axios.get(
          `https://tkrc-backend-lreo.onrender.com/api/attendance/class-history?year=${year}&department=${department}&section=${section}&subject=${subject}&facultyName=${facultyName}`,
          { headers }
        );
        const sheets = historyRes.data || [];

        // --- MATRIX TRANSFORMATION LOGIC ---

        // A. Group sheets by Date to build the table Headers (Columns)
        const dateMap = {};
        sheets.forEach((sheet) => {
          if (!dateMap[sheet.date]) dateMap[sheet.date] = [];
          dateMap[sheet.date].push(sheet);
        });

        // Sort dates chronologically
        const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));

        const formattedRecords = sortedDates.map((date) => {
          // Sort periods within the same date
          const daySheets = dateMap[date].sort((a, b) => a.period - b.period);
          const periods = daySheets.map((s) => s.period);

          const studentStatuses = {};
          studentsList.forEach((stu) => {
            studentStatuses[stu.rollNumber] = daySheets.map((s) => {
              const record = s.attendance?.find((a) => a.rollNumber === stu.rollNumber);
              return record && record.status.toLowerCase() === "present" ? "P" : "A";
            });
          });

          return { date, periods, students: studentStatuses };
        });

        // B. Calculate overall aggregates for each student (Rows)
        const totalClassesHeld = sheets.length;
        const formattedPercentageData = studentsList.map((stu) => {
          let attendedCount = 0;
          sheets.forEach((s) => {
            const record = s.attendance?.find((a) => a.rollNumber === stu.rollNumber);
            if (record && record.status.toLowerCase() === "present") attendedCount++;
          });

          const percentage = totalClassesHeld > 0 ? ((attendedCount / totalClassesHeld) * 100).toFixed(1) : 0;

          return {
            rollNumber: stu.rollNumber,
            name: stu.name,
            total: totalClassesHeld,
            attended: attendedCount,
            percentage: percentage
          };
        });

        setAttendanceRecords(formattedRecords);
        setPercentageData(formattedPercentageData);

      } catch (error) {
        console.error("Error generating register matrix:", error);
        toast.error("Failed to fetch register records.");
        setAttendanceRecords([]);
        setPercentageData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisterData();
  }, [selectedCombination, facultyName, token]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="saas-register-container">
        {/* Dropdown Section */}
        <div className="saas-dropdown-section" style={{ padding: "20px", textAlign: "center" }}>
          <select
            id="section-selector"
            value={selectedCombination}
            onChange={(e) => setSelectedCombination(e.target.value)}
            className="saas-select-menu"
            style={{ padding: "10px", fontSize: "16px", borderRadius: "5px", width: "100%", maxWidth: "400px" }}
          >
            <option value="">Select Class Section</option>
            {combinations.map((combo, index) => {
              const valueString = `${combo.year}|${combo.department}|${combo.section}|${combo.subject}`;
              return (
                <option key={index} value={valueString}>
                  {combo.year} {combo.department}-{combo.section} ({combo.subject})
                </option>
              );
            })}
          </select>
        </div>

        {/* Table Section */}
        <div className="saas-attendance-card" style={{ padding: "0 20px" }}>
          <div className="saas-table-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <h3 className="saas-table-title" style={{ margin: 0 }}>
              Attendance Register 
              <span className="saas-table-subtitle" style={{ color: "gray", fontSize: "14px" }}>
                {selectedCombination ? ` • ${selectedCombination.replace(/\|/g, ' ')}` : " • No Class Selected"}
              </span>
            </h3>
            <span className="saas-table-year" style={{ fontWeight: "bold" }}>{new Date().getFullYear()}</span>
          </div>

          <div className="saas-table-wrapper" style={{ overflowX: "auto" }}>
            {loading ? (
              <p style={{ textAlign: "center", padding: "20px" }}>Generating Matrix...</p>
            ) : (
              <table className="saas-attendance-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className="sticky-col" style={{ border: "1px solid #ddd", padding: "10px" }}>Roll No.</th>
                    {attendanceRecords.map((record, index) => (
                      <th key={index} colSpan={record.periods.length} className="date-header" style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", backgroundColor: "#f4f6f9" }}>
                        {record.date}
                      </th>
                    ))}
                    <th className="stat-header" style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f6f9" }}>Total</th>
                    <th className="stat-header" style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f6f9" }}>Attend</th>
                    <th className="stat-header" style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f6f9" }}>%</th>
                  </tr>
                  <tr>
                    <th className="sticky-col sub-header" style={{ border: "1px solid #ddd", padding: "10px" }}></th>
                    {attendanceRecords.map((record) =>
                      record.periods.map((period, idx) => (
                        <th key={`${record.date}-${idx}`} className="sub-header" style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>P{period}</th>
                      ))
                    )}
                    <th className="sub-header" style={{ border: "1px solid #ddd" }}></th>
                    <th className="sub-header" style={{ border: "1px solid #ddd" }}></th>
                    <th className="sub-header" style={{ border: "1px solid #ddd" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {percentageData.length === 0 ? (
                    <tr>
                      <td className="saas-no-data" colSpan={attendanceRecords.reduce((acc, rec) => acc + rec.periods.length, 4)} style={{ textAlign: "center", padding: "20px" }}>
                        No attendance records found for this selection.
                      </td>
                    </tr>
                  ) : (
                    percentageData.map((student, index) => (
                      <tr key={index}>
                        <td className="sticky-col fw-bold" style={{ border: "1px solid #ddd", padding: "10px", fontWeight: "bold" }}>
                          {student.rollNumber}
                        </td>
                        {attendanceRecords.map((record) =>
                          record.students[student.rollNumber]
                            ? record.students[student.rollNumber].map((status, idx) => (
                                <td key={`${record.date}-${idx}`} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                  <span style={{ color: status === "A" ? "red" : "green", fontWeight: "bold" }}>
                                    {status}
                                  </span>
                                </td>
                              ))
                            : record.periods.map((_, idx) => <td key={`empty-${idx}`} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>-</td>)
                        )}
                        <td className="fw-bold" style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", fontWeight: "bold" }}>{student.total}</td>
                        <td className="fw-bold" style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", fontWeight: "bold", color: "green" }}>{student.attended}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                          <span style={{ 
                            padding: "4px 8px", 
                            borderRadius: "4px", 
                            color: "white",
                            backgroundColor: student.percentage < 75 ? "#ef4444" : "#10b981" 
                          }}>
                            {student.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
<Header />
    </>
  );
};

export default Register;
