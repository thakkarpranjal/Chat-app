// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDfox1O-WZYIA4frOrx3eh6HEHr2A9CU8w",
  authDomain: "chatapp-c13c1.firebaseapp.com",
  projectId: "chatapp-c13c1",
  storageBucket: "chatapp-c13c1.appspot.com",
  messagingSenderId: "251005231988",
  appId: "1:251005231988:web:fbf52ec04eaa9380cd0221",
  measurementId: "G-TXE4TX6ZYQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();