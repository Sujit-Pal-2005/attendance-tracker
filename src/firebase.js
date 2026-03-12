import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhb29qO--YLR_r5-RYsFg_QK2yvrIqoUw",
  authDomain: "attendance-tracker-c29da.firebaseapp.com",
  projectId: "attendance-tracker-c29da",
  storageBucket: "attendance-tracker-c29da.firebasestorage.app",
  messagingSenderId: "149562031077",
  appId: "1:149562031077:web:f3a46ab40d117bfd3bcd0c",
  measurementId: "G-EQ0D6JVG21",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Firestore instance
export const db = getFirestore(app);

// Optional analytics (only works in browser)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
