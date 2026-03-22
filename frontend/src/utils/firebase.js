import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCipEDnnS-lz3YhMKDXSFWf6zKWGRnPeBE",
  authDomain: "ai-based-resume-analyzer-7d91d.firebaseapp.com",
  projectId: "ai-based-resume-analyzer-7d91d",
  storageBucket: "ai-based-resume-analyzer-7d91d.firebasestorage.app",
  messagingSenderId: "826541801736",
  appId: "1:826541801736:web:71fd83212f1690ab68acbd",
  measurementId: "G-57LV0N4SB6",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
