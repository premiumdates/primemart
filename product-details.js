// ==========================================
// PrimeMart Product Details
// product-details.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;

let currentProduct = null;

let currentProductId = null;

// ==========================================
// Get Product ID From URL
// ==========================================

const params = new URLSearchParams(window.location.search);

currentProductId = params.get("id");

// ==========================================

onAuthStateChanged(auth,(user)=>{

currentUser = user || null;

loadProduct();

});

// ==========================================
// HTML Elements
// ==========================================

const productName =
document.getElementById("productName");

const productPrice =
document.getElementById("productPrice");

const discountPrice =
document.getElementById("discountPrice");

const productDescription =
document.getElementById("productDescription");

const productBrand =
document.getElementById("productBrand");

const mainImage =
document.getElementById("mainImage");

const thumbnailContainer =
document.getElementById("thumbnailContainer");

const productVideo =
document.getElementById("productVideo");
// ==========================================
// PrimeMart Product Details
// Part 2 / 8
// Load Product From Firestore
// ==========================================

async function loadProduct(){

try{

if(!currentProductId){

alert("Product not found.");

window.location.href="index.html";

return;

}

const productRef = doc(db,"products",currentProductId);

const snapshot = await getDoc(productRef);

if(!snapshot.exists()){

alert("Product not found.");

window.location.href="index.html";

return;

}

currentProduct = snapshot.data();

// ----------------------------
// Fill Product Data
// ----------------------------

productName.textContent =
currentProduct.productName || "";

productBrand.textContent =
currentProduct.brand || "";

productPrice.textContent =
`Rs. ${currentProduct.price}`;

if(currentProduct.discountPrice &&
Number(currentProduct.discountPrice)>0){

discountPrice.textContent =
`Rs. ${currentProduct.discountPrice}`;

}else{

discountPrice.textContent="";

}

productDescription.textContent =
currentProduct.description || "";

// ----------------------------
// Main Image
// ----------------------------

if(currentProduct.images &&
currentProduct.images.length>0){

mainImage.src =
currentProduct.images[0];

loadGallery();

}

// ----------------------------
// Video
// ----------------------------

if(currentProduct.video){

productVideo.src =
currentProduct.video;

}

loadSellerInfo();

loadRelatedProducts();

}

catch(error){

console.error(error);

alert(error.message);

}

}
// ==========================================
// PrimeMart Product Details
// Part 3 / 8
// Image Gallery
// ==========================================

function loadGallery(){

if(!thumbnailContainer) return;

thumbnailContainer.innerHTML="";

currentProduct.images.forEach((image)=>{

thumbnailContainer.innerHTML += `

<img
src="${image}"
class="thumbnail"
width="70"
height="70"
style="cursor:pointer;object-fit:cover;margin:4px;border-radius:6px;"
onclick="changeMainImage('${image}')">

`;

});

}

// ==========================================
// Change Main Image
// ==========================================

window.changeMainImage = function(image){

mainImage.src = image;

};

// ==========================================
// Image Zoom (Future Ready)
// ==========================================

if(mainImage){

mainImage.addEventListener("click",()=>{

window.open(mainImage.src,"_blank");

});

}
// ==========================================
// PrimeMart Product Details
// Part 4 / 8
// Seller Information + Related Products
// ==========================================

const storeName =
document.getElementById("storeName");

const sellerName =
document.getElementById("sellerName");

const relatedProducts =
document.getElementById("relatedProducts");

// ==========================================
// Load Seller Information
// ==========================================

async function loadSellerInfo(){

try{

storeName.textContent =
currentProduct.storeName || "PrimeMart Store";

const sellerQuery = query(

collection(db,"users"),

where("uid","==",currentProduct.sellerId)

);

const snapshot = await getDocs(sellerQuery);

snapshot.forEach((document)=>{

const seller = document.data();

sellerName.textContent =
seller.fullName || "PrimeMart Seller";

});

}

catch(error){

console.error(error);

}

}

// ==========================================
// Related Products
// ==========================================

async function loadRelatedProducts(){

try{

const q = query(

collection(db,"products"),

where("category","==",currentProduct.category)

);

const snapshot = await getDocs(q);

relatedProducts.innerHTML = "";

snapshot.forEach((document)=>{

const product = {

id:document.id,

...document.data()

};

if(product.id===currentProductId) return;

relatedProducts.innerHTML += `

<div class="related-card">

<img
src="${product.images?.[0] || 'default-product.png'}"
width="120">

<h4>${product.productName}</h4>

<p>Rs. ${product.price}</p>

<button
onclick="window.location.href='product-details.html?id=${product.id}'">

View

</button>

</div>

`;

});

}

catch(error){

console.error(error);

}

}
// ==========================================
// PrimeMart Product Details
// Part 5 / 8
// Wishlist + Cart + Buy Now
// ==========================================

