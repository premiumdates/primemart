import { auth, firestore } from "./firebase-config.js";

import {
    doc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("createStoreForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    const storeName =
        document.getElementById("storeName").value.trim();

    const storeDescription =
        document.getElementById("storeDescription").value.trim();

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const paymentNumber =
        document.getElementById("paymentNumber").value.trim();

    const storeCategory =
        document.getElementById("storeCategory").value;

    if (storeName === "") {

        alert("Enter Store Name");

        return;

    }

    try{

        // Store Save

        await setDoc(doc(firestore,"stores",user.uid),{

            owner:user.uid,

            storeName:storeName,

            description:storeDescription,

            paymentMethod:paymentMethod,

            paymentNumber:paymentNumber,

            category:storeCategory,

            status:"active",

            verified:false,

            rating:0,

            totalProducts:0,

            totalOrders:0,

            createdAt:new Date().toISOString()

        });

        // User Update

        await updateDoc(doc(firestore,"users",user.uid),{

            role:"seller",

            storeCreated:true,

            storeName:storeName

        });

        alert("🎉 Store Created Successfully");

        window.location.href="seller-dashboard.html";

    }

    catch(error){

        alert(error.message);

    }

});
