import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Account Created Successfully!");
    window.location.href = "login.html";

  } catch (error) {
    alert(error.message);
  }

});

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

document.getElementById("googleSignupBtn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Welcome " + result.user.displayName);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});
