import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace these with your actual Firebase project credentials
// Go to Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyAhBG40ddWTxYKAUji6wJ7jFbS3i3Aqe64",
  authDomain: "climateguard-kenya.firebaseapp.com",
  projectId: "climateguard-kenya",
  storageBucket: "climateguard-kenya.firebasestorage.app",
  messagingSenderId: "832494301729",
  appId: "1:832494301729:web:4db59e4db83f4fb92e6960",
  measurementId: "G-8S084C64ED"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
