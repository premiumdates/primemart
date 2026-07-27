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
function loadProducts() {

    const tbody = document.querySelector("#productTable tbody");

    tbody.innerHTML = "";

    let products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="6">No Products Yet</td>
        </tr>
        `;

        return;

    }

    products.forEach((product, index) => {

        tbody.innerHTML += `
        <tr>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>${product.price}</td>

            <td>${product.discount}</td>

            <td>${product.stock}</td>

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

function deleteProduct(index) {

    let products = JSON.parse(localStorage.getItem("products")) || [];

    products.splice(index,1);

    localStorage.setItem("products", JSON.stringify(products));

    loadProducts();

}
function editProduct(index){

let products = JSON.parse(localStorage.getItem("products")) || [];

let product = products[index];

const inputs = document.querySelectorAll("#productForm input, #productForm textarea");

inputs[0].value = product.name;

inputs[1].value = product.category;

inputs[2].value = product.price;

inputs[3].value = product.discount;

inputs[4].value = product.stock;

inputs[5].value = product.description;

products.splice(index,1);

localStorage.setItem("products", JSON.stringify(products));

loadProducts();

}
loadProducts();
