import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0VPW4UVqMxYZE4kBoSlJuQqeQDezNt_8",
  authDomain: "furniture-78510.firebaseapp.com",
  projectId: "furniture-78510",
  storageBucket: "furniture-78510.firebasestorage.app",
  messagingSenderId: "547459798265",
  appId: "1:547459798265:web:b737216529ab963f447e28",
  measurementId: "G-F980THVG90"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
