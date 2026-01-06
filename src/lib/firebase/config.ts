import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQC9CdD3bIhA0zMUwuem1o-xqD5-o5RBA",
  authDomain: "digital-dairy-bd00a.firebaseapp.com",
  projectId: "digital-dairy-bd00a",
  storageBucket: "digital-dairy-bd00a.firebasestorage.app",
  messagingSenderId: "710216812308",
  appId: "1:710216812308:web:fc8ebc09c56f44a7e7a401"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
