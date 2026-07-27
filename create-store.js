import { auth } from "./firebase.js";

const form = document.getElementById("createStoreForm");
const storeName = document.getElementById("storeName");
const paymentMethod = document.getElementById("paymentMethod");
const paymentNumber = document.getElementById("paymentNumber");
const storeNameStatus = document.getElementById("storeNameStatus");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
}

    localStorage.setItem("storeName", storeName.value);

alert("Store Created Successfully!");
window.location.href = "seller-dashboard.html";
});
