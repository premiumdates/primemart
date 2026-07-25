import { auth } from "./firebase.js";
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
    window.location.href = "index.html";

  } catch (error) {
    alert(error.message);
  }
});