import {
setDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================

const addToCartBtn =
document.getElementById("addToCartBtn");

const wishlistBtn =
document.getElementById("wishlistProductBtn");

const buyNowBtn =
document.getElementById("buyNowBtn");

// ==========================================
// Wishlist
// ==========================================

if(wishlistBtn){

wishlistBtn.addEventListener("click",async()=>{

try{

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

await setDoc(

doc(
db,
"users",
currentUser.uid,
"wishlist",
currentProductId
),

{

productId:currentProductId,

createdAt:serverTimestamp()

}

);

alert("❤️ Added to Wishlist");

}

catch(error){

console.error(error);

alert(error.message);

}

});

}

// ==========================================
// Cart
// ==========================================

if(addToCartBtn){

addToCartBtn.addEventListener("click",async()=>{

try{

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

await setDoc(

doc(
db,
"users",
currentUser.uid,
"cart",
currentProductId
),

{

productId:currentProductId,

quantity:1,

createdAt:serverTimestamp()

}

);

alert("🛒 Added to Cart");

}

catch(error){

console.error(error);

alert(error.message);

}

});

}

// ==========================================
// Buy Now
// ==========================================

if(buyNowBtn){

buyNowBtn.addEventListener("click",()=>{

window.location.href=

`checkout.html?product=${currentProductId}`;

});

}
// ==========================================
// PrimeMart Product Details
// Part 6 / 8
// Reviews System
// ==========================================

const reviewText =
document.getElementById("reviewText");

const reviewRating =
document.getElementById("reviewRating");

const submitReviewBtn =
document.getElementById("submitReviewBtn");

const reviewsContainer =
document.getElementById("reviewsContainer");

// ==========================================
// Load Reviews
// ==========================================

async function loadReviews(){

try{

const q = query(

collection(db,"products",currentProductId,"reviews")

);

const snapshot = await getDocs(q);

reviewsContainer.innerHTML="";

if(snapshot.empty){

reviewsContainer.innerHTML="<p>No Reviews Yet</p>";

return;

}

snapshot.forEach((document)=>{

const review=document.data();

reviewsContainer.innerHTML += `

<div class="review-card">

<h4>${review.userName || "PrimeMart User"}</h4>

<p>${"⭐".repeat(review.rating || 5)}</p>

<p>${review.review}</p>

</div>

`;

});

}

catch(error){

console.error(error);

}

}

// ==========================================
// Submit Review
// ==========================================

if(submitReviewBtn){

submitReviewBtn.addEventListener("click",async()=>{

try{

if(!currentUser){

alert("Please login first.");

window.location.href="login.html";

return;

}

if(reviewText.value.trim()===""){

alert("Write your review first.");

return;

}

await addDoc(

collection(db,"products",currentProductId,"reviews"),

{

userId:currentUser.uid,

userName:currentUser.displayName || "PrimeMart User",

rating:Number(reviewRating.value),

review:reviewText.value.trim(),

createdAt:serverTimestamp()

}

);

reviewText.value="";

reviewRating.value="5";

await loadReviews();

alert("✅ Review Submitted");

}

catch(error){

console.error(error);

alert(error.message);

}

});

}

// ==========================================
// Auto Load Reviews
// ==========================================

loadReviews();
// ==========================================
// PrimeMart Product Details
// Part 7 / 8
// Rating + Stock + Specifications
// ==========================================

const reviewCount =
document.getElementById("reviewCount");

const stockStatus =
document.getElementById("stockStatus");

const availability =
document.getElementById("availability");

const productCategory =
document.getElementById("productCategory");

const productBrandTable =
document.getElementById("productBrandTable");

// ==========================================
// Product Information
// ==========================================

function updateProductInfo(){

// Category
if(productCategory){

productCategory.textContent =
currentProduct.category || "-";

}

// Brand
if(productBrandTable){

productBrandTable.textContent =
currentProduct.brand || "-";

}

// Stock
const stock = Number(currentProduct.stock || 0);

if(stockStatus){

stockStatus.textContent =
stock > 0 ? "✅ In Stock" : "❌ Out of Stock";

}

if(availability){

availability.textContent =
stock > 0
? `${stock} Items Available`
: "Out of Stock";

}

}

// ==========================================
// Rating Summary
// ==========================================

async function updateRatingSummary(){

try{

const q = query(
collection(db,"products",currentProductId,"reviews")
);

const snapshot = await getDocs(q);

let total = 0;
let count = 0;

snapshot.forEach((document)=>{

const data = document.data();

total += Number(data.rating || 0);

count++;

});

const average =
count === 0 ? 0 : (total / count).toFixed(1);

const ratingElement =
document.querySelector(".product-rating");

if(ratingElement){

ratingElement.innerHTML = `

⭐ ${average} / 5

<span id="reviewCount">

(${count} Reviews)

</span>

`;

}

}

catch(error){

console.error(error);

}

}

// ==========================================
// Auto Update
// ==========================================

updateProductInfo();

updateRatingSummary();
// ==========================================
// PrimeMart Product Details
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Refresh Product
// ==========================================

async function refreshProduct(){

await loadProduct();

await loadReviews();

await updateRatingSummary();

}

// ==========================================
// Global Functions
// ==========================================

window.refreshProduct = refreshProduct;

window.changeMainImage = changeMainImage;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded",async()=>{

if(currentProductId){

await refreshProduct();

}

console.log("PrimeMart Product Details Ready");

});

// ==========================================
// PrimeMart Product Details
// Firebase v3.0
// Firestore Ready
// Storage Ready
// LocalStorage Removed
// Commercial Version
// ==========================================
