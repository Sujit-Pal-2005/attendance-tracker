# 📘 Attendance Tracker

A simple **full-stack attendance tracking system** built using
**Node.js, Express, SQLite, and Vanilla JavaScript**. It allows users to
manage students, track daily attendance, and analyze attendance
statistics based on **subject weights**.

---

## 🚀 Features

- Add and manage students
- Automatic daily routine based on weekday
- Mark attendance (Attended / Missed / Cancelled)
- Attendance calculated **based on subject weight**
- Overall attendance percentage visualization
- Subject-wise attendance summary
- Working day navigation (previous / next class day)
- Automatic selection of today's date and first student
- REST API backend with SQLite database

---

## 🖥️ Tech Stack

### Backend

- Node.js
- Express.js
- SQLite

### Frontend

- HTML
- CSS
- Vanilla JavaScript

---

## 📂 Project Structure

    attendance-tracker
    │
    ├ server.js              # Express server
    ├ db.js                  # SQLite database setup
    ├ package.json
    │
    ├ database
    │   └ attendance.db      # SQLite database
    │
    └ public
        ├ index.html         # Frontend UI
        ├ app.js             # Client-side logic
        └ style.css          # Styling

---

## ⚙️ Installation

Clone the repository:

    git clone https://github.com/Sujit-Pal-2005/attendance-tracker.git
    cd attendance-tracker

Install dependencies:

    npm install

Run the server:

    node server.js

---

## 🌐 Open in Browser

    http://localhost:3000

---

## 📊 How Attendance is Calculated

Each subject has a **weight value**.

Example:

Subject Weight

---

DS 2
CG 4
IT 2

Attendance percentage is calculated using **weighted values**:

    Attendance % = (Attended Weight / Total Weight) × 100

Cancelled classes are **excluded** from the total.

---

## 🔗 API Endpoints

### Students

    GET /students
    POST /students

### Routine

    GET /routine/:date

### Attendance

    POST /attendance
    GET /attendance/:student/:date

### Analytics

    GET /summary/:student
    GET /overall/:student

<!-- ------------------------------------------------------------------------

## 🔮 Future Improvements

-   Authentication system
-   Attendance analytics graphs
-   75% attendance warning system
-   Mobile responsive UI
-   Export attendance reports -->

---

## 👨‍💻 Author

**Sujit Pal**\
Computer Science & Engineering Student

GitHub:\
https://github.com/Sujit-Pal-2005

---

⭐ If you like this project, consider giving it a star on GitHub!
