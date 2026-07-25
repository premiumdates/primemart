import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyEX9kj1lbhWJNUkJC4lraKAZFNj3PuWE",
  authDomain: "premium-dates.firebaseapp.com",
  projectId: "premium-dates",
  storageBucket: "premium-dates.firebasestorage.app",
  messagingSenderId: "696354648755",
  appId: "1:696354648755:web:342c23dadffd2cf444f6c6",
  measurementId: "G-6M7NN6BP8G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
