// =====================================
// PrimeMart Seller Dashboard
// Part 1
// =====================================

const productForm = document.getElementById("productForm");

const tableBody = document.querySelector("#productTable tbody");

const totalProducts = document.getElementById("totalProducts");

const totalOrders = document.getElementById("totalOrders");

const totalEarnings = document.getElementById("totalEarnings");

const totalReviews = document.getElementById("totalReviews");

const logoutBtn = document.getElementById("logoutBtn");

const storeTitle = document.getElementById("storeTitle");

// ---------------------------
// Store Name
// ---------------------------

const savedStore = localStorage.getItem("storeName");

if (savedStore && storeTitle) {

    storeTitle.textContent = savedStore;

}

// ---------------------------
// Logout
// ---------------------------

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("currentUser");

        localStorage.removeItem("userRole");

        window.location.href = "login.html";

    });

}

// ---------------------------
// Products
// ---------------------------

let products = JSON.parse(localStorage.getItem("products")) || [];

// ---------------------------
// Save Products
// ---------------------------

function saveProducts() {

    localStorage.setItem(

        "products",

        JSON.stringify(products)

    );

}

// ---------------------------
// Dashboard Cards
// ---------------------------

function updateDashboardCards() {

    if (totalProducts)

        totalProducts.textContent = products.length;

    if (totalOrders)

        totalOrders.textContent = "0";

    if (totalEarnings)

        totalEarnings.textContent = "Rs.0";

    if (totalReviews)

        totalReviews.textContent = "0";

}
// =====================================
// Product Form Submit
// =====================================

let editIndex = -1;

if (productForm) {

productForm.addEventListener("submit", function (e) {

e.preventDefault();

const product = {

name: document.getElementById("productName").value,

category: document.getElementById("productCategory").value,

price: document.getElementById("productPrice").value,

discount: document.getElementById("discountPrice").value,

stock: document.getElementById("productStock").value,

brand: document.getElementById("brand").value,

description: document.getElementById("description").value,

image: document.getElementById("productImages").files[0]
? document.getElementById("productImages").files[0].name
: "",

video: document.getElementById("productVideo").files[0]
? document.getElementById("productVideo").files[0].name
: ""

};

if (editIndex === -1) {

products.push(product);

} else {

products[editIndex] = product;

editIndex = -1;

}

saveProducts();

renderProducts();

updateDashboardCards();

productForm.reset();

alert("✅ Product Saved Successfully!");

});

}

// =====================================
// Render Products
// =====================================

function renderProducts() {

if (!tableBody) return;

tableBody.innerHTML = "";

if (products.length === 0) {

tableBody.innerHTML = `

<tr>

<td colspan="6">

No Products Yet

</td>

</tr>

`;

return;

}

products.forEach((product, index) => {

tableBody.innerHTML += `

<tr>

<td>

${product.image || "📷"}

</td>

<td>

${product.name}

</td>

<td>

${product.category}

</td>

<td>

Rs.${product.price}

</td>

<td>

${product.stock}

</td>

<td>

<button onclick="editProduct(${index})">

Edit

</button>

<button onclick="deleteProduct(${index})">

Delete

</button>

</td>

</tr>

`;

});

}
// =====================================
// Delete Product
// =====================================

window.deleteProduct = function(index){

if(confirm("Are you sure you want to delete this product?")){

products.splice(index,1);

saveProducts();

renderProducts();

updateDashboardCards();

}

};

// =====================================
// Edit Product
// =====================================

window.editProduct = function(index){

const product = products[index];

editIndex = index;

document.getElementById("productName").value = product.name;

document.getElementById("productCategory").value = product.category;

document.getElementById("productPrice").value = product.price;

document.getElementById("discountPrice").value = product.discount;

document.getElementById("productStock").value = product.stock;

document.getElementById("brand").value = product.brand;

document.getElementById("description").value = product.description;

window.scrollTo({

top:0,

behavior:"smooth"

});

};

// =====================================
// Initial Load
// =====================================

renderProducts();

updateDashboardCards();

// =====================================
// Future Ready
// Firebase میں صرف یہی Functions
// بعد میں تبدیل ہوں گی
// باقی Dashboard دوبارہ نہیں بنانا پڑے گا
// =====================================
