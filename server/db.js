const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to Neon PostgreSQL");
  }
});

/* CREATE TABLES */

async function initDB() {
  try {
    /* STUDENTS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    /* SUBJECTS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects(
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        weight INTEGER DEFAULT 1
      )
    `);

    /* ROUTINE */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS routine(
        id SERIAL PRIMARY KEY,
        weekday TEXT NOT NULL,
        subject_id INTEGER,
        UNIQUE(weekday, subject_id),
        FOREIGN KEY(subject_id) REFERENCES subjects(id)
      )
    `);

    /* ATTENDANCE */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance(
        id SERIAL PRIMARY KEY,
        student_id INTEGER,
        subject_id INTEGER,
        date TEXT,
        status TEXT,
        UNIQUE(student_id, subject_id, date),
        FOREIGN KEY(student_id) REFERENCES students(id),
        FOREIGN KEY(subject_id) REFERENCES subjects(id)
      )
    `);

    // console.log("Tables created successfully");

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

    for (const s of subjects) {
      await pool.query(
        `INSERT INTO subjects(name,weight)
         VALUES($1,$2)
         ON CONFLICT(name) DO NOTHING`,
        [s.name, s.weight],
      );
    }

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

    for (const day of Object.keys(routine)) {
      for (const subject of routine[day]) {
        const res = await pool.query(`SELECT id FROM subjects WHERE name=$1`, [
          subject,
        ]);

        if (res.rows.length === 0) continue;

        const subjectId = res.rows[0].id;

        await pool.query(
          `INSERT INTO routine(weekday,subject_id)
           VALUES($1,$2)
           ON CONFLICT DO NOTHING`,
          [day, subjectId],
        );
      }
    }

    // console.log("Seed data inserted");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
}

initDB();

module.exports = pool;
