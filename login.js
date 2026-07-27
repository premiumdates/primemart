import { auth } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");

// =====================
// Login
// =====================

loginBtn.addEventListener("click", async () => {

try{

const userCredential = await signInWithEmailAndPassword(
auth,
email.value,
password.value
);

const user = userCredential.user;

localStorage.setItem("currentUser", user.uid);
localStorage.setItem("userEmail", user.email);

// اگر Store بنا ہوا ہے
if(localStorage.getItem("storeCreated")==="true"){

window.location.href="seller-dashboard.html";

}else{

window.location.href="index.html";

}

}catch(error){

alert(error.message);

}

});

// =====================
// Google Login
// =====================

const provider = new GoogleAuthProvider();

googleLoginBtn.addEventListener("click", async ()=>{

try{

const result = await signInWithPopup(auth,provider);

localStorage.setItem("currentUser",result.user.uid);
localStorage.setItem("userEmail",result.user.email);

if(localStorage.getItem("storeCreated")==="true"){

window.location.href="seller-dashboard.html";

}else{

window.location.href="index.html";

}

}catch(error){

alert(error.message);

}

});
