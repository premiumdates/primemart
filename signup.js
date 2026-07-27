import { auth, firestore } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Form Fields
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const country = document.getElementById("country");
const province = document.getElementById("province");
const division = document.getElementById("division");
const district = document.getElementById("district");
const tehsil = document.getElementById("tehsil");
const city = document.getElementById("city");
const postalCode = document.getElementById("postalCode");
const address = document.getElementById("address");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const signupBtn = document.getElementById("signupBtn");
const googleSignupBtn = document.getElementById("googleSignupBtn");

// Email Signup
signupBtn.addEventListener("click", async () => {

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

        await setDoc(doc(firestore, "users", user.uid), {

            uid: user.uid,

            fullName: fullName.value,

            email: email.value,

            phone: phone.value,

            country: country.value,

            province: province.value,

            division: division.value,

            district: district.value,

            tehsil: tehsil.value,

            city: city.value,

            postalCode: postalCode.value,

            address: address.value,

            role: "buyer",

            storeCreated: false,

            status: "active",

            profileImage: "",

            createdAt: serverTimestamp()

        });

        localStorage.setItem("currentUser", user.uid);

        alert("Account Created Successfully!");

        window.location.href = "choose-account.html";

    }

    catch (error) {

        alert(error.message);

    }

});

// Google Signup

const provider = new GoogleAuthProvider();

googleSignupBtn.addEventListener("click", async () => {

    try {

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        await setDoc(doc(firestore, "users", user.uid), {

            uid: user.uid,

            fullName: user.displayName,

            email: user.email,

            phone: "",

            country: "",

            province: "",

            division: "",

            district: "",

            tehsil: "",

            city: "",

            postalCode: "",

            address: "",

            role: "buyer",

            storeCreated: false,

            status: "active",

            profileImage: user.photoURL,

            createdAt: serverTimestamp()

        });

        localStorage.setItem("currentUser", user.uid);

        window.location.href = "choose-account.html";

    }

    catch (error) {

        alert(error.message);

    }

});
