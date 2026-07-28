// ==========================================
// PrimeMart Marketplace
// index.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;

let allProducts = [];

// ==========================================

const productContainer =
document.getElementById("productContainer");

const searchInput =
document.getElementById("searchProduct");

const categoryFilter =
document.getElementById("categoryFilter");

// ==========================================

onAuthStateChanged(auth,(user)=>{

currentUser = user || null;

loadProducts();

});
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 2 / 8
// Load Products From Firestore
// ==========================================

async function loadProducts(){

try{

const q = query(

collection(db,"products"),

orderBy("createdAt","desc")

);

const snapshot = await getDocs(q);

allProducts = [];

snapshot.forEach((document)=>{

const data = document.data();

if(data.status==="Active"){

allProducts.push({

id:document.id,

...data

});

}

});

renderProducts(allProducts);

}

catch(error){

console.error(error);

}

}

// ==========================================
// Render Products
// ==========================================

function renderProducts(products){

if(!productContainer) return;

productContainer.innerHTML="";

if(products.length===0){

productContainer.innerHTML=`

<div class="no-products">

<h2>No Products Available</h2>

</div>

`;

return;

}

products.forEach(product=>{

productContainer.innerHTML += `

<div class="product-card">

<img
src="${product.images[0]}"
class="product-image">

<h3>${product.productName}</h3>

<p>${product.category}</p>

<h2>

Rs. ${product.price}

</h2>

<button
onclick="openProduct('${product.id}')">

View Details

</button>

</div>

`;

});

}
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 3 / 8
// Search + Category Filter + Product Open
// ==========================================

// ==========================================
// Search Products
// ==========================================

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const keyword = searchInput.value.toLowerCase();

const filtered = allProducts.filter(product=>

product.productName.toLowerCase().includes(keyword) ||

product.brand.toLowerCase().includes(keyword) ||

product.category.toLowerCase().includes(keyword)

);

renderProducts(filtered);

});

}

// ==========================================
// Category Filter
// ==========================================

if(categoryFilter){

categoryFilter.addEventListener("change",()=>{

const value = categoryFilter.value;

if(value===""){

renderProducts(allProducts);

return;

}

const filtered = allProducts.filter(product=>

product.category===value

);

renderProducts(filtered);

});

}

// ==========================================
// Product Details
// ==========================================

window.openProduct = function(productId){

window.location.href =

`product-details.html?id=${productId}`;

};
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 4 / 8
// Product Cards Upgrade
// ==========================================

function createProductCard(product){

const discount =
Number(product.discountPrice || 0);

const price =
Number(product.price || 0);

const hasDiscount =
discount > 0 && discount < price;

const badge = hasDiscount
? `<span class="discount-badge">
-${Math.round(((price-discount)/price)*100)}%
</span>`
: "";

const stockBadge =
Number(product.stock)<=0
? `<span class="stock-badge">
Out of Stock
</span>`
: "";

return `

<div class="product-card">

${badge}

${stockBadge}

<img
src="${product.images?.[0] || 'default-product.png'}"
class="product-image">

<h3>

${product.productName}

</h3>

<p class="brand">

${product.brand || ""}

</p>

<p class="category">

${product.category}

</p>

<div class="price-box">

${
hasDiscount
?
`
<span class="old-price">

Rs. ${price}

</span>

<span class="new-price">

Rs. ${discount}

</span>
`
:
`
<span class="new-price">

Rs. ${price}

</span>
`
}

</div>

<div class="product-footer">

<button
onclick="openProduct('${product.id}')">

View Details

</button>

</div>

</div>

`;

}

// ==========================================
// Replace renderProducts()
// ==========================================

function renderProducts(products){

if(!productContainer) return;

productContainer.innerHTML="";

if(products.length===0){

productContainer.innerHTML=`

<div class="no-products">

<h2>

No Products Available

</h2>

</div>

`;

return;

}

products.forEach(product=>{

productContainer.innerHTML +=
createProductCard(product);

});

}
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 5 / 8
// Wishlist + Cart + Featured
// ==========================================

