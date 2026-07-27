const buyerBtn = document.getElementById("buyerBtn");
const sellerBtn = document.getElementById("sellerBtn");

// Buyer
buyerBtn.addEventListener("click", () => {

    localStorage.setItem("userRole", "buyer");

    window.location.href = "index.html";

});

// Seller
sellerBtn.addEventListener("click", () => {

    localStorage.setItem("userRole", "seller");

    const storeCreated = localStorage.getItem("storeCreated");

    if (storeCreated === "true") {

        window.location.href = "seller-dashboard.html";

    } else {

        window.location.href = "create-store.html";

    }

});
