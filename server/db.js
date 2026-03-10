const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* CREATE TABLES */

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects(
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        weight INTEGER DEFAULT 1
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS routine(
        id SERIAL PRIMARY KEY,
        weekday TEXT NOT NULL,
        subject_id INTEGER,
        UNIQUE(weekday, subject_id),
        FOREIGN KEY(subject_id) REFERENCES subjects(id)
      )
    `);

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
  } catch (err) {
    console.error("DB Init Error:", err);
  }
}

initDB();

module.exports = pool;
