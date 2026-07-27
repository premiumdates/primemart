import { auth } from "./firebase-config.js";

const form = document.getElementById("createStoreForm");

const storeName = document.getElementById("storeName");

const paymentMethod = document.getElementById("paymentMethod");

const paymentNumber = document.getElementById("paymentNumber");

const storeNameStatus = document.getElementById("storeNameStatus");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    if (storeName.value.trim() === "") {

        alert("Please enter Store Name.");

        return;

    }

    if (paymentMethod.value === "") {

        alert("Please select Payment Method.");

        return;

    }

    if (paymentNumber.value.trim() === "") {

        alert("Please enter Payment Number.");

        return;

    }

    // Store Data Save
    localStorage.setItem("storeCreated", "true");
    localStorage.setItem("storeName", storeName.value);

    alert("Store Created Successfully!");

    window.location.href = "seller-dashboard.html";

});
