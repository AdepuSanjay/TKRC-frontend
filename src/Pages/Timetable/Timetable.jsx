import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Timetable.css";

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
                const loadingToast = toast.loading("Loading your schedule...", { theme: "colored" });

                const facId = localStorage.getItem("facultyId");
                const stuId = localStorage.getItem("studentId");
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                if (isStudent && !stuId) {
                    toast.dismiss();
                    toast.error("You are not properly logged in. Please log out and log back in.", { theme: "colored" });
                    setLoading(false);
                    return;
                }

                const standardDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                if (!isStudent) {
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

                toast.dismiss(loadingToast);
                setLoading(false);

            } catch (error) {
                toast.dismiss();
                console.error("Dashboard Fetch Error:", error);

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
        <div className="app-wrapper">
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="nav">
                <NavBar facultyName={profileDetails?.name || "Dashboard"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            <main className="timetable-container animate-fade-in">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading schedule...</p>
                    </div>
                ) : (
                    <>
                        {/* 1. PREMIUM PROFILE CARD (Modeled after template) */}
                        <section className="profile-card">
                            <div className="profile-badge">PROFILE OVERVIEW</div>
                            <div className="profile-content">
                                <div className="profile-info">
                                    <h1 className="profile-name">{profileDetails?.name || "N/A"}</h1>
                                    <p className="profile-dept">{profileDetails?.department || "N/A"}</p>
                                    <div className="profile-designation-badge">
                                        {profileDetails?.designation || "N/A"}
                                    </div>
                                </div>
                                <div className="profile-image-container">
                                    <img
                                        src={profileDetails?.image || "/images/logo.png"}
                                        alt={`${profileDetails?.name || "User"} Profile`}
                                        className="profile-image"
                                        onError={(e) => (e.target.src = "/images/logo.png")}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="section-header">
                            <h2 className="timetable-heading">Master Schedule</h2>
                            <span className="semester-badge">ODD Semester ({currentYear}-{currentYear + 1})</span>
                        </div>

                        {/* 2. MAIN TIMETABLE SECTION */}
                        <section className="timetable-content fade-up-stagger">
                            {timetable.length === 0 ? (
                                <div className="empty-state">No timetable data available.</div>
                            ) : (
                                <div className="table-responsive-wrapper">
                                    <table className="modern-table">
                                        <thead>
                                            <tr>
                                                <th className="sticky-col">Day</th>
                                                <th>9:40 - 10:40</th>
                                                <th>10:40 - 11:40</th>
                                                <th>11:40 - 12:40</th>
                                                <th>12:40 - 1:20</th>
                                                <th>1:20 - 2:20</th>
                                                <th>2:20 - 3:20</th>
                                                <th>3:20 - 4:20</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timetable.map((dayData, index) => {
                                                const periods = [...Array(7)].map((_, i) =>
                                                    dayData.periods?.find((p) => p.periodNumber === i + 1) || null
                                                );

                                                const periodsBeforeLunch = processPeriods(periods.slice(0, 3));
                                                const lunchPeriod = periods[3]; 
                                                const periodsAfterLunch = processPeriods(periods.slice(4));

                                                return (
                                                    <tr key={index} style={{ animationDelay: `${index * 0.1}s` }} className="row-animate">
                                                        <td className="day-cell sticky-col">{dayData.day || "N/A"}</td>

                                                        {periodsBeforeLunch.map((merged, i) => (
                                                            <td key={`pre-${i}`} colSpan={merged.span} className={merged.period ? "period-cell active-period" : "period-cell empty-period"}>
                                                                {merged.period ? (
                                                                    <div className="period-content">
                                                                        <span className="subject-title">{merged.period.subject}</span>
                                                                        {isStudent && merged.period.facultyName && (
                                                                            <span className="faculty-name">
                                                                                {merged.period.facultyName}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : "-"}
                                                            </td>
                                                        ))}

                                                        <td className="lunch-cell">
                                                            {isStudent && lunchPeriod?.subject
                                                                ? lunchPeriod.subject
                                                                : "LUNCH BREAK"}
                                                        </td>

                                                        {periodsAfterLunch.map((merged, i) => (
                                                            <td key={`post-${i}`} colSpan={merged.span} className={merged.period ? "period-cell active-period" : "period-cell empty-period"}>
                                                                {merged.period ? (
                                                                    <div className="period-content">
                                                                        <span className="subject-title">{merged.period.subject}</span>
                                                                        {isStudent && merged.period.facultyName && (
                                                                            <span className="faculty-name">
                                                                                {merged.period.facultyName}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        {/* 3. STUDENT SUBJECT-FACULTY DIRECTORY */}
                        {isStudent && subjectFacultyMap.length > 0 && (
                            <div className="directory-section animate-fade-in" style={{animationDelay: '0.6s'}}>
                                <div className="section-header">
                                    <h2 className="timetable-heading">Subject Directory</h2>
                                    <span className="semester-badge light-badge">Contact Info</span>
                                </div>
                                <section className="timetable-content">
                                    <div className="table-responsive-wrapper">
                                        <table className="modern-table secondary-table">
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Assigned Faculty</th>
                                                    <th>Contact Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subjectFacultyMap.map((mapping, idx) => (
                                                    <tr key={idx} className="row-animate" style={{ animationDelay: `${idx * 0.1}s` }}>
                                                        <td className="subject-highlight">{mapping.subject}</td>
                                                        <td className="faculty-highlight">{mapping.facultyName}</td>
                                                        <td>
                                                            <span className="contact-pill">{mapping.phoneNumber}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Timetable;
