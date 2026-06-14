import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [profileDetails, setProfileDetails] = useState(null);
    const [subjectFacultyMap, setSubjectFacultyMap] = useState([]);
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem("userRole");
    const isStudent = role?.toLowerCase() === "student";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const facId = localStorage.getItem("facultyId");
                const stuId = localStorage.getItem("studentId");
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Prevent execution if localStorage is empty
                if (isStudent && !stuId) {
                    toast.error("You are not properly logged in. Please log out and log back in.", { theme: "colored" });
                    setLoading(false);
                    return;
                }

                const standardDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                if (!isStudent) {
                    // ==========================================
                    // 1. FETCH FACULTY DATA
                    // ==========================================
                    const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
                    const me = response.data.find(f => String(f.employeeId).trim().toLowerCase() === String(facId).trim().toLowerCase());

                    if (me) {
                        setProfileDetails({
                            name: me.name,
                            department: "Faculty",
                            designation: me.designation,
                            image: me.image
                        });

                        const groupedTimetable = standardDays.map(dayName => {
                            const daySlots = me.personalTimetable?.filter(s => s.day === dayName) || [];
                            return {
                                day: dayName,
                                periods: daySlots.map(s => ({
                                    periodNumber: s.periodNumber,
                                    subject: `${s.subject} (${s.yearId}, ${s.deptName}-${s.sectionName})` 
                                }))
                            };
                        });

                        setTimetable(groupedTimetable);
                    }
                } else {
                    // ==========================================
                    // 2. FETCH STUDENT DATA (CLEAN API)
                    // ==========================================
                    const response = await axios.get(`https://tkrc-backend-lreo.onrender.com/api/students/${stuId}/dashboard`, { headers });
                    const data = response.data;

                    setProfileDetails({
                        name: data.student.name || localStorage.getItem("userName"),
                        department: `${data.academicYear} - ${data.department} (Section ${data.sectionName})`,
                        designation: "Student",
                        image: data.student.image || localStorage.getItem("profileImage") || "/images/logo.png"
                    });

                    const dbTimetable = data.timetable || [];
                    let facultyMappingObj = {};

                    const mappedTimetable = standardDays.map(dayName => {
                        const existingDay = dbTimetable.find(d => d.day === dayName);
                        return {
                            day: dayName,
                            periods: existingDay ? existingDay.periods : []
                        };
                    });

                    dbTimetable.forEach(day => {
                        day.periods?.forEach(period => {
                            if (period.subject && !facultyMappingObj[period.subject]) {
                                facultyMappingObj[period.subject] = {
                                    facultyName: period.facultyName || "TBA",
                                    phoneNumber: period.phoneNumber || "N/A"
                                };
                            }
                        });
                    });

                    const facultyMappingArray = Object.keys(facultyMappingObj).map(subject => ({
                        subject,
                        ...facultyMappingObj[subject]
                    }));

                    setTimetable(mappedTimetable);
                    setSubjectFacultyMap(facultyMappingArray);
                }

                setLoading(false);

            } catch (error) {
                console.error("Dashboard Fetch Error:", error);

                // SMART ERROR ALERTS
                if (error.response && error.response.status === 404) {
                    toast.error(`Student ID ${localStorage.getItem("studentId")} not found in database! Please Re-Login.`, { theme: "colored", autoClose: 5000 });
                } else if (error.message === "Network Error") {
                    toast.error("Network Blocked! Ensure backend is running and CORS is allowed.", { theme: "colored", autoClose: 6000 });
                } else {
                    toast.error("Server error. Ensure backend is running.", { theme: "colored" });
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isStudent]);

    const processPeriods = (periods) => {
        const mergedPeriods = [];
        let i = 0;
        while (i < periods.length) {
            let span = 1;
            while (
                i + span < periods.length &&
                periods[i] &&
                periods[i + span] &&
                periods[i].subject === periods[i + span].subject
            ) {
                span++;
            }
            mergedPeriods.push({ period: periods[i], span });
            i += span;
        }
        return mergedPeriods;
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* CSS for Skeleton Animation */}
            <style>
                {`
                .skeleton-box {
                    background: #e0e0e0;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .skeleton-profile-container {
                    border: 1px solid #eaeaea;
                    border-radius: 8px;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    background: #fff;
                }
                .skeleton-grid {
                    border: 1px solid #eaeaea;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #fff;
                }
                .skeleton-row {
                    display: flex;
                    border-bottom: 1px solid #eaeaea;
                    padding: 15px;
                }
                .skeleton-cell {
                    flex: 1;
                    padding: 0 10px;
                }
                `}
            </style>

            <ToastContainer position="top-right" autoClose={2000} />

            <div className="nav">
                <NavBar facultyName={profileDetails?.name || "Dashboard"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            <div className="timetable-container">
                {loading ? (
                    // --- SKELETON UI SECTION ---
                    <div className="skeleton-wrapper" style={{ padding: "1rem" }}>
                        
                        {/* Profile Skeleton */}
                        <div className="skeleton-profile-container">
                            <div style={{ flex: 1 }}>
                                <div className="skeleton-box" style={{ height: "24px", width: "40%", marginBottom: "15px" }}></div>
                                <div className="skeleton-box" style={{ height: "20px", width: "60%", marginBottom: "15px" }}></div>
                                <div className="skeleton-box" style={{ height: "20px", width: "30%" }}></div>
                            </div>
                            <div>
                                <div className="skeleton-box" style={{ width: "100px", height: "100px", borderRadius: "50%" }}></div>
                            </div>
                        </div>

                        {/* Heading Skeleton */}
                        <div className="skeleton-box" style={{ height: "30px", width: "50%", margin: "0 auto 2rem auto" }}></div>

                        {/* Timetable Grid Skeleton */}
                        <div className="skeleton-grid">
                            {/* Header Row */}
                            <div className="skeleton-row" style={{ background: "#f9f9f9" }}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="skeleton-cell">
                                        <div className="skeleton-box" style={{ height: "20px", width: "100%" }}></div>
                                    </div>
                                ))}
                            </div>
                            {/* 6 Days Rows */}
                            {[...Array(6)].map((_, r) => (
                                <div key={r} className="skeleton-row">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="skeleton-cell">
                                            <div className="skeleton-box" style={{ height: "40px", width: "100%" }}></div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // --- ACTUAL DATA SECTION ---
                    <>
                        {/* 1. PROFILE SECTION */}
                        <section className="faculty-profile">
                            <table className="profile-table">
                                <tbody>
                                    <tr>
                                        <td className="label">Name</td>
                                        <td>{profileDetails?.name || "N/A"}</td>
                                        <td className="profile-image-cell" rowSpan={3}>
                                            <img
                                                src={profileDetails?.image || "/images/logo.png"}
                                                alt={`${profileDetails?.name || "User"} Profile`}
                                                className="profile-image"
                                                onError={(e) => (e.target.src = "/images/logo.png")}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label">Department / Class</td>
                                        <td>{profileDetails?.department || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Designation</td>
                                        <td>{profileDetails?.designation || "N/A"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <h2 className="timetable-heading">Time Table - ODD Semester ({currentYear}-{currentYear + 1})</h2>

                        {/* 2. MAIN TIMETABLE SECTION */}
                        <section className="timetable-content">
                            {timetable.length === 0 ? (
                                <p className="no-data">No timetable data available.</p>
                            ) : (
                                <table className="timetable-table">
                                    <thead>
                                        <tr>
                                            <th>DAY</th>
                                            <th>9:40-10:40</th>
                                            <th>10:40-11:40</th>
                                            <th>11:40-12:40</th>
                                            <th>12:40-1:20</th>
                                            <th>1:20-2:20</th>
                                            <th>2:20-3:20</th>
                                            <th>3:20-4:20</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetable.map((dayData, index) => {
                                            const periods = [...Array(7)].map((_, i) =>
                                                dayData.periods?.find((p) => p.periodNumber === i + 1) || null
                                            );

                                            const periodsBeforeLunch = processPeriods(periods.slice(0, 3));
                                            const lunchPeriod = periods; 
                                            const periodsAfterLunch = processPeriods(periods.slice(4));

                                            return (
                                                <tr key={index}>
                                                    <td className="day-cell" style={{fontWeight: 'bold'}}>{dayData.day || "N/A"}</td>

                                                    {periodsBeforeLunch.map((merged, i) => (
                                                        <td key={`pre-${i}`} colSpan={merged.span} className="period-cell">
                                                            {merged.period ? (
                                                                <>
                                                                    <span style={{ display: 'block' }}>{merged.period.subject}</span>
                                                                    {isStudent && merged.period.facultyName && (
                                                                        <span style={{ display: 'block', fontSize: '0.85em', color: '#555' }}>
                                                                            ({merged.period.facultyName})
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : "-"}
                                                        </td>
                                                    ))}

                                                    <td className="lunch-cell">
                                                        {isStudent && lunchPeriod?.subject
                                                            ? lunchPeriod.subject
                                                            : "LUNCH"}
                                                    </td>

                                                    {periodsAfterLunch.map((merged, i) => (
                                                        <td key={`post-${i}`} colSpan={merged.span} className="period-cell">
                                                            {merged.period ? (
                                                                <>
                                                                    <span style={{ display: 'block' }}>{merged.period.subject}</span>
                                                                    {isStudent && merged.period.facultyName && (
                                                                        <span style={{ display: 'block', fontSize: '0.85em', color: '#555' }}>
                                                                            ({merged.period.facultyName})
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : "-"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </section>

                        {/* 3. STUDENT SUBJECT-FACULTY DIRECTORY */}
                        {isStudent && subjectFacultyMap.length > 0 && (
                            <>
                                <h2 className="timetable-heading" style={{ marginTop: '2rem' }}>Subject Directory</h2>
                                <section className="timetable-content">
                                    <table className="timetable-table">
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Assigned Faculty</th>
                                                <th>Contact Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjectFacultyMap.map((mapping, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ textAlign: "left", paddingLeft: "15px", fontWeight: "bold" }}>
                                                        {mapping.subject}
                                                    </td>
                                                    <td>{mapping.facultyName}</td>
                                                    <td>{mapping.phoneNumber}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Timetable;
