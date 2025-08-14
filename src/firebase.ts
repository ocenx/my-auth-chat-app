// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com", // Needed for Realtime DB
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // <-- THIS fixes your error

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Realtime Database
export const rtdb = getDatabase(app);
