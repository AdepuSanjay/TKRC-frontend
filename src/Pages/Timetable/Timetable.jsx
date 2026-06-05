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
                const loadingToast = toast.loading("Loading your schedule...", { theme: "colored" });

                const facId = localStorage.getItem("facultyId");
                const stuId = localStorage.getItem("studentId");
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Standard 6-day week for the grid
                const standardDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                if (!isStudent) {
                    // ==========================================
                    // 1. FETCH FACULTY DATA
                    // ==========================================
                    const response = await axios.get("http://localhost:8080/api/faculty", { headers });
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
                    // 2. FETCH STUDENT DATA (FOOLPROOF FLATTENING)
                    // ==========================================
                    console.log("Searching for Student ID from LocalStorage:", stuId); // DEBUG LOG
                    
                    const response = await axios.get("http://localhost:8080/api/section-data", { headers });
                    
                    // Fallback to instantly show known details from Login Cache
                    let myProfile = {
                        name: localStorage.getItem("userName") || "Student",
                        image: localStorage.getItem("profileImage") || "",
                        designation: "Student",
                        department: "Loading Class Details..."
                    };
                    
                    let myTimetable = [];
                    let facultyMappingObj = {};

                    // Step A: Flatten safely by renaming section 'name' to 'sectionName'
                    const allSections = (response.data || []).flatMap(year => 
                        (year.departments || []).flatMap(dept => 
                            (dept.sections || []).map(sec => ({
                                yearName: year.year,
                                deptName: dept.name,
                                sectionName: sec.name,
                                timetable: sec.timetable || [],
                                students: sec.students || []
                            }))
                        )
                    );

                    // Step B: Find the exact section (Case-insensitive & space-trimmed)
                    const targetStudentId = String(stuId).trim().toLowerCase();
                    const mySection = allSections.find(sec => 
                        sec.students.some(st => String(st.rollNumber).trim().toLowerCase() === targetStudentId)
                    );

                    if (mySection) {
                        console.log("Section successfully found:", mySection.sectionName); // DEBUG LOG
                        
                        const me = mySection.students.find(st => String(st.rollNumber).trim().toLowerCase() === targetStudentId);
                        
                        myProfile = {
                            name: me.name || myProfile.name,
                            department: `${mySection.yearName} - ${mySection.deptName} (Section ${mySection.sectionName})`,
                            designation: "Student",
                            image: me.image || myProfile.image
                        };

                        const dbTimetable = mySection.timetable || [];

                        // Build robust 6-day grid
                        myTimetable = standardDays.map(dayName => {
                            const existingDay = dbTimetable.find(d => d.day === dayName);
                            return {
                                day: dayName,
                                periods: existingDay ? existingDay.periods : []
                            };
                        });

                        // Extract Unique Faculty Mapping
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
                    } else {
                        console.warn("WARNING: Student ID not found in any section array!"); // DEBUG LOG
                    }

                    // Convert map to array
                    const facultyMappingArray = Object.keys(facultyMappingObj).map(subject => ({
                        subject,
                        ...facultyMappingObj[subject]
                    }));

                    // Set States
                    setProfileDetails(myProfile);
                    setTimetable(myTimetable);
                    setSubjectFacultyMap(facultyMappingArray);
                }

                toast.dismiss(loadingToast);
                setLoading(false);

            } catch (error) {
                toast.dismiss();
                toast.error("Error fetching data! Ensure backend is running.", { theme: "colored" });
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
            <ToastContainer position="top-right" autoClose={2000} />
            <Header />
            <div className="nav">
                <NavBar facultyName={profileDetails?.name || "Dashboard"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            <div className="timetable-container">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>Loading schedule...</div>
                ) : (
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
                                            const lunchPeriod = periods[3]; 
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
