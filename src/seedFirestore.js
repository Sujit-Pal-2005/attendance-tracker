import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export async function seedAttendance() {
  /* ---------- 2026-02-10 ---------- */

  await setDoc(doc(db, "attendance", "1_4_2026-02-10"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-02-10",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_5_2026-02-10"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-02-10",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-02-10"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-02-10",
    status: "cancelled",
  });

  /* ---------- 2026-02-11 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-02-11"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-02-11",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_6_2026-02-11"), {
    student_id: "1",
    subject_id: "6",
    date: "2026-02-11",
    status: "attended",
  });

  /* ---------- 2026-02-12 ---------- */

  await setDoc(doc(db, "attendance", "1_5_2026-02-12"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-02-12",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_7_2026-02-12"), {
    student_id: "1",
    subject_id: "7",
    date: "2026-02-12",
    status: "cancelled",
  });

  /* ---------- 2026-02-13 ---------- */

  await setDoc(doc(db, "attendance", "1_2_2026-02-13"), {
    student_id: "1",
    subject_id: "2",
    date: "2026-02-13",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_4_2026-02-13"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-02-13",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-02-13"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-02-13",
    status: "missed",
  });

  /* ---------- 2026-02-16 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-02-16"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-02-16",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_2_2026-02-16"), {
    student_id: "1",
    subject_id: "2",
    date: "2026-02-16",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_3_2026-02-16"), {
    student_id: "1",
    subject_id: "3",
    date: "2026-02-16",
    status: "missed",
  });

  /* ---------- 2026-02-17 ---------- */

  await setDoc(doc(db, "attendance", "1_4_2026-02-17"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-02-17",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_5_2026-02-17"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-02-17",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-02-17"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-02-17",
    status: "cancelled",
  });

  /* ---------- 2026-02-18 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-02-18"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-02-18",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_6_2026-02-18"), {
    student_id: "1",
    subject_id: "6",
    date: "2026-02-18",
    status: "missed",
  });

  /* ---------- 2026-02-19 ---------- */

  await setDoc(doc(db, "attendance", "1_5_2026-02-19"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-02-19",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_7_2026-02-19"), {
    student_id: "1",
    subject_id: "7",
    date: "2026-02-19",
    status: "cancelled",
  });

  /* ---------- 2026-02-20 ---------- */

  await setDoc(doc(db, "attendance", "1_2_2026-02-20"), {
    student_id: "1",
    subject_id: "2",
    date: "2026-02-20",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_4_2026-02-20"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-02-20",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-02-20"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-02-20",
    status: "missed",
  });

  /* ---------- 2026-02-23 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-02-23"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-02-23",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_2_2026-02-23"), {
    student_id: "1",
    subject_id: "2",
    date: "2026-02-23",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_3_2026-02-23"), {
    student_id: "1",
    subject_id: "3",
    date: "2026-02-23",
    status: "attended",
  });

  /* ---------- 2026-02-24 ---------- */

  await setDoc(doc(db, "attendance", "1_4_2026-02-24"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-02-24",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_5_2026-02-24"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-02-24",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-02-24"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-02-24",
    status: "cancelled",
  });

  /* ---------- 2026-02-25 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-02-25"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-02-25",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_6_2026-02-25"), {
    student_id: "1",
    subject_id: "6",
    date: "2026-02-25",
    status: "attended",
  });

  /* ---------- 2026-02-26 ---------- */

  await setDoc(doc(db, "attendance", "1_5_2026-02-26"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-02-26",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_7_2026-02-26"), {
    student_id: "1",
    subject_id: "7",
    date: "2026-02-26",
    status: "cancelled",
  });

  /* ---------- 2026-02-27 ---------- */

  await setDoc(doc(db, "attendance", "1_2_2026-02-27"), {
    student_id: "1",
    subject_id: "2",
    date: "2026-02-27",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_4_2026-02-27"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-02-27",
    status: "missed",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-02-27"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-02-27",
    status: "cancelled",
  });

  /* ---------- 2026-03-02 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-03-02"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-03-02",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_2_2026-03-02"), {
    student_id: "1",
    subject_id: "2",
    date: "2026-03-02",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_3_2026-03-02"), {
    student_id: "1",
    subject_id: "3",
    date: "2026-03-02",
    status: "cancelled",
  });

  /* ---------- 2026-03-03 ---------- */

  await setDoc(doc(db, "attendance", "1_4_2026-03-03"), {
    student_id: "1",
    subject_id: "4",
    date: "2026-03-03",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_5_2026-03-03"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-03-03",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_8_2026-03-03"), {
    student_id: "1",
    subject_id: "8",
    date: "2026-03-03",
    status: "cancelled",
  });

  /* ---------- 2026-03-04 ---------- */

  await setDoc(doc(db, "attendance", "1_1_2026-03-04"), {
    student_id: "1",
    subject_id: "1",
    date: "2026-03-04",
    status: "cancelled",
  });
  await setDoc(doc(db, "attendance", "1_6_2026-03-04"), {
    student_id: "1",
    subject_id: "6",
    date: "2026-03-04",
    status: "cancelled",
  });

  /* ---------- 2026-03-05 ---------- */

  await setDoc(doc(db, "attendance", "1_5_2026-03-05"), {
    student_id: "1",
    subject_id: "5",
    date: "2026-03-05",
    status: "attended",
  });
  await setDoc(doc(db, "attendance", "1_7_2026-03-05"), {
    student_id: "1",
    subject_id: "7",
    date: "2026-03-05",
    status: "attended",
  });

  console.log("Attendance seeded");
}
