import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWckPr5VTj_Fdj1AboqsUFuD-AJgtKEnw",
  authDomain: "mc-cas-leads.firebaseapp.com",
  projectId: "mc-cas-leads",
  storageBucket: "mc-cas-leads.firebasestorage.app",
  messagingSenderId: "621601943355",
  appId: "1:621601943355:web:4c73a4e5c8324d17c37e2a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);