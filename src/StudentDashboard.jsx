import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";
import axios from "axios";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [error, setError] = useState("");
  
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!studentId || !token) {
      setError("Authentication missing. Please log in again.");
      setLoadingStudent(false);
      setLoadingAttendance(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 1. Fetch Student Details
    axios.get(`https://tkrc-backend-lreo.onrender.com/api/students/${studentId}/dashboard`, { headers })
      .then((res) => {
        if (res.data && res.data.student) {
          setStudent(res.data.student);
        } else {
          setError("Failed to fetch student data.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching student details.");
      })
      .finally(() => setLoadingStudent(false));

    // 2. Fetch Attendance Details and process into summaries
    axios.get(`https://tkrc-backend-lreo.onrender.com/api/attendance/student/${studentId}`, { headers })
      .then((res) => {
        const data = res.data;
        if (!data || !data.history) {
          setError("Failed to fetch attendance history.");
          return;
        }

        const history = data.history;

        // Process Subject Summary
        const subjectMap = {};
        history.forEach((record) => {
          if (!subjectMap[record.subject]) {
            subjectMap[record.subject] = { conducted: 0, attended: 0 };
          }
          subjectMap[record.subject].conducted += 1;
          if (record.status.toLowerCase() === "present") {
            subjectMap[record.subject].attended += 1;
          }
        });

        const subjectSummary = Object.keys(subjectMap).map((subj) => {
          const conducted = subjectMap[subj].conducted;
          const attended = subjectMap[subj].attended;
          return {
            subject: subj,
            classesConducted: conducted,
            classesAttended: attended,
            percentage: conducted > 0 ? ((attended / conducted) * 100).toFixed(1) : 0,
          };
        });

        // Process Daily Summary
        const dailyMap = {};
        history.forEach((record) => {
          const d = record.date;
          if (!dailyMap[d]) {
            dailyMap[d] = { periods: {}, total: 0, attended: 0 };
          }
          dailyMap[d].periods[record.period] = { subject: record.subject, status: record.status };
          dailyMap[d].total += 1;
          if (record.status.toLowerCase() === "present") {
            dailyMap[d].attended += 1;
          }
        });

        setAttendance({
          overall: data,
          subjectSummary: subjectSummary,
          dailySummary: dailyMap
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching attendance data.");
      })
      .finally(() => setLoadingAttendance(false));
  }, [studentId, token]);

  const isLoading = loadingStudent || loadingAttendance;

  return (
    <div className="dashboard-root">
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="dashboard-container">
        {error ? (
          <div className="error-card">
            <h2>System Alert</h2>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* ==========================================
                1. STUDENT PROFILE SECTION
               ========================================== */}
            <div className="dashboard-card profile-card">
              <h3>Student Profile</h3>
              {isLoading ? (
                <div className="profile-skeleton">
                  <div className="skeleton-info">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-line long"></div>
                    <div className="skeleton-line medium"></div>
                  </div>
                  <div className="skeleton-avatar"></div>
                </div>
              ) : (
                student && (
                  <div className="profile-data-layout">
                    <div className="profile-details-table-wrapper">
                      <table className="clean-details-table">
                        <tbody>
                          <tr>
                            <th>Roll Number</th>
                            <td>{student.rollNumber}</td>
                          </tr>
                          <tr>
                            <th>Full Name</th>
                            <td>{student.name}</td>
                          </tr>
                          <tr>
                            <th>Father's Name</th>
                            <td>{student.fatherName}</td>
                          </tr>
                          <tr>
                            <th>Class & Section</th>
                            <td>{`${student.year} - ${student.department} (Sec ${student.section})`}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="profile-avatar-wrapper">
                      <img
                        src={student.image || "/images/logo.png"}
                        alt="Student Profile"
                        className="student-profile-img"
                        onError={(e) => (e.target.src = "/images/logo.png")}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            {/* ==========================================
                2. ATTENDANCE METRICS SUMMARY
               ========================================== */}
            <div className="dashboard-card Summary-card">
              <h3>Subject Analysis</h3>
              {isLoading ? (
                <div className="table-skeleton">
                  <div className="skeleton-header-row"></div>
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                </div>
              ) : (
                attendance && attendance.subjectSummary && (
                  <div className="table-responsive-wrapper">
                    <table className="dashboard-data-table">
                      <thead>
                        <tr>
                          <th>Subject Name</th>
                          <th>Conducted</th>
                          <th>Attended</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.subjectSummary.map((subject, index) => (
                          <tr key={index}>
                            <td className="text-left font-semibold">{subject.subject}</td>
                            <td>{subject.classesConducted}</td>
                            <td>{subject.classesAttended}</td>
                            <td>
                              <span className={`status-pill ${parseFloat(subject.percentage) >= 75 ? "good" : "warning"}`}>
                                {subject.percentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="total-aggregation-row">
                          <td className="text-left">Grand Total</td>
                          <td>{attendance.overall.totalClasses}</td>
                          <td>{attendance.overall.presentCount}</td>
                          <td className="aggregate-percentage">
                            {attendance.overall.percentage}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>

            {/* ==========================================
                3. DAILY TRACKING BREAKDOWN
               ========================================== */}
            <div className="dashboard-card history-card">
              <h3>Daily Matrix Logs</h3>
              {isLoading ? (
                <div className="table-skeleton">
                  <div className="skeleton-header-row"></div>
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                </div>
              ) : (
                attendance && attendance.dailySummary && Object.keys(attendance.dailySummary).length > 0 ? (
                  <div className="table-responsive-wrapper">
                    <table className="dashboard-data-table grid-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>P1</th>
                          <th>P2</th>
                          <th>P3</th>
                          <th>P4</th>
                          <th>P5</th>
                          <th>P6</th>
                          <th>Total</th>
                          <th>Present</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(attendance.dailySummary).map(([date, data], index) => (
                          <tr key={index}>
                            <td className="date-cell font-semibold">{date}</td>
                            {[1, 2, 3, 4, 5, 6].map((period) => {
                              const periodData = data.periods[period];
                              const statusClass = periodData?.status.toLowerCase() === "present" 
                                ? "present-indicator" 
                                : periodData?.status.toLowerCase() === "absent" 
                                ? "absent-indicator" 
                                : "empty-indicator";
                              
                              return (
                                <td key={period} className={`${statusClass} period-cell-data`}>
                                  {periodData ? (
                                    <>
                                      <span className="block-subject">{periodData.subject}</span>
                                      <span className="block-status-tag">{periodData.status}</span>
                                    </>
                                  ) : "-"}
                                </td>
                              );
                            })}
                            <td className="font-semibold bg-gray-light">{data.total}</td>
                            <td className="font-semibold text-present bg-gray-light">{data.attended}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-records-placeholder">
                    <p>No day-by-day sequence attendance parameters logged yet.</p>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Modern High-Fidelity CSS Variables & Rules Layout */}
      <style>      
        {`      
          .dashboard-root {
            background-color: #f4f6f9;
            min-height: 100vh;
            color: #1f2937;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }

          .dashboard-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 2rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .dashboard-card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            padding: 1.75rem;
            border: 1px solid #e5e7eb;
          }

          .dashboard-card h3 {
            margin-top: 0;
            margin-bottom: 1.25rem;
            font-size: 1.15rem;
            color: #374151;
            font-weight: 700;
            border-left: 4px solid #6495ED;
            padding-left: 10px;
          }

          /* Profile View Layouts */
          .profile-data-layout {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
          }

          .profile-details-table-wrapper {
            flex: 1;
          }

          .clean-details-table {
            width: 100%;
            border-collapse: collapse;
          }

          .clean-details-table th, .clean-details-table td {
            padding: 0.75rem 0;
            text-align: left;
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.95rem;
          }

          .clean-details-table th {
            color: #6b7280;
            font-weight: 500;
            width: 30%;
          }

          .clean-details-table td {
            color: #111827;
            font-weight: 600;
          }

          .student-profile-img {
            width: 110px;
            height: 110px;
            object-fit: cover;
            border-radius: 50%;
            border: 4px solid #f3f4f6;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          }

          /* Global Structural Grid Tables styling overrides */
          .table-responsive-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }

          .dashboard-data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            background: #ffffff;
          }

          .dashboard-data-table th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 600;
            padding: 0.85rem 1rem;
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
          }

          .dashboard-data-table td {
            padding: 0.85rem 1rem;
            text-align: center;
            border-bottom: 1px solid #edf2f7;
            color: #334155;
          }

          .text-left { text-align: left !important; }
          .font-semibold { font-weight: 600; }
          .bg-gray-light { background-color: #f8fafc; }

          .status-pill {
            display: inline-block;
            padding: 0.25rem 0.6rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
          }
          .status-pill.good { background-color: #ecfdf5; color: #10b981; }
          .status-pill.warning { background-color: #fef2f2; color: #ef4444; }

          .total-aggregation-row {
            background-color: #f8fafc;
            font-weight: 700;
          }
          .total-aggregation-row td {
            color: #0f172a;
            border-top: 2px solid #e2e8f0;
          }
          .aggregate-percentage {
            color: #ef4444 !important;
          }

          /* Period Grid Formatting */
          .period-cell-data {
            padding: 0.5rem !important;
            min-width: 95px;
          }
          .block-subject {
            display: block;
            font-weight: 600;
            font-size: 0.8rem;
            color: #1e293b;
          }
          .block-status-tag {
            display: block;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 2px;
          }

          .present-indicator .block-status-tag { color: #10b981; }
          .absent-indicator .block-status-tag { color: #ef4444; }
          .empty-indicator { color: #94a3b8; }

          .text-present { color: #10b981 !important; }
          .no-records-placeholder {
            text-align: center;
            padding: 2rem;
            color: #64748b;
          }

          /* ==========================================
              SKELETON SHIMMER ANIMATION EFFECT CONFIGS
             ========================================== */
          .skeleton-pulse {
            background: linear-gradient(-90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
            background-size: 400% 400%;
            animation: shimmerPulse 1.6s ease infinite;
          }

          @keyframes shimmerPulse {
            0% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .profile-skeleton {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .skeleton-info { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
          
          .skeleton-line {
            height: 16px;
            border-radius: 4px;
            background: linear-gradient(-90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
            background-size: 400% 400%;
            animation: shimmerPulse 1.6s ease infinite;
          }
          .skeleton-line.short { width: 25%; }
          .skeleton-line.medium { width: 55%; }
          .skeleton-line.long { width: 85%; }

          .skeleton-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(-90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
            background-size: 400% 400%;
            animation: shimmerPulse 1.6s ease infinite;
          }

          .table-skeleton {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
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

          .error-card {
            background-color: #fef2f2;
            border: 1px solid #fee2e2;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
          }
          .error-card h2 { color: #dc2626; margin-top: 0; }
          .error-card p { color: #991b1b; font-weight: 500; margin-bottom: 0; }

          /* Responsive Breakpoint Normalizations */
          @media (max-width: 768px) {
            .dashboard-container { padding: 1rem 0.5rem; gap: 1.25rem; }
            .dashboard-card { padding: 1.25rem; }
            .profile-data-layout { flex-direction: column-reverse; text-align: center; gap: 1rem; }
            .clean-details-table th { width: 40%; }
            .clean-details-table th, .clean-details-table td { font-size: 0.85rem; }
            .student-profile-img { width: 90px; height: 90px; }
            .dashboard-data-table th, .dashboard-data-table td { padding: 0.6rem 0.5rem; font-size: 0.8rem; }
            .period-cell-data { min-width: 80px; }
            .block-subject { font-size: 0.7rem; }
          }
        `}      
      </style>   
    </div>
  );
};

export default StudentDashboard;
