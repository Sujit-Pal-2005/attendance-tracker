const express = require("express");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");

const db = require("../server/db.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

/* -------------------------
GET ALL STUDENTS
--------------------------*/

app.get("/students", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* -------------------------
ADD STUDENT
--------------------------*/

app.post("/students", async (req, res) => {
  const { name } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO students(name) VALUES($1) RETURNING id",
      [name],
    );

    res.json({
      id: result.rows[0].id,
      name,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* -------------------------
GET ROUTINE BY DATE
--------------------------*/

app.get("/routine/:date", async (req, res) => {
  const date = req.params.date;

  const weekday = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  try {
    const result = await db.query(
      `SELECT subjects.id, subjects.name, subjects.weight
       FROM routine
       JOIN subjects
       ON routine.subject_id = subjects.id
       WHERE routine.weekday = $1`,
      [weekday],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* -------------------------
GET ATTENDANCE OF STUDENT
--------------------------*/

app.get("/attendance/:student/:date", async (req, res) => {
  const { student, date } = req.params;

  try {
    const result = await db.query(
      `SELECT subject_id,status
       FROM attendance
       WHERE student_id=$1 AND date=$2`,
      [student, date],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* -------------------------
MARK / UPDATE ATTENDANCE
--------------------------*/

app.post("/attendance", async (req, res) => {
  const { student_id, subject_id, date, status } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO attendance
       (student_id,subject_id,date,status)
       VALUES($1,$2,$3,$4)
       ON CONFLICT(student_id,subject_id,date)
       DO UPDATE SET status=EXCLUDED.status`,
      [student_id, subject_id, date, status],
    );

    res.json({
      message: "attendance saved",
      changes: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

/* -------------------------
SUMMARY
--------------------------*/

app.get("/summary/:student", async (req, res) => {
  const student = req.params.student;

  try {
    const result = await db.query(
      `SELECT 
        subjects.name AS subject,
        SUM(subjects.weight) AS total,
        SUM(
          CASE 
            WHEN attendance.status='attended' 
            THEN subjects.weight 
            ELSE 0 
          END
        ) AS attended
       FROM attendance
       JOIN subjects
       ON attendance.subject_id = subjects.id
       WHERE attendance.student_id = $1
       AND attendance.status != 'cancelled'
       GROUP BY subjects.id`,
      [student],
    );

    const rows = result.rows;

    const data = rows.map((r) => ({
      subject: r.subject,
      total: Number(r.total) || 0,
      attended: Number(r.attended) || 0,
      percent: r.total ? Math.round((r.attended / r.total) * 100) : 0,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* -------------------------
OVERALL
--------------------------*/

app.get("/overall/:student", async (req, res) => {
  const student = req.params.student;

  try {
    const result = await db.query(
      `SELECT
       SUM(CASE WHEN attendance.status='attended' THEN subjects.weight ELSE 0 END) AS attended,
       SUM(subjects.weight) AS total
       FROM attendance
       JOIN subjects
       ON attendance.subject_id = subjects.id
       WHERE attendance.student_id=$1 
       AND attendance.status!='cancelled'`,
      [student],
    );

    const row = result.rows[0];

    const attended = Number(row?.attended) || 0;
    const total = Number(row?.total) || 0;

    const percent = total ? Math.round((attended / total) * 100) : 0;

    res.json({
      attended,
      total,
      percent,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* -------------------------
STATIC
--------------------------*/

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/health", (req, res) => {
  res.send("OK");
});

/* -------------------------
EXPORT FOR VERCEL
--------------------------*/

module.exports = app;
