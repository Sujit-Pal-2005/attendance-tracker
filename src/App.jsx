import { useEffect, useState } from "react";
import { seedAttendance } from "./seedFirestore";

import {
  getStudents,
  addStudent,
  getRoutine,
  getAttendance,
  markAttendance,
  getOverall,
  getSummary,
} from "./firebaseApi";

export default function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [studentName, setStudentName] = useState("");

  const [date, setDate] = useState("");

  const [routine, setRoutine] = useState([]);

  const [attendanceMap, setAttendanceMap] = useState({});

  const [summary, setSummary] = useState({
    attended: 0,
    total: 0,
    percent: 0,
  });
  const [subjectSummary, setSubjectSummary] = useState([]);

  /* -----------------------------
  LOAD STUDENTS
  ------------------------------*/

  async function loadStudents() {
    const data = await getStudents();

    setStudents(data);

    if (data.length > 0) {
      setSelectedStudent(data[0].id);
    }
  }

  /* -----------------------------
  ADD STUDENT
  ------------------------------*/

  async function handleAddStudent() {
    if (!studentName) return;

    await addStudent(studentName);

    setStudentName("");

    loadStudents();
  }

  /* -----------------------------
  LOAD ROUTINE
  ------------------------------*/

  async function loadRoutine() {
    if (!date) return;

    const data = await getRoutine(date);

    setRoutine(data);
  }

  /* -----------------------------
  LOAD ATTENDANCE
  ------------------------------*/

  async function loadAttendance() {
    if (!selectedStudent || !date) return;

    const data = await getAttendance(selectedStudent, date);

    const map = {};

    data.forEach((a) => {
      map[a.subject_id] = a.status;
    });

    setAttendanceMap(map);
  }

  /* -----------------------------
  LOAD SUMMARY
  ------------------------------*/

  async function loadSummary() {
    if (!selectedStudent) return;

    const data = await getOverall(selectedStudent);

    setSummary(data);
  }

  /* -----------------------------
  MARK ATTENDANCE
  ------------------------------*/

  async function handleAttendance(subject_id, status) {
    await markAttendance(selectedStudent, subject_id, date, status);

    loadAttendance();
    loadSummary();
    loadSubjectSummary();
  }

  async function loadSubjectSummary() {
    if (!selectedStudent) return;

    const data = await getSummary(selectedStudent);

    setSubjectSummary(data);
  }
  /* -----------------------------
  INIT
  ------------------------------*/

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setDate(today);

    loadStudents();
    // seedAttendance();
  }, []);

  useEffect(() => {
    loadRoutine();
  }, [date]);

  useEffect(() => {
    loadAttendance();
    loadSummary();
    loadSubjectSummary();
  }, [selectedStudent, date]);

  function isWorkingDay(date) {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6; // skip Sunday & Saturday
  }

  function nextDay() {
    let d = new Date(date);

    do {
      d.setDate(d.getDate() + 1);
    } while (!isWorkingDay(d));

    const newDate = d.toISOString().split("T")[0];

    setDate(newDate);
  }

  function prevDay() {
    let d = new Date(date);

    do {
      d.setDate(d.getDate() - 1);
    } while (!isWorkingDay(d));

    const newDate = d.toISOString().split("T")[0];

    setDate(newDate);
  }

  /* -----------------------------
  UI
  ------------------------------*/

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white text-center p-4 text-xl font-bold">
        Attendance Tracker
      </header>

      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* LEFT PANEL */}

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Attendance</h2>

          <div
            className="w-40 h-40 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-blue-900"
            style={{
              background: `conic-gradient(
                #22c55e ${summary.percent}%,
                #d1d5db ${summary.percent}% 100%
              )`,
            }}
          >
            {summary.percent}%
          </div>

          <div className="text-center mt-4">
            <p>Attended Weight: {summary.attended}</p>
            <p>Total Weight: {summary.total}</p>
          </div>
        </div>

        {/* CENTER PANEL */}

        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Daily Routine</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={prevDay}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                ◀
              </button>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-1"
              />

              <button
                onClick={nextDay}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                ▶
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th>Subject</th>
                <th>Weight</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {routine.map((cls) => {
                const status = attendanceMap[cls.id];

                return (
                  <tr key={cls.id}>
                    <td className="text-center py-2">{cls.name}</td>

                    <td className="text-center">{cls.weight}</td>

                    <td className="text-center py-2">
                      {/* Desktop layout */}
                      <div className="hidden md:flex justify-center gap-2">
                        <button
                          className={`px-3 py-2 rounded text-white bg-green-500 ${
                            status === "attended" ? "opacity-100" : "opacity-30"
                          }`}
                          onClick={() => handleAttendance(cls.id, "attended")}
                        >
                          Attended
                        </button>

                        <button
                          className={`px-3 py-2 rounded text-white bg-red-500 ${
                            status === "missed" ? "opacity-100" : "opacity-30"
                          }`}
                          onClick={() => handleAttendance(cls.id, "missed")}
                        >
                          Missed
                        </button>

                        <button
                          className={`px-3 py-2 rounded text-white bg-gray-600 ${
                            status === "cancelled"
                              ? "opacity-100"
                              : "opacity-30"
                          }`}
                          onClick={() => handleAttendance(cls.id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Mobile layout */}

                      <div className="grid grid-cols-2 gap-2 md:hidden">
                        <button
                          className={`px-3 py-3 rounded text-white bg-green-500 ${
                            status === "attended" ? "opacity-100" : "opacity-30"
                          }`}
                          onClick={() => handleAttendance(cls.id, "attended")}
                        >
                          Attended
                        </button>

                        <button
                          className={`px-3 py-3 rounded text-white bg-red-500 ${
                            status === "missed" ? "opacity-100" : "opacity-30"
                          }`}
                          onClick={() => handleAttendance(cls.id, "missed")}
                        >
                          Missed
                        </button>

                        <button
                          className={`col-span-2 mx-auto px-6 py-3 rounded text-white bg-gray-600 ${
                            status === "cancelled"
                              ? "opacity-100"
                              : "opacity-30"
                          }`}
                          onClick={() => handleAttendance(cls.id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* RIGHT PANEL */}

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Students</h2>

          <div className="flex gap-2 mb-4">
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Student name"
              className="border p-2 flex-1"
            />

            <button
              onClick={handleAddStudent}
              className="bg-blue-700 text-white px-3 py-2 rounded"
            >
              Add
            </button>
          </div>

          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Student</option>

            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* SUBJECT SUMMARY */}

      <div className="m-6 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Subject Summary</h2>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Subject</th>
              <th>Total Classes Weights</th>
              <th>Attended Classes Weights</th>
              <th>Percentage</th>
            </tr>
          </thead>

          <tbody>
            {subjectSummary.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No Data
                </td>
              </tr>
            )}

            {subjectSummary.map((s, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2">{s.subject}</td>
                <td>{s.total}</td>
                <td>{s.attended}</td>
                <td>{s.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
