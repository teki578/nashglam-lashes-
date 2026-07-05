import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOcnrPiLQgurQQY5wAy7NNQYruGx2lAbc",
  authDomain: "nashglamlashesadmin.firebaseapp.com",
  projectId: "nashglamlashesadmin",
  storageBucket: "nashglamlashesadmin.firebasestorage.app",
  messagingSenderId: "164987345183",
  appId: "1:164987345183:web:773f5325078880927e382a",
  measurementId: "G-WDM6Y6TV9H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
