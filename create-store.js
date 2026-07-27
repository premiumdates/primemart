import { auth } from "./firebase.js";

const form = document.getElementById("createStoreForm");
const storeName = document.getElementById("storeName");
const paymentMethod = document.getElementById("paymentMethod");
const paymentNumber = document.getElementById("paymentNumber");
const storeNameStatus = document.getElementById("storeNameStatus");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
        alert("Please login first.");
        return;
    }

    alert("Store Created Successfully!");
    window.location.href = "seller-dashboard.html";
});
