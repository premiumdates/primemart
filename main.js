import { auth, firestore } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const guestButtons = document.getElementById("guestButtons");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardLink = document.getElementById("dashboardLink");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        if (guestButtons)
            guestButtons.style.display = "flex";

        if (userMenu)
            userMenu.style.display = "none";

        return;
    }

    if (guestButtons)
        guestButtons.style.display = "none";

    if (userMenu)
        userMenu.style.display = "flex";

    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.role === "seller") {

        dashboardLink.href = "seller-dashboard.html";
        dashboardLink.textContent = "Seller Dashboard";

    } else {

        dashboardLink.href = "choose-account.html";
        dashboardLink.textContent = "Become a Seller";

    }

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    localStorage.clear();

    window.location.href = "index.html";

});
