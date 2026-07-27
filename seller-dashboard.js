// Store Name دکھائیں
const storeName = localStorage.getItem("storeName");

if (storeName) {
    document.getElementById("storeName").textContent = storeName;
} else {
    document.getElementById("storeName").textContent = "My Store";
}

// Logout Button
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

});
