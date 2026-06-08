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

  return (
    <div>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {loadingStudent || loadingAttendance ? (
        <h2 className="loading-text">Loading Dashboard...</h2>
      ) : error ? (
        <h2 className="loading-text" style={{ color: "red" }}>{error}</h2>
      ) : (
        <>
          {/* Student Details */}
          {student && (
            <div className="student-details">
              <h2>Student Details</h2>
              <table>
                <tbody>
                  <tr>
                    <th>Roll No.</th>
                    <td>{student.rollNumber}</td>
                    <td rowSpan="4">
                      <img
                        src={student.image || "/images/logo.png"}
                        alt="Student"
                        className="student-image"
                        onError={(e) => (e.target.src = "/images/logo.png")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Student Name</th>
                    <td>{student.name}</td>
                  </tr>
                  <tr>
                    <th>Father's Name</th>
                    <td>{student.fatherName}</td>
                  </tr>
                  <tr>
                    <th>Department</th>
                    <td>{`${student.year} ${student.department} Section ${student.section}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance Summary */}
          {attendance && attendance.subjectSummary && (
            <div className="attendance-summary">
              <h2>Attendance Summary</h2>
              <table>
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
                      <td>{subject.subject}</td>
                      <td>{subject.classesConducted}</td>
                      <td>{subject.classesAttended}</td>
                      <td>{subject.percentage}%</td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <b>Total</b>
                    </td>
                    <td>
                      <b>{attendance.overall.totalClasses}</b>
                    </td>
                    <td>
                      <b>{attendance.overall.presentCount}</b>
                    </td>
                    <td id="total">
                      <b>{attendance.overall.percentage}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Daily Attendance Summary */}
          {attendance && attendance.dailySummary && Object.keys(attendance.dailySummary).length > 0 ? (
            <div className="daily-attendance">
              <h2>Daily Attendance</h2>
              <table className="t2">
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
                      <td style={{ fontWeight: "bold" }}>{date}</td>
                      {[1, 2, 3, 4, 5, 6].map((period) => {
                        const periodData = data.periods[period];
                        return (
                          <td
                            key={period}
                            className={
                              periodData?.status.toLowerCase() === "present"
                                ? "present-cell"
                                : periodData?.status.toLowerCase() === "absent"
                                ? "absent-cell"
                                : ""
                            }
                          >
                            {periodData?.subject || "-"}
                          </td>
                        );
                      })}
                      <td>{data.total}</td>
                      <td>{data.attended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <h3 style={{ textAlign: "center", marginTop: "20px" }}>No daily attendance records found yet.</h3>
          )}
        </>
      )}

      {/* Internal CSS */}      
      <style>      
        {`      
          .loading-text {        
            text-align: center;        
            font-size: 20px;        
            margin-top: 20px;        
          }

          /* Green for present, Red for absent */
          .present-cell {
            color: #2ecc71 !important; /* Green */      
            font-weight: bold;      
          }      
      
          .absent-cell {      
            color: #e74c3c !important; /* Red */      
            font-weight: bold;      
          }      
      
          .student-details, .attendance-summary, .daily-attendance {        
            margin-top: 20px;        
            padding: 25px;        
            background-color: #f9f9f9;        
            border-radius: 8px;        
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);        
          }        
      
          h2 {        
            text-align: center;        
            color: #333;        
          }        
             
          table {        
            width: 100%;        
            margin: 20px 0;        
            border-collapse: collapse;        
            background-color: #fff;        
            border-radius: 8px;        
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);        
          }        
      
          th, td {        
            padding: 12px;        
            text-align: center;        
            border-bottom: 1px solid #ddd;        
          }        
      
          th {        
             background-color: #6495ED;      
            color:white;        
            padding:3px 2px;      
          }

          #total {
            color:red;
          }

          td {
            color: #555;
          }

          img.student-image {        
            width: 140px !important;        
            height: 140px !important;        
            object-fit: cover;        
            border-radius: 50%;        
            margin-left: 20px;        
          }        
      
          /* Responsive Styles */        
          @media (max-width: 1024px) {        
            table { font-size: 14px; padding:10px ; }        
            th, td { padding: 8px; }        
            img.student-image { width: 120px; height: 120px; }        
          }        
      
          @media (max-width: 768px) {        
            table { font-size: 12px; }        
            th, td { padding: 10px ; }        
            img.student-image { width: 70px; height: 70px; }        
            .student-details table, .attendance-summary table, .daily-attendance table { font-size: 10px; }
            .student-details { padding:5px !important; }
          }

          @media (max-width: 480px) {        
            table { font-size: 10px; }        
            th, td { padding: 4px; }        
            img.student-image { width: 70px !important; height: 70px !important; }        
          }        
        `}      
      </style>      
    </div>
  );
};

export default StudentDashboard;
