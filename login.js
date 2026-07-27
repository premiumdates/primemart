import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Login Successful!");

// User کو Login رکھو
localStorage.setItem("currentUser", auth.currentUser.uid);
localStorage.setItem("userEmail", auth.currentUser.email);

window.location.href = "choose-account.html";

  } catch (error) {
    alert(error.message);
  }
});

const provider = new GoogleAuthProvider();

document.getElementById("googleLoginBtn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Welcome " + result.user.displayName);
    window.location.href = "choose-account.html";
  } catch (error) {
    alert(error.message);
  }
});
