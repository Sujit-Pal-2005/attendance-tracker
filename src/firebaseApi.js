import { db } from "./firebase";

import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

/* -------------------------
GET ALL STUDENTS
--------------------------*/

export async function getStudents() {
  const snapshot = await getDocs(collection(db, "students"));

  const students = [];

  snapshot.forEach((d) => {
    students.push({
      id: d.id,
      ...d.data(),
    });
  });

  return students;
}

/* -------------------------
ADD STUDENT
--------------------------*/

export async function addStudent(name) {
  const ref = await addDoc(collection(db, "students"), {
    name,
  });

  return {
    id: ref.id,
    name,
  };
}

/* -------------------------
GET ROUTINE BY DATE
--------------------------*/

export async function getRoutine(date) {
  const weekday = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const q = query(collection(db, "routine"), where("weekday", "==", weekday));

  const routineSnap = await getDocs(q);

  const result = [];

  for (const r of routineSnap.docs) {
    const subjectId = r.data().subject_id;

    const subjectDoc = await getDoc(doc(db, "subjects", subjectId));

    if (subjectDoc.exists()) {
      const sub = subjectDoc.data();

      result.push({
        id: subjectId,
        name: sub.name,
        weight: sub.weight,
      });
    }
  }

  return result;
}

/* -------------------------
GET ATTENDANCE OF STUDENT
--------------------------*/

export async function getAttendance(studentId, date) {
  const q = query(
    collection(db, "attendance"),
    where("student_id", "==", studentId),
    where("date", "==", date),
  );

  const snapshot = await getDocs(q);

  const data = [];

  snapshot.forEach((d) => {
    data.push({
      subject_id: d.data().subject_id,
      status: d.data().status,
    });
  });

  return data;
}

/* -------------------------
MARK / UPDATE ATTENDANCE
--------------------------*/

export async function markAttendance(student_id, subject_id, date, status) {
  const id = `${student_id}_${subject_id}_${date}`;

  await setDoc(doc(db, "attendance", id), {
    student_id,
    subject_id,
    date,
    status,
  });

  return { message: "attendance saved" };
}

/* -------------------------
SUMMARY
--------------------------*/

export async function getSummary(studentId) {
  const q = query(
    collection(db, "attendance"),
    where("student_id", "==", studentId),
  );

  const snapshot = await getDocs(q);

  const map = {};

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (data.status === "cancelled") continue;

    const subjectId = data.subject_id;

    const subjectDoc = await getDoc(doc(db, "subjects", subjectId));

    if (!subjectDoc.exists()) continue;

    const sub = subjectDoc.data();

    if (!map[subjectId]) {
      map[subjectId] = {
        subject: sub.name,
        total: 0,
        attended: 0,
      };
    }

    map[subjectId].total += sub.weight;

    if (data.status === "attended") {
      map[subjectId].attended += sub.weight;
    }
  }

  const result = Object.values(map).map((s) => ({
    subject: s.subject,
    total: s.total,
    attended: s.attended,
    percent: s.total ? Math.round((s.attended / s.total) * 100) : 0,
  }));

  return result;
}

/* -------------------------
OVERALL
--------------------------*/

export async function getOverall(studentId) {
  const q = query(
    collection(db, "attendance"),
    where("student_id", "==", studentId),
  );

  const snapshot = await getDocs(q);

  let attended = 0;
  let total = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (data.status === "cancelled") continue;

    const subjectDoc = await getDoc(doc(db, "subjects", data.subject_id));

    if (!subjectDoc.exists()) continue;

    const weight = subjectDoc.data().weight;

    total += weight;

    if (data.status === "attended") {
      attended += weight;
    }
  }

  const percent = total ? Math.round((attended / total) * 100) : 0;

  return {
    attended,
    total,
    percent,
  };
}
