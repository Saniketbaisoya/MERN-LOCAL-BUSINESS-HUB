// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "local-business-hub-cc32d.firebaseapp.com",
  projectId: "local-business-hub-cc32d",
  storageBucket: "local-business-hub-cc32d.firebasestorage.app",
  messagingSenderId: "352290294885",
  appId: "1:352290294885:web:4f6711e3e695f1b37e4a8c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);