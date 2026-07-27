document.getElementById("buyerBtn").addEventListener("click", () => {
    localStorage.setItem("userRole", "buyer");
    window.location.href = "index.html";
});

document.getElementById("sellerBtn").addEventListener("click", () => {
    localStorage.setItem("userRole", "seller");
    window.location.href = "create-store.html";
});
