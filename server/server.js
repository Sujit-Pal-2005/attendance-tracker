const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* -------------------------
GET ALL STUDENTS
--------------------------*/

app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
});

/* -------------------------
ADD STUDENT
--------------------------*/

app.post("/students", (req, res) => {
  const { name } = req.body;

  db.run("INSERT INTO students(name) VALUES(?)", [name], function (err) {
    if (err) return res.status(500).json(err);

    res.json({ id: this.lastID, name });
  });
});

/* -------------------------
GET ROUTINE BY DATE
--------------------------*/

app.get("/routine/:date", (req, res) => {
  const date = req.params.date;

  const weekday = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  db.all(
    `SELECT subjects.id, subjects.name, subjects.weight
FROM routine
JOIN subjects
ON routine.subject_id = subjects.id
WHERE routine.weekday = ?`,

    [weekday],

    (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json(rows);
    },
  );
});

/* -------------------------
GET ATTENDANCE OF STUDENT
--------------------------*/

app.get("/attendance/:student/:date", (req, res) => {
  const { student, date } = req.params;

  db.all(
    `SELECT subject_id,status
FROM attendance
WHERE student_id=? AND date=?`,

    [student, date],

    (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json(rows);
    },
  );
});

/* -------------------------
MARK / UPDATE ATTENDANCE
--------------------------*/

app.post("/attendance", (req, res) => {
  const { student_id, subject_id, date, status } = req.body;

  // console.log("Incoming attendance request:");
  // console.log({ student_id, subject_id, date, status });

  db.run(
    `INSERT INTO attendance
    (student_id,subject_id,date,status)
    VALUES(?,?,?,?)
    ON CONFLICT(student_id,subject_id,date)
    DO UPDATE SET status=excluded.status`,

    [student_id, subject_id, date, status],

    function (err) {
      if (err) {
        console.error("SQLite Error while saving attendance:");
        console.error(err.message);
        console.error(err);

        return res.status(500).json({
          error: err.message,
        });
      }

      // console.log("Attendance saved successfully");

      res.json({
        message: "attendance saved",
        changes: this.changes,
      });
    },
  );
});

// Get summary
app.get("/summary/:student", (req, res) => {
  const student = req.params.student;

  db.all(
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
     WHERE attendance.student_id = ?
     AND attendance.status != 'cancelled'
     GROUP BY subjects.id`,

    [student],

    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const result = rows.map((r) => ({
        subject: r.subject,
        total: r.total || 0,
        attended: r.attended || 0,
        percent: r.total ? Math.round((r.attended / r.total) * 100) : 0,
      }));
      // console.log(result);
      res.json(result);
    },
  );
});

app.get("/overall/:student", (req, res) => {
  const student = req.params.student;

  db.get(
    `SELECT
     SUM(CASE WHEN attendance.status='attended' THEN subjects.weight ELSE 0 END) AS attended,
     SUM(subjects.weight) AS total
     FROM attendance
     JOIN subjects
     ON attendance.subject_id = subjects.id
     WHERE attendance.student_id=? 
     AND attendance.status!='cancelled'`,

    [student],

    (err, row) => {
      if (err) return res.status(500).json(err);

      const attended = row?.attended || 0;
      const total = row?.total || 0;

      const percent = total ? Math.round((attended / total) * 100) : 0;
      // console.log(row);

      res.json({
        attended,
        total,
        percent,
      });
    },
  );
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
