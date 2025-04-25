// Import the functions you need from the SDKs you need
import { initializeApp , getApp,getApps } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAjhwdiNL8glKrThDgtVIF9iNCBPO-7Dok",
  authDomain: "prepwise-edc6d.firebaseapp.com",
  projectId: "prepwise-edc6d",
  storageBucket: "prepwise-edc6d.firebasestorage.app",
  messagingSenderId: "176898047585",
  appId: "1:176898047585:web:3d30b444e1eac3eb767420",
  measurementId: "G-7MRSMNMZRC"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);