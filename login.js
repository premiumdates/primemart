import { auth, firestore } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");

async function loginSuccess(user){

    localStorage.setItem("currentUser", user.uid);
    localStorage.setItem("userEmail", user.email);

    const userRef = doc(firestore,"users",user.uid);
    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()){

        alert("User profile not found.");
        return;

    }

    const userData = userSnap.data();

    localStorage.setItem("userRole",userData.role);
    localStorage.setItem("storeCreated",userData.storeCreated);
    localStorage.setItem("fullName",userData.fullName);

    // ہمیشہ Home Page پر جاؤ
    window.location.href="index.html";

}

// ==========================
// Email Login
// ==========================

loginBtn.addEventListener("click",async()=>{

    try{

        const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await loginSuccess(userCredential.user);

    }

    catch(error){

        alert(error.message);

    }

});

// ==========================
// Google Login
// ==========================

const provider = new GoogleAuthProvider();

googleLoginBtn.addEventListener("click",async()=>{

    try{

        const result =
        await signInWithPopup(auth,provider);

        await loginSuccess(result.user);

    }

    catch(error){

        alert(error.message);

    }

});
