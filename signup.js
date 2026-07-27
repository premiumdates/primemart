import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const signupBtn = document.getElementById("signupBtn");
const googleSignupBtn = document.getElementById("googleSignupBtn");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

// Show / Hide Password
togglePassword.onclick = () => {

    password.type =
        password.type === "password" ? "text" : "password";

};

toggleConfirmPassword.onclick = () => {

    confirmPassword.type =
        confirmPassword.type === "password" ? "text" : "password";

};

// Email Signup
signupBtn.addEventListener("click", async () => {

    if (email.value.trim() === "") {
        alert("Please enter your Email.");
        return;
    }

    if (password.value.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email.value,
                password.value
            );

        const user = userCredential.user;

        localStorage.setItem("currentUser", user.uid);
        localStorage.setItem("userEmail", user.email);

        alert("Account Created Successfully!");

        window.location.href = "choose-account.html";

    } catch (error) {

        alert(error.message);

    }

});

// Google Signup
const provider = new GoogleAuthProvider();

googleSignupBtn.addEventListener("click", async () => {

    try {

        const result =
            await signInWithPopup(auth, provider);

        localStorage.setItem("currentUser", result.user.uid);
        localStorage.setItem("userEmail", result.user.email);

        alert("Welcome " + result.user.displayName);

        window.location.href = "choose-account.html";

    } catch (error) {

        alert(error.message);

    }

});
