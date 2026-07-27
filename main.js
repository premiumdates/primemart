import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const guestButtons = document.getElementById("guestButtons");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardLink = document.getElementById("dashboardLink");

onAuthStateChanged(auth, (user) => {

    if (user) {

        if (guestButtons)
            guestButtons.style.display = "none";

        if (userMenu)
            userMenu.style.display = "flex";

        const role = localStorage.getItem("userRole");
        const storeCreated = localStorage.getItem("storeCreated");

        if (dashboardLink) {

            if (role === "seller") {

                if (storeCreated === "true") {

                    dashboardLink.href = "seller-dashboard.html";
                    dashboardLink.textContent = "Seller Dashboard";

                } else {

                    dashboardLink.href = "create-store.html";
                    dashboardLink.textContent = "Create Store";

                }

            } else {

                dashboardLink.href = "choose-account.html";
                dashboardLink.textContent = "Become a Seller";

            }

        }

    } else {

        if (guestButtons)
            guestButtons.style.display = "flex";

        if (userMenu)
            userMenu.style.display = "none";

    }

});

if (logoutBtn) {

    logoutBtn.onclick = async () => {

        await signOut(auth);

        localStorage.removeItem("userRole");

        window.location.href = "index.html";

    };

}
