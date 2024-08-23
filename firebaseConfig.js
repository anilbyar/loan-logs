// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdN44cXI3G6r78d9bag-UgCZy7DWG0nVM",
  authDomain: "khateybook-89734.firebaseapp.com",
  projectId: "khateybook-89734",
  storageBucket: "khateybook-89734.appspot.com",
  messagingSenderId: "623836811133",
  appId: "1:623836811133:web:c61bce4f31423126584614",
  measurementId: "G-6PZ04ZBEVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);