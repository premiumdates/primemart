import { auth } from "./firebase-config.js";

const form = document.getElementById("createStoreForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    // Login Check
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    // Form Values
    const storeName = document.getElementById("storeName").value.trim();

    const storeDescription = document.getElementById("storeDescription").value.trim();

    const paymentMethod = document.getElementById("paymentMethod").value;

    const paymentNumber = document.getElementById("paymentNumber").value.trim();

    const storeCategory = document.getElementById("storeCategory").value;

    // Validation

    if (storeName === "") {

        alert("Please enter Store Name.");

        return;

    }

    if (paymentMethod === "") {

        alert("Please select Payment Method.");

        return;

    }

    if (paymentNumber === "") {

        alert("Please enter Payment Number.");

        return;

    }

    if (storeCategory === "") {

        alert("Please select Store Category.");

        return;

    }

    // Store Save

    const storeData = {

        owner: currentUser,

        name: storeName,

        description: storeDescription,

        paymentMethod: paymentMethod,

        paymentNumber: paymentNumber,

        category: storeCategory,

        createdAt: new Date().toISOString()

    };

    localStorage.setItem("storeCreated", "true");

    localStorage.setItem("storeName", storeName);

    localStorage.setItem("storeData", JSON.stringify(storeData));

    localStorage.setItem("userRole", "seller");

    alert("🎉 Store Created Successfully!");

    window.location.href = "seller-dashboard.html";

});
