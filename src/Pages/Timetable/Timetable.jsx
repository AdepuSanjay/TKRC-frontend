import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Timetable.css";

import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

// ─── TKRCET official logo & campus image ───────────────────────────────────────
const COLLEGE_LOGO    = "https://tkrcet.ac.in/wp-content/uploads/2025/06/logo-tkrcet.png";
const CAMPUS_BG_IMAGE = "https://tkrcet.ac.in/wp-content/uploads/2025/06/Untitled-design-2.jpg";

const Timetable = () => {
    const [timetable, setTimetable]             = useState([]);
    const [profileDetails, setProfileDetails]   = useState(null);
    const [subjectFacultyMap, setSubjectFacultyMap] = useState([]);
    const [loading, setLoading]                 = useState(true);

    const role      = localStorage.getItem("userRole");
    const isStudent = role?.toLowerCase() === "student";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const loadingToast = toast.loading("Loading your schedule...", { theme: "colored" });

                const facId   = localStorage.getItem("facultyId");
                const stuId   = localStorage.getItem("studentId");
                const token   = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                if (isStudent && !stuId) {
                    toast.dismiss();
                    toast.error("You are not properly logged in. Please log out and log back in.", { theme: "colored" });
                    setLoading(false);
                    return;
                }

                const standardDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

                if (!isStudent) {
                    const response = await axios.get("https://tkrc-backend-lreo.onrender.com/api/faculty", { headers });
                    const me = response.data.find(
                        f => String(f.employeeId).trim().toLowerCase() === String(facId).trim().toLowerCase()
                    );

                    if (me) {
                        setProfileDetails({
                            name:        me.name,
                            department:  "Faculty",
                            designation: me.designation,
                            image:       me.image
                        });

                        const groupedTimetable = standardDays.map(dayName => {
                            const daySlots = me.personalTimetable?.filter(s => s.day === dayName) || [];
                            return {
                                day:     dayName,
                                periods: daySlots.map(s => ({
                                    periodNumber: s.periodNumber,
                                    subject:      `${s.subject} (${s.yearId}, ${s.deptName}-${s.sectionName})`
                                }))
                            };
                        });

                        setTimetable(groupedTimetable);
                    }
                } else {
                    const response = await axios.get(
                        `https://tkrc-backend-lreo.onrender.com/api/students/${stuId}/dashboard`,
                        { headers }
                    );
                    const data = response.data;

                    setProfileDetails({
                        name:        data.student.name || localStorage.getItem("userName"),
                        department:  `${data.academicYear} - ${data.department} (Section ${data.sectionName})`,
                        designation: "Student",
                        image:       data.student.image || localStorage.getItem("profileImage") || "/images/logo.png"
                    });

                    const dbTimetable       = data.timetable || [];
                    let   facultyMappingObj = {};

                    const mappedTimetable = standardDays.map(dayName => {
                        const existingDay = dbTimetable.find(d => d.day === dayName);
                        return { day: dayName, periods: existingDay ? existingDay.periods : [] };
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

                if (error.response?.status === 404) {
                    toast.error(`Student ID ${localStorage.getItem("studentId")} not found! Please Re-Login.`, {
                        theme: "colored", autoClose: 5000
                    });
                } else if (error.message === "Network Error") {
                    toast.error("Network Blocked! Ensure backend is running and CORS is allowed.", {
                        theme: "colored", autoClose: 6000
                    });
                } else {
                    toast.error("Server error. Ensure backend is running.", { theme: "colored" });
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isStudent]);

    /* ── merge consecutive identical subjects ─────────────────── */
    const processPeriods = (periods) => {
        const merged = [];
        let i = 0;
        while (i < periods.length) {
            let span = 1;
            while (
                i + span < periods.length &&
                periods[i] &&
                periods[i + span] &&
                periods[i].subject === periods[i + span].subject
            ) { span++; }
            merged.push({ period: periods[i], span });
            i += span;
        }
        return merged;
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="nav">
                <NavBar facultyName={profileDetails?.name || "Dashboard"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            <div className="timetable-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            Loading your schedule…
                        </span>
                    </div>
                ) : (
                    <>
                        {/* ── 1. COLLEGE HERO BANNER ───────────────────── */}
                        <div className="college-hero-banner">
                            <img
                                src={CAMPUS_BG_IMAGE}
                                alt="TKRCET Campus"
                                className="hero-img"
                                onError={e => (e.target.style.display = "none")}
                            />
                            <img
                                src={COLLEGE_LOGO}
                                alt="TKRCET Logo"
                                className="hero-logo"
                                onError={e => (e.target.style.display = "none")}
                            />
                            <div className="hero-overlay-text">
                                <div className="college-name">
                                    TKR College of Engineering &amp; Technology
                                </div>
                                <div className="college-sub">
                                    Meerpet, Hyderabad &nbsp;·&nbsp; NAAC Accredited &nbsp;·&nbsp; JNTUH Affiliated
                                </div>
                            </div>
                        </div>

                        {/* ── 2. PROFILE SECTION ───────────────────────── */}
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
                                                onError={e => (e.target.src = "/images/logo.png")}
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

                        {/* ── 3. TIMETABLE HEADING ─────────────────────── */}
                        <h2 className="timetable-heading">
                            <span className="live-dot" />
                            Time Table — ODD Semester
                            <span className="semester-badge">{currentYear}–{currentYear + 1}</span>
                        </h2>

                        {/* ── 4. MAIN TIMETABLE ────────────────────────── */}
                        <section className="timetable-content">
                            {timetable.length === 0 ? (
                                <p className="no-data">No timetable data available.</p>
                            ) : (
                                <table className="timetable-table">
                                    <thead>
                                        <tr>
                                            <th>DAY</th>
                                            <th>9:40–10:40</th>
                                            <th>10:40–11:40</th>
                                            <th>11:40–12:40</th>
                                            <th>12:40–1:20</th>
                                            <th>1:20–2:20</th>
                                            <th>2:20–3:20</th>
                                            <th>3:20–4:20</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetable.map((dayData, index) => {
                                            const periods = [...Array(7)].map((_, i) =>
                                                dayData.periods?.find(p => p.periodNumber === i + 1) || null
                                            );

                                            const periodsBeforeLunch = processPeriods(periods.slice(0, 3));
                                            const lunchPeriod        = periods[3];
                                            const periodsAfterLunch  = processPeriods(periods.slice(4));

                                            return (
                                                <tr key={index}>
                                                    <td className="day-cell">{dayData.day || "N/A"}</td>

                                                    {periodsBeforeLunch.map((merged, i) => (
                                                        <td key={`pre-${i}`} colSpan={merged.span} className="period-cell">
                                                            {merged.period ? (
                                                                <>
                                                                    <span style={{ display: "block" }}>
                                                                        {merged.period.subject}
                                                                    </span>
                                                                    {isStudent && merged.period.facultyName && (
                                                                        <span className="faculty-tag">
                                                                            {merged.period.facultyName}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : "–"}
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
                                                                    <span style={{ display: "block" }}>
                                                                        {merged.period.subject}
                                                                    </span>
                                                                    {isStudent && merged.period.facultyName && (
                                                                        <span className="faculty-tag">
                                                                            {merged.period.facultyName}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : "–"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </section>

                        {/* ── 5. SUBJECT DIRECTORY (students only) ─────── */}
                        {isStudent && subjectFacultyMap.length > 0 && (
                            <>
                                <h2 className="timetable-heading" style={{ marginTop: "2.2rem" }}>
                                    Subject Directory
                                </h2>
                                <section className="timetable-content">
                                    <table className="timetable-table">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "left", paddingLeft: "1.2rem" }}>Subject</th>
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

                        {/* ── 6. FOOTER ────────────────────────────────── */}
                        <div className="tkrcet-footer-strip">
                            <strong>TKRCET</strong> &nbsp;·&nbsp; Meerpet, Hyderabad &nbsp;·&nbsp;
                            Affiliated to JNTUH &nbsp;·&nbsp; Approved by AICTE &amp; Telangana State Govt.
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Timetable;
