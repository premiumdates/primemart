import { auth } from "./firebase-config.js";
    const role = localStorage.getItem("userRole");

    if (dashboardLink) {
        if (role === "seller") {
            dashboardLink.href = "create-store.html";
            dashboardLink.textContent = "Create Store";
        } else {
            dashboardLink.href = "choose-account.html";
            dashboardLink.textContent = "Become a Seller";
        }
    }
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const guestButtons = document.getElementById("guestButtons");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        if (guestButtons)
            guestButtons.style.display = "none";

        if (userMenu)
            userMenu.style.display = "flex";

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

        window.location.href = "index.html";

    };

}
