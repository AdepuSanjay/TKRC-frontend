import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Marking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const date = query.get("date") || new Date().toISOString().split("T")[0];
  const programYear = query.get("year") || query.get("programYear");
  const department = query.get("department");
  const section = query.get("section");
  const subject = query.get("subject");
  const editPeriod = query.get("editPeriod");

  const [studentsData, setStudentsData] = useState([]);
  const [facultyName, setFacultyName] = useState(localStorage.getItem("userName") || "Faculty");
  const [phoneNumber, setPhoneNumber] = useState("Not available");
  
  const facultyId = localStorage.getItem("facultyId");
  const token = localStorage.getItem("token");

  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState([]);
  const [markedSubjects, setMarkedSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFacultyDetails();
    fetchStudents();
    fetchMarkedSubjects();
    if (editPeriod) {
      fetchAttendanceRecord();
    }
  }, []);

  const fetchFacultyDetails = async () => {
    if (!facultyId || !token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
      const me = response.data.find(f => String(f.employeeId).trim() === String(facultyId).trim());
      
      if (me) {
        setFacultyName(me.name);
        setPhoneNumber(me.mobileNumber || "Not available");
      }
    } catch (error) {
      console.error("Error fetching faculty details:", error.message);
    }
  };

  const fetchStudents = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Passing all 3 mandatory parameters to the new API!
      const response = await axios.get(
        `https://tkrc-backend-lreo.onrender.com/api/attendance/students-list?year=${programYear}&department=${department}&section=${section}`,
        { headers }
      );
      
      const students = response.data;
      if (students && Array.isArray(students)) {
        setStudentsData(students);
        setAttendance(
          students.reduce((acc, student) => {
            acc[student.rollNumber] = "present"; // Default to "present"
            return acc;
          }, {})
        );
      } else {
        throw new Error("Failed to fetch students.");
      }
    } catch (error) {
      toast.error(`Error fetching students: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarkedSubjects = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/attendance", { headers });
      
      if (response.data && Array.isArray(response.data)) {
        // Filter the giant list to find what has already been marked for this exact class today
        const todaysMarks = response.data.filter(
          record => 
            record.date === date && 
            record.year === programYear && 
            record.department === department && 
            record.section === section
        );
        setMarkedSubjects(todaysMarks);
      }
    } catch (error) {
      console.error("Failed to fetch marked subjects:", error.message);
    }
  };

  const fetchAttendanceRecord = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `https://tkrc-backend-lreo.onrender.com/api/attendance/search?date=${date}&year=${programYear}&department=${department}&section=${section}&period=${editPeriod}`,
        { headers }
      );
      
      const record = response.data;
      if (record) {
        setTopic(record.topic || "");
        setRemarks(record.remarks || "");
        setAttendance(
          record.attendance.reduce((acc, student) => {
            acc[student.rollNumber] = student.status;
            return acc;
          }, {})
        );
        setPeriods([parseInt(editPeriod)]);
      }
    } catch (error) {
      toast.error("No existing attendance record found for this period.");
    }
  };

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  const handleSubmit = async () => {
    if (!subject || !subject.trim() || periods.length === 0) {
      toast.warning("Please fill in all mandatory fields (Periods, Subject).");
      return;
    }

    setIsSubmitting(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Loop through all selected checkboxes and send an individual sheet for each period
      const submissionPromises = periods.map(period => {
        const attendanceData = {
          date,
          year: programYear,
          department,
          section,
          subject,
          topic,
          remarks,
          period: period, // Single integer as required by backend
          facultyName,
          phoneNumber,
          attendance: studentsData.map((student) => ({
            rollNumber: student.rollNumber,
            name: student.name,
            status: attendance[student.rollNumber],
          })),
        };

        return axios.post(
          "https://tkrc-backend-lreo.onrender.com/api/attendance",
          attendanceData,
          { headers }
        );
      });

      // Wait for all periods to submit
      await Promise.all(submissionPromises);

      toast.success("Attendance submitted successfully!");
      setTimeout(() => navigate("/attendance"), 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Submission Failed: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMarkedSubject = (period) => {
    const marked = markedSubjects.find((item) => item.period === period);
    return marked ? marked.subject : null;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        .attendanceMain {
          padding: 20px;
          background-color: #fff;
          margin: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .compulsoryText { color: red; font-weight: bold; }
        .attendanceHeading {
          font-size: 19px; font-weight: bold; padding-top:5px;
          margin-top:4px; margin-bottom: 15px; text-align: center;
        }
        .attendanceDetails { margin-bottom: 20px; }
        .periodSelection { margin-bottom: 15px; }
        .periodSelection label { font-size: 14px; margin-right: 10px; }
        .periodSelection input[type="checkbox"] {
          margin-right: 6px; width: 18px; height: 18px; cursor: pointer; display: inline-block;
        }
        .subjectTopicEntry label { font-size: 14px; margin-top: 8px; display: block; }
        .subjectTopicEntry input, .subjectTopicEntry textarea {
          font-size: 14px; padding: 8px; margin-top: 6px; margin-bottom: 12px;
          border-radius: 4px; border: 1px solid #ccc; width: 100%;
        }
        .subjectTopicEntry textarea { height: 80px; resize: vertical; }
        #btn-submit {
          background-color: #FF5733; color: white; padding: 10px 20px; border: none;
          border-radius: 5px; cursor: pointer; font-size: 16px; position: relative;
          top: 10px; left: 50%; transform: translateX(-50%); text-align: center;
        }
        #btn-submit:hover { background-color: #ff704d; }
        button:disabled { background-color: #dcdcdc; cursor: not-allowed; }
        .attendanceList { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .attendanceList th, .attendanceList td { text-align: center; padding: 10px; border: 1.5px solid #ddd; }
        .attendanceList th { background-color: #f7f7f7; font-weight: bold; }
        .attendanceList td { background-color: #fff; }
        .attendanceList input[type="radio"] {
          appearance: none; -webkit-appearance: none; width: 20px; height: 20px;
          border: 2px solid #aaa; border-radius: 50%; cursor: pointer; background-color: white;
        }
        .attendanceList input[type="radio"]:checked { background-color: #2ecc71; border-color: #2ecc71; }
        .attendanceList input[type="radio"].absentStatus:checked { background-color: #e74c3c; border-color: #e74c3c; }

        @media (max-width: 768px) {
          .attendanceMain { margin: 15px; padding: 20px; }
          .periodSelection label{ margin-right:4px; }
          .periodSelection input[type="checkbox"] { margin-right: 0px !important; }
          .attendanceList th, .attendanceList td { font-size: 12px; padding: 8px; }
          .subjectTopicEntry textarea { height: 70px; }
          .subjectTopicEntry input, .subjectTopicEntry textarea { font-size: 12px; }
          #btn-submit { font-size: 14px; position:relative; padding-top:5px !important; }
          .attendanceList input[type="radio"] { width: 25px !important; height: 25px !important; }
        }
        @media (max-width: 480px) {
          .attendanceList th, .attendanceList td { font-size: 11px; padding: 6px; }
          .attendanceList input[type="radio"] { width: 20px; height: 20px; }
          .subjectTopicEntry textarea { height: 60px; }
          #btn-submit { font-size: 14px; padding: 8px; width: 100%; left: 0; transform: none; top: 0; }
        }
      `}</style>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      <div className="attendanceMain">
        <h2>{editPeriod ? `Editing Attendance for Period ${editPeriod}` : "Mark Attendance"}</h2>
        <p>
          <b>Date:</b> {date} <br/>
          <b>Class:</b> {programYear} {department}-{section} <br/>
          <b>Subject:</b> {subject}
        </p>
        
        <div className="periodSelection">
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => {
            const markedSubject = getMarkedSubject(period);
            const isMarkedByMe = markedSubject !== null;
            
            return (
              <label key={period} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={period}
                  checked={periods.includes(period)}
                  disabled={
                    editPeriod
                      ? period !== parseInt(editPeriod)
                      : isMarkedByMe
                  }
                  onChange={() =>
                    setPeriods((prev) =>
                      prev.includes(period)
                        ? prev.filter((p) => p !== period)
                        : [...prev, period]
                    )
                  }
                />
                {period}
                {isMarkedByMe && (
                  <span style={{ color: "red", marginLeft: "5px", fontSize: "0.8em" }}>
                    ({markedSubject})
                  </span>
                )}
              </label>
            );
          })}
        </div>

        <div className="subjectTopicEntry">
          <label>Topic (Optional):</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topics covered"
          />
          <label>Remarks (Optional):</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any remarks"
          />
        </div>

        {isLoading ? (
          <p style={{textAlign: "center", marginTop: "20px"}}>Loading students for {department}-{section}...</p>
        ) : studentsData.length === 0 ? (
          <p style={{textAlign: "center", color: "red", marginTop: "20px"}}>No students found in this section.</p>
        ) : (
          <table className="attendanceList">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student.rollNumber}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="radio"
                      checked={attendance[student.rollNumber] === "present"}
                      onChange={() =>
                        handleAttendanceChange(student.rollNumber, "present")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      className="absentStatus"
                      checked={attendance[student.rollNumber] === "absent"}
                      onChange={() =>
                        handleAttendanceChange(student.rollNumber, "absent")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button id="btn-submit" onClick={handleSubmit} disabled={isSubmitting || studentsData.length === 0}>
          {isSubmitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </>
  );
};

export default Marking;
