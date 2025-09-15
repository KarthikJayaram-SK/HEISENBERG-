// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdr1_hXWfM1dS5pYEzb-gEyFJoQAjYVvI",
  authDomain: "ncc-sairam-website.firebaseapp.com",
  projectId: "ncc-sairam-website",
  storageBucket: "ncc-sairam-website.appspot.com",
  messagingSenderId: "907547319648",
  appId: "1:907547319648:web:5298912ef670dda9431205"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);