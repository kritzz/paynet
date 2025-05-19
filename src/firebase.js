import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWoTVlPkeKT59tEjJuXc0Yjhc0cuOYZk8",
  authDomain: "paynet-a6a01.firebaseapp.com",
  projectId: "paynet-a6a01",
  storageBucket: "paynet-a6a01.firebasestorage.app",
  messagingSenderId: "68115035300",
  appId: "1:68115035300:web:346f9748d381e148ec2231",
  measurementId: "G-R1G6ELT3FN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth instance
export const auth = getAuth(app);
export default app;
