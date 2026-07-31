import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyAWr8ZQeDz1-nN7Fi570juA0gO2dFq9F30",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "chatbuddy-5b025.firebaseapp.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || "chatbuddy-5b025",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "chatbuddy-5b025.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "200924540858",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:200924540858:web:eb19705ecef71b0d95b783",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;

