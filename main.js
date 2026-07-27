import { auth } from "./firebase-config.js";
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