// ==========================================
// Featured Products
// ==========================================

function getFeaturedProducts(){

return allProducts.filter(product=>

product.featured===true

);

}

// ==========================================
// Best Sellers
// ==========================================

function getBestSellingProducts(){

return [...allProducts].sort(

(a,b)=>(b.sales||0)-(a.sales||0)

);

}

// ==========================================
// Wishlist
// ==========================================

window.addToWishlist = async function(productId){

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

alert("❤️ Wishlist feature will be connected in next step.");

};

// ==========================================
// Add To Cart
// ==========================================

window.addToCart = async function(productId){

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

alert("🛒 Cart feature will be connected in next step.");

};

// ==========================================
// Product Card Upgrade
// ==========================================

function createActionButtons(product){

return `

<div class="action-buttons">

<button
onclick="addToWishlist('${product.id}')">

❤️

</button>

<button
onclick="addToCart('${product.id}')">

🛒

</button>

<button
onclick="openProduct('${product.id}')">

View

</button>

</div>

`;

}
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 6 / 8
// Firestore Wishlist + Cart
// ==========================================

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// Add To Wishlist
// ==========================================

window.addToWishlist = async function(productId){

try{

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

await setDoc(

doc(db,"users",currentUser.uid,"wishlist",productId),

{

productId,

createdAt:serverTimestamp()

}

);

alert("❤️ Added to Wishlist");

}

catch(error){

console.error(error);

alert(error.message);

}

};

// ==========================================
// Add To Cart
// ==========================================

window.addToCart = async function(productId){

try{

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

await setDoc(

doc(db,"users",currentUser.uid,"cart",productId),

{

productId,

quantity:1,

createdAt:serverTimestamp()

}

);

alert("🛒 Product Added to Cart");

}

catch(error){

console.error(error);

alert(error.message);

}

};
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 7 / 8
// Latest + Featured + Sorting
// ==========================================

// ==========================================
// Latest Products
// ==========================================

function getLatestProducts(){

return [...allProducts].sort((a,b)=>{

const aTime = a.createdAt?.seconds || 0;

const bTime = b.createdAt?.seconds || 0;

return bTime - aTime;

});

}

// ==========================================
// Highest Discount
// ==========================================

function getHighestDiscountProducts(){

return [...allProducts].sort((a,b)=>{

const discountA =
(Number(a.price||0)-Number(a.discountPrice||0));

const discountB =
(Number(b.price||0)-Number(b.discountPrice||0));

return discountB-discountA;

});

}

// ==========================================
// Product Counter
// ==========================================

const totalProductsElement =
document.getElementById("totalMarketplaceProducts");

if(totalProductsElement){

totalProductsElement.textContent =
allProducts.length;

}

// ==========================================
// Refresh Marketplace
// ==========================================

async function refreshMarketplace(){

await loadProducts();

}

// ==========================================
// Auto Refresh
// ==========================================

setInterval(async()=>{

await refreshMarketplace();

},60000);
// ==========================================
// PrimeMart Marketplace
// index.js
// Part 8 / 8
// Final Initialization
// ==========================================

// ==========================================
// Marketplace Ready
// ==========================================

window.refreshMarketplace = refreshMarketplace;

window.renderProducts = renderProducts;

window.createProductCard = createProductCard;

window.getLatestProducts = getLatestProducts;

window.getFeaturedProducts = getFeaturedProducts;

window.getBestSellingProducts = getBestSellingProducts;

window.getHighestDiscountProducts = getHighestDiscountProducts;

// ==========================================
// Page Loaded
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{

console.log("PrimeMart Marketplace Ready");

});

// ==========================================
// PrimeMart Marketplace
// Firebase v3.0
// Firestore Ready
// Storage Ready
// LocalStorage Removed
// Buyer Side Ready
// ==========================================
