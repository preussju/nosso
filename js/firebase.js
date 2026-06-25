import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBL8jrwl-lckHX6nvPuk60_3hxcRnj84wQ",
  authDomain: "capsules-a3cc4.firebaseapp.com",
  projectId: "capsules-a3cc4",
  storageBucket: "capsules-a3cc4.firebasestorage.app",
  messagingSenderId: "1098731066589",
  appId: "1:1098731066589:web:edc860f3ad18c00afe3734"
};

const app = initializeApp(firebaseConfig);

// 🔥 serviços que você realmente vai usar
export const db = getFirestore(app);
export const auth = getAuth(app);

