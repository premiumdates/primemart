import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXMl5u5PekmZsSB7tYFyibitVJsnJEF10",
  authDomain: "primemart-6a101.firebaseapp.com",
  databaseURL: "https://primemart-6a101-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "primemart-6a101",
  storageBucket: "primemart-6a101.firebasestorage.app",
  messagingSenderId: "675471841308",
  appId: "1:675471841308:web:0a3a861890a820072ce7d9",
  measurementId: "G-HPGWP68Z9L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export { auth };
