// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "aurora-1bee0.firebaseapp.com",
  projectId: "aurora-1bee0",
  storageBucket: "aurora-1bee0.appspot.com",
  messagingSenderId: "626359446071",
  appId: "1:626359446071:web:e1f20c58a099a6a41d2db2",
  measurementId: "G-LSR2ZX8BV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)