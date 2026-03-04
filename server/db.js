const sqlite3 = require("sqlite3").verbose();

/* connect database */

const db = new sqlite3.Database("./database/attendance.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

/* create tables */

db.serialize(() => {
  /* STUDENTS */

  db.run(`
  CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
  `);

  /* SUBJECTS */

  db.run(`
  CREATE TABLE IF NOT EXISTS subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    weight INTEGER DEFAULT 1
  )
  `);

  /* ROUTINE */

  db.run(`
  CREATE TABLE IF NOT EXISTS routine(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weekday TEXT NOT NULL,
    subject_id INTEGER,
    UNIQUE(weekday, subject_id),
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
  )
  `);

  /* ATTENDANCE */

  db.run(`
  CREATE TABLE IF NOT EXISTS attendance(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    subject_id INTEGER,
    date TEXT,
    status TEXT,
    UNIQUE(student_id, subject_id, date),
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
  )
  `);

  /* ------------------------
     SEED SUBJECTS
  ------------------------*/

  const subjects = [
    { name: "DS", weight: 2 },
    { name: "IT", weight: 2 },
    { name: "CG", weight: 4 },
    { name: "FLAT", weight: 2 },
    { name: "IED", weight: 2 },
    { name: "CG Lab", weight: 3 },
    { name: "IT Lab", weight: 3 },
    { name: "Mini Project", weight: 3 },
  ];

  subjects.forEach((s) => {
    db.run(`INSERT OR IGNORE INTO subjects(name,weight) VALUES(?,?)`, [
      s.name,
      s.weight,
    ]);
  });

  /* ------------------------
     SEED ROUTINE
  ------------------------*/

  const routine = {
    Monday: ["DS", "IT", "CG"],
    Tuesday: ["IED", "FLAT", "Mini Project"],
    Wednesday: ["DS", "CG Lab"],
    Thursday: ["IED", "IT Lab"],
    Friday: ["IT", "FLAT", "Mini Project"],
  };

  Object.keys(routine).forEach((day) => {
    routine[day].forEach((subject) => {
      db.get(
        `SELECT id FROM subjects WHERE name=?`,
        [subject],

        (err, row) => {
          if (!row) return;

          db.run(
            `INSERT OR IGNORE INTO routine(weekday,subject_id)
             VALUES(?,?)`,
            [day, row.id],
          );
        },
      );
    });
  });
});

module.exports = db;
