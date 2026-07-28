import { auth, firestore } from "./firebase-config.js";

import {
    doc,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const buyerBtn = document.getElementById("buyerBtn");
const sellerBtn = document.getElementById("sellerBtn");

buyerBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    await updateDoc(doc(firestore, "users", user.uid), {

        role: "buyer"

    });

    window.location.href = "index.html";

});

sellerBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    const ref = doc(firestore, "users", user.uid);

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    await updateDoc(ref, {

        role: "seller"

    });

    if (data.storeCreated === true) {

        window.location.href = "seller-dashboard.html";

    } else {

        window.location.href = "create-store.html";

    }

});
