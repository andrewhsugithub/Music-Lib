// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCESq9U3jAoMu0UnYjHcvYR-YfWVA0-cSU",
  authDomain: "library-4b3df.firebaseapp.com",
  projectId: "library-4b3df",
  storageBucket: "library-4b3df.appspot.com",
  messagingSenderId: "861908295825",
  appId: "1:861908295825:web:845c2cb2036d9b74a99f30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
