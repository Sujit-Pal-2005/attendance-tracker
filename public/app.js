/* -----------------------------
API BASE
------------------------------*/

const API = "http://localhost:3000";

/* -----------------------------
GLOBAL STATE
------------------------------*/

let students = [];
let selectedStudent = null;
let selectedDate = null;

/* -----------------------------
DOM ELEMENTS
------------------------------*/

const studentInput = document.getElementById("studentName");
const addStudentBtn = document.getElementById("addStudentBtn");
const studentDropdown = document.getElementById("studentDropdown");

const datePicker = document.getElementById("datePicker");
const routineBody = document.getElementById("routineBody");

const attendancePercent = document.getElementById("attendancePercent");
const attendedWeight = document.getElementById("attendedWeight");
const totalWeight = document.getElementById("totalWeight");

const summaryBody = document.getElementById("summaryBody");

/* -----------------------------
LOAD STUDENTS
------------------------------*/

async function loadStudents() {
  const res = await fetch(`${API}/students`);
  students = await res.json();

  studentDropdown.innerHTML = `<option value="">Select Student</option>`;

  students.forEach((s) => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.name;

    studentDropdown.appendChild(option);
  });
  if (students.length > 0) {
    selectedStudent = students[0].id;
    studentDropdown.value = selectedStudent;

    loadRoutine();
    loadSummary();
    loadSubjectSummary();
  }
}

/* -----------------------------
ADD STUDENT
------------------------------*/

addStudentBtn.onclick = async () => {
  const name = studentInput.value.trim();
  if (!name) return;

  await fetch(`${API}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ name }),
  });

  studentInput.value = "";

  loadStudents();
};

/* -----------------------------
SELECT STUDENT
------------------------------*/

studentDropdown.onchange = () => {
  selectedStudent = studentDropdown.value;

  if (!selectedStudent) return;

  loadRoutine();
  loadSummary();
  loadSubjectSummary();
};

/* -----------------------------
DATE CHANGE
------------------------------*/

datePicker.onchange = () => {
  selectedDate = datePicker.value;

  if (!selectedStudent) return;

  loadRoutine();
};

/* -----------------------------
LOAD ROUTINE
------------------------------*/

async function loadRoutine() {
  routineBody.innerHTML = "";

  if (!selectedDate || !selectedStudent) return;

  const routineRes = await fetch(`${API}/routine/${selectedDate}`);

  const classes = await routineRes.json();

  const attendanceRes = await fetch(
    `${API}/attendance/${selectedStudent}/${selectedDate}`,
  );

  const attendance = await attendanceRes.json();

  const statusMap = {};

  attendance.forEach((a) => {
    statusMap[a.subject_id] = a.status;
  });

  if (classes.length === 0) {
    routineBody.innerHTML = `<tr><td colspan="3">No Classes</td></tr>`;

    return;
  }

  classes.forEach((cls) => {
    const row = document.createElement("tr");

    const subjectCell = document.createElement("td");
    subjectCell.textContent = cls.name;

    const weightCell = document.createElement("td");
    weightCell.textContent = cls.weight;

    const statusCell = document.createElement("td");

    const attendBtn = document.createElement("button");
    attendBtn.textContent = "Attended";
    attendBtn.className = "attended";
    attendBtn.type = "button";

    const missBtn = document.createElement("button");
    missBtn.textContent = "Missed";
    missBtn.className = "missed";
    missBtn.type = "button";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancelled";
    cancelBtn.type = "button";

    const prevStatus = statusMap[cls.id];

    highlightStatus(prevStatus, attendBtn, missBtn, cancelBtn);

    attendBtn.onclick = () =>
      markAttendance(cls.id, "attended", attendBtn, missBtn, cancelBtn);

    missBtn.onclick = () =>
      markAttendance(cls.id, "missed", attendBtn, missBtn, cancelBtn);

    cancelBtn.onclick = () =>
      markAttendance(cls.id, "cancelled", attendBtn, missBtn, cancelBtn);

    statusCell.appendChild(attendBtn);
    statusCell.appendChild(missBtn);
    statusCell.appendChild(cancelBtn);

    row.appendChild(subjectCell);
    row.appendChild(weightCell);
    row.appendChild(statusCell);

    routineBody.appendChild(row);
  });
}

/* -----------------------------
MARK ATTENDANCE
------------------------------*/

async function markAttendance(subject_id, status, aBtn, mBtn, cBtn) {
  await fetch(`${API}/attendance`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      student_id: selectedStudent,
      subject_id,
      date: selectedDate,
      status,
    }),
  });

  highlightStatus(status, aBtn, mBtn, cBtn);

  loadSummary();
  loadSubjectSummary();
}

/* -----------------------------
BUTTON HIGHLIGHT
------------------------------*/

function highlightStatus(status, a, m, c) {
  [a, m, c].forEach((btn) => (btn.style.opacity = "0.4"));

  if (status === "attended") a.style.opacity = "1";
  if (status === "missed") m.style.opacity = "1";
  if (status === "cancelled") c.style.opacity = "1";
}

/* -----------------------------
LOAD OVERALL SUMMARY
------------------------------*/

async function loadSummary() {
  if (!selectedStudent) return;

  const res = await fetch(`${API}/overall/${selectedStudent}`);

  const data = await res.json();

  attendedWeight.textContent = data.attended;
  totalWeight.textContent = data.total;
  attendancePercent.textContent = data.percent + "%";

  updateCircle(data.percent);
}

/* -----------------------------
LOAD SUBJECT SUMMARY
------------------------------*/

async function loadSubjectSummary() {
  if (!selectedStudent) return;

  const res = await fetch(`${API}/summary/${selectedStudent}`);

  const data = await res.json();

  summaryBody.innerHTML = "";

  if (data.length === 0) {
    summaryBody.innerHTML = `<tr><td colspan="4">No Data</td></tr>`;

    return;
  }

  data.forEach((s) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${s.subject}</td>
      <td>${s.total}</td>
      <td>${s.attended}</td>
      <td>${s.percent}%</td>
    `;

    summaryBody.appendChild(row);
  });
}

/* -----------------------------
UPDATE CIRCLE
------------------------------*/

function updateCircle(percent) {
  const circle = document.querySelector(".attendance-circle");

  circle.style.background = `conic-gradient(#44bd32 ${percent}%,
     #dcdde1 ${percent}% 100%)`;
}

function setToday() {
  const today = new Date().toISOString().split("T")[0];
  datePicker.value = today;
  selectedDate = today;
}

function isWorkingDay(date) {
  const day = new Date(date).getDay();
  return day !== 0 && day !== 6; // Sunday & Saturday skip
}

document.getElementById("nextDay").onclick = () => {
  let d = new Date(selectedDate);

  do {
    d.setDate(d.getDate() + 1);
  } while (!isWorkingDay(d));

  const newDate = d.toISOString().split("T")[0];

  datePicker.value = newDate;
  selectedDate = newDate;

  loadRoutine();
};

document.getElementById("prevDay").onclick = () => {
  let d = new Date(selectedDate);

  do {
    d.setDate(d.getDate() - 1);
  } while (!isWorkingDay(d));

  const newDate = d.toISOString().split("T")[0];

  datePicker.value = newDate;
  selectedDate = newDate;

  loadRoutine();
};
/* -----------------------------
INIT
------------------------------*/

loadStudents();
updateCircle(0);
setToday();
