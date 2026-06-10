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

    // 1. Fetch Student Details from the new Dashboard API
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

    // 2. Fetch Attendance Details and process the flat array into summaries
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

  // Render Skeleton UI Loader
  const renderSkeleton = () => (
    <div className="dashboard-container skeleton-container">
      {/* Student Details Skeleton */}
      <div className="card-panel skeleton-card">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-profile-wrapper">
          <div className="skeleton-info-rows">
            <div className="skeleton-line skeleton-row"></div>
            <div className="skeleton-line skeleton-row"></div>
            <div className="skeleton-line skeleton-row"></div>
          </div>
          <div className="skeleton-avatar"></div>
        </div>
      </div>
      
      {/* Attendance Summary Skeleton */}
      <div className="card-panel skeleton-card">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-table">
          <div className="skeleton-table-header"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {loadingStudent || loadingAttendance ? (
        renderSkeleton()
      ) : error ? (
        <div className="error-container">
          <h2 className="error-text">{error}</h2>
        </div>
      ) : (
        <div className="dashboard-container">
          {/* Student Details Card */}
          {student && (
            <div className="student-details card-panel">
              <h2 className="section-title">Student Details</h2>
              <div className="student-profile-card">
                <div className="student-info-content">
                  <div className="info-item">
                    <span className="info-label">Roll No.</span>
                    <span className="info-value">{student.rollNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Student Name</span>
                    <span className="info-value">{student.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Father's Name</span>
                    <span className="info-value">{student.fatherName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Department</span>
                    <span className="info-value">{`${student.year} ${student.department} Section ${student.section}`}</span>
                  </div>
                </div>
                <div className="student-image-container">
                  <img
                    src={student.image || "/images/logo.png"}
                    alt="Student"
                    className="student-image"
                    onError={(e) => (e.target.src = "/images/logo.png")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Attendance Summary Card */}
          {attendance && attendance.subjectSummary && (
            <div className="attendance-summary card-panel">
              <h2 className="section-title">Attendance Summary</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Classes Conducted</th>
                      <th>Classes Attended</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.subjectSummary.map((subject, index) => (
                      <tr key={index}>
                        <td className="text-left font-medium">{subject.subject}</td>
                        <td>{subject.classesConducted}</td>
                        <td>{subject.classesAttended}</td>
                        <td>
                          <span className={`percentage-badge ${parseFloat(subject.percentage) >= 75 ? 'good' : 'low'}`}>
                            {subject.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td className="text-left"><b>Total</b></td>
                      <td><b>{attendance.overall.totalClasses}</b></td>
                      <td><b>{attendance.overall.presentCount}</b></td>
                      <td id="total">
                        <span className="total-badge">{attendance.overall.percentage}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Attendance Summary Card */}
          {attendance && attendance.dailySummary && Object.keys(attendance.dailySummary).length > 0 ? (
            <div className="daily-attendance card-panel">
              <h2 className="section-title">Daily Attendance</h2>
              <div className="table-responsive">
                <table className="data-table t2">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                      <th>5</th>
                      <th>6</th>
                      <th>Total</th>
                      <th>Attended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(attendance.dailySummary).map(([date, data], index) => (
                      <tr key={index}>
                        <td className="date-cell" data-label="Date">{date}</td>
                        {[1, 2, 3, 4, 5, 6].map((period) => {
                          const periodData = data.periods[period];
                          const statusClass = periodData?.status.toLowerCase() === "present"
                            ? "present-cell"
                            : periodData?.status.toLowerCase() === "absent"
                            ? "absent-cell"
                            : "";
                          return (
                            <td key={period} className={statusClass} data-label={`Period ${period}`}>
                              {periodData ? (
                                <span 
                                  className={`status-tag ${periodData.status.toLowerCase()}`}
                                  title={periodData.subject}
                                >
                                  {periodData.subject || "-"}
                                </span>
                              ) : (
                                <span className="empty-cell">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="font-medium numeric-cell" data-label="Total">{data.total}</td>
                        <td className="font-medium numeric-cell" data-label="Attended">{data.attended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="no-records card-panel">
               <h3 style={{ textAlign: "center", color: "#6b7280" }}>No daily attendance records found yet.</h3>
             </div>
          )}
        </div>
      )}

      {/* Internal CSS Upgraded to Modern Template Aesthetic */}      
      <style>      
        {`      
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .dashboard-wrapper {
            font-family: 'Inter', -apple-system, sans-serif;
            background-color: #f8fafc;
            min-height: 100vh;
            color: #1e293b;
            overflow-x: hidden; /* Hard safety constraint */
          }

          .dashboard-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 24px 16px;
          }

          .card-panel {        
            margin-bottom: 24px;        
            padding: 32px;        
            background-color: #ffffff;        
            border-radius: 16px;        
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
          }        
      
          .section-title {        
            text-align: left;        
            color: #0f172a;        
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
          }        

          .table-responsive {
            width: 100%;
            border-radius: 8px;
          }
             
          table {        
            width: 100%;        
            border-collapse: separate;        
            border-spacing: 0;
            margin: 8px 0;
          }        
      
          th, td {        
            padding: 14px 16px;        
            text-align: center;        
            border-bottom: 1px solid #f1f5f9;        
            font-size: 0.925rem;
            white-space: nowrap;
          }        
      
          th {        
            background-color: #f8fafc;      
            color: #475569;        
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }

          /* Explicit structures for Desktop View */
          @media (min-width: 769px) {
            .data-table.t2 {
              min-width: 800px; 
            }
            .data-table.t2 th, .data-table.t2 td {
              width: 9%;
              min-width: 75px;
            }
            .data-table.t2 th:first-child, .data-table.t2 td:first-child {
              width: 16%;
              min-width: 110px;
            }
          }

          /* Modernized Student profile block grid replacement */
          .student-profile-card {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 24px;
          }

          .student-info-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .info-item {
            display: flex;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 10px;
          }

          .info-item:last-child {
            border-bottom: none;
          }

          .info-label {
            width: 25%;
            color: #475569;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .info-value {
            width: 75%;
            color: #0f172a;
            font-weight: 500;
            font-size: 0.925rem;
          }

          .student-image-container {
            flex-shrink: 0;
          }

          .date-cell {
            font-weight: 600; 
            color: #111827;
            text-align: left !important;
          }

          .numeric-cell {
            font-weight: 600;
            color: #0f172a;
          }

          .empty-cell {
            color: #94a3b8;
          }

          .data-table th:first-child, .data-table td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }

          .data-table th:last-child, .data-table td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }

          .text-left {
            text-align: left !important;
          }

          .font-medium {
            font-weight: 500;
            color: #0f172a;
          }

          /* Status Badges */
          .status-tag {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            max-width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }

          .present-cell .status-tag {
            background-color: #ecfdf5;
            color: #059669;
          }

          .absent-cell .status-tag {
            background-color: #fef2f2;
            color: #dc2626;
          }

          .percentage-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
          }

          .percentage-badge.good {
            background-color: #e0f2fe;
            color: #0284c7;
          }

          .percentage-badge.low {
            background-color: #fff7ed;
            color: #ea580c;
          }

          .total-row {
            background-color: #f8fafc;
          }

          .total-row td {
            border-bottom: none;
            color: #0f172a;
          }

          .total-badge {
            background-color: #ff6b35; 
            color: white;
            padding: 6px 12px;
            border-radius: 30px;
            font-weight: 700;
          }

          /* Profile Image Specs */
          img.student-image {        
            width: 120px !important;        
            height: 120px !important;        
            object-fit: cover;        
            border-radius: 12px;        
            border: 3px solid #f1f5f9;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }        

          /* Error Layout */
          .error-container {
            display: flex;
            justify-content: center;
            padding: 40px;
          }
          
          .error-text {
            background-color: #fef2f2;
            color: #ef4444;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            border: 1px solid #fee2e2;
          }
      
          /* ==========================================
             SKELETON SHIMMER ANIMATION 
             ========================================== */
          .skeleton-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
          }

          .skeleton-line {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
            border-radius: 6px;
          }

          .skeleton-title {
            width: 200px;
            height: 24px;
            margin-bottom: 24px;
          }

          .skeleton-profile-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .skeleton-info-rows {
            width: 70%;
          }

          .skeleton-row {
            height: 18px;
            margin-bottom: 16px;
            width: 100%;
          }
          .skeleton-info-rows .skeleton-row:nth-child(2) { width: 85%; }
          .skeleton-info-rows .skeleton-row:nth-child(3) { width: 60%; }

          .skeleton-avatar {
            width: 120px;
            height: 120px;
            border-radius: 12px;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }

          .skeleton-table {
            width: 100%;
          }

          .skeleton-table-header {
            height: 40px;
            background: #f8fafc;
            border-radius: 6px;
            margin-bottom: 12px;
          }

          .skeleton-table-row {
            height: 35px;
            margin-bottom: 8px;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
            border-radius: 4px;
          }

          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }

          /* Responsive Breakpoints & Multi-Column Remappings */        
          @media (max-width: 1024px) {        
            .card-panel { padding: 24px; }
            th, td { padding: 12px; font-size: 0.875rem; }        
          }        
      
          @media (max-width: 768px) {        
            .skeleton-profile-wrapper { flex-direction: column-reverse; align-items: flex-start; }
            .skeleton-info-rows { width: 100%; margin-top: 16px; }
            .skeleton-avatar { margin-bottom: 16px; width: 90px; height: 90px; }

            .card-panel { padding: 20px; }
            th, td { padding: 10px 8px; font-size: 0.8rem; white-space: normal !important; }        
            img.student-image { width: 90px !important; height: 90px !important; }        

            /* Transform Student Details layout dynamically */
            .student-profile-card {
              flex-direction: column-reverse;
              align-items: center;
              gap: 16px;
            }
            .student-info-content { width: 100%; }
            .info-label { width: 35%; }
            .info-value { width: 65%; }

            /* Modern Mobile Remap Strategy for Daily Attendance Grid to completely prevent scroll */
            .data-table.t2, 
            .data-table.t2 thead, 
            .data-table.t2 tbody, 
            .data-table.t2 th, 
            .data-table.t2 td, 
            .data-table.t2 tr {
              display: block;
              width: 100% !important;
            }
            .data-table.t2 thead {
              display: none; /* Hide wide column headers on phone screen */
            }
            .data-table.t2 tr {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              margin-bottom: 16px;
              padding: 12px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.01);
            }
            .data-table.t2 td {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 6px;
              border-bottom: 1px solid #f1f5f9;
              text-align: right !important;
              box-sizing: border-box;
            }
            .data-table.t2 td:last-child {
              border-bottom: none;
            }
            /* Inject inline labels using data attributes dynamically */
            .data-table.t2 td::before {
              content: attr(data-label);
              font-weight: 600;
              color: #64748b;
              font-size: 0.8rem;
              text-transform: uppercase;
              letter-spacing: 0.02em;
              text-align: left;
            }
            .date-cell {
              color: #4f46e5 !important;
              font-size: 0.9rem !important;
              border-bottom: 2px solid #e2e8f0 !important;
              padding-bottom: 10px !important;
              margin-bottom: 6px;
            }
          }

          @media (max-width: 480px) {        
            .card-panel { padding: 16px; }
            th, td { padding: 8px 4px; font-size: 0.75rem; }        
            img.student-image { width: 80px !important; height: 80px !important; }
            .info-label { width: 40%; }
            .info-value { width: 60%; }        
          }        
        `}      
      </style>   
      <Header />   
    </div>
  );
};

export default StudentDashboard;
