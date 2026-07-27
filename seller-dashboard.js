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
// Product Form
const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const inputs = productForm.querySelectorAll("input, textarea");

    const product = {

        name: inputs[0].value,
        category: inputs[1].value,
        price: inputs[2].value,
        discount: inputs[3].value,
        stock: inputs[4].value,
        description: inputs[5].value

    };

    let products = JSON.parse(localStorage.getItem("products")) || [];

    products.push(product);

    localStorage.setItem("products", JSON.stringify(products));

    alert("Product Saved Successfully!");

    productForm.reset();

});
