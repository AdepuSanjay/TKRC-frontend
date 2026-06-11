import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActivityDiary = () => {
  const [combinations, setCombinations] = useState([]); 
  const [attendanceRecords, setAttendanceRecords] = useState([]); 
  const [selectedCombination, setSelectedCombination] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [facultyName, setFacultyName] = useState(""); // Store the logged-in faculty's name

  const facultyId = localStorage.getItem("facultyId"); 
  const token = localStorage.getItem("token");

  // 1. Fetch Faculty Timetable, set Faculty Name, and Extract Unique Subjects
  useEffect(() => {
    const fetchUniqueCombinations = async () => {
      if (!facultyId || !token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
        const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());

        if (me) {
          setFacultyName(me.name); // Store the official DB name

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
        console.error("Error fetching faculty timetable:", error);
      }
    };

    fetchUniqueCombinations();
  }, [facultyId, token]);

  // 2. Fetch Activity Diary Records tied exclusively to this faculty member
  useEffect(() => {
    if (!selectedCombination || !facultyName) {
      setAttendanceRecords([]);
      return;
    }

    const fetchAttendanceRecords = async () => {
      setLoading(true);
      try {
        const [year, department, section, subject] = selectedCombination.split("|");
        const headers = { Authorization: `Bearer ${token}` };

        // Safely pass the facultyName to only grab THEIR logs
        const response = await axios.get(
          `https://tkrc-backend-lreo.onrender.com/api/attendance/class-history?year=${year}&department=${department}&section=${section}&subject=${subject}&facultyName=${facultyName}`,
          { headers }
        );

        const sortedData = (response.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setAttendanceRecords(sortedData);
      } catch (error) {
        toast.error("Failed to fetch activity logs.");
        setAttendanceRecords([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination, facultyName, token]);

  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value); 
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="activity-main-container">
        <div className="activity-card">
          <div className="activity-header">
            <h2>Activity Diary Log</h2>
            <p>Select a class and subject below to view your teaching history.</p>
            
            <div className="dropdown-wrapper">
              <select className="class-selector" value={selectedCombination} onChange={handleSelectionChange}>
                <option value="">-- Select Class & Subject --</option>
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
          </div>

          <div className="activity-content">
            {loading ? (
              // Consistent Skeleton Animation matches Student Dashboard
              <div className="table-skeleton">
                <div className="skeleton-header-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="diary-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Date</th>
                      <th>Period</th>
                      <th>Topic Covered</th>
                      <th>Remarks</th>
                      <th>Absentees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!selectedCombination ? (
                      <tr>
                        <td colSpan="6" className="empty-message">Please select a class to view history.</td>
                      </tr>
                    ) : attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-message">No attendance records found for this subject.</td>
                      </tr>
                    ) : (
                      attendanceRecords.map((record, index) => (
                        <tr key={record.id || index}>
                          <td>{index + 1}</td>
                          <td style={{ fontWeight: "bold" }}>{record.date}</td>
                          <td>P{record.period}</td>
                          <td>{record.topic || "-"}</td>
                          <td>{record.remarks || "-"}</td>
                          <td className="absentee-list">
                            {record.attendance
                              ? record.attendance
                                  .filter((entry) => entry.status.toLowerCase() === "absent")
                                  .map((entry) => entry.rollNumber)
                                  .join(", ") || "None"
                              : "None"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .activity-main-container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 0 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .activity-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #eaeaea;
        }

        .activity-header {
          background-color: #f8fafc;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #eaeaea;
        }

        .activity-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.4rem;
        }

        .activity-header p {
          color: #64748b;
          margin: 0 0 1rem 0;
          font-size: 0.95rem;
        }

        .dropdown-wrapper {
          display: flex;
          align-items: center;
        }

        .class-selector {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background-color: #ffffff;
          color: #334155;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }

        .class-selector:focus {
          border-color: #6495ED;
          box-shadow: 0 0 0 3px rgba(100, 149, 237, 0.1);
        }

        .table-responsive {
          overflow-x: auto;
          padding: 0 1rem 1rem 1rem;
        }

        .diary-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          font-size: 0.95rem;
        }

        .diary-table th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .diary-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: top;
        }

        .diary-table tr:hover td {
          background-color: #f8fafc;
        }

        .absentee-list {
          color: #ef4444 !important;
          font-weight: 500;
          max-width: 200px;
          line-height: 1.4;
        }

        .empty-message {
          text-align: center !important;
          color: #94a3b8 !important;
          padding: 3rem !important;
          font-style: italic;
        }

        /* Consistent Skeleton Shimmer Styles */
        .table-skeleton {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1rem;
        }

        .skeleton-header-row {
          height: 35px;
          border-radius: 6px;
          background-color: #e2e8f0;
        }

        .skeleton-row {
          height: 45px;
          border-radius: 6px;
          background: linear-gradient(-90deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%);
          background-size: 400% 400%;
          animation: shimmerPulse 1.6s ease infinite;
        }

        @keyframes shimmerPulse {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 768px) {
          .activity-header {
            padding: 1rem;
          }
          .diary-table th, .diary-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
          .class-selector {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default ActivityDiary;
