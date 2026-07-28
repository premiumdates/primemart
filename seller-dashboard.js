// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 1 / 8
// Firebase Product System
// ==========================================

import { auth, db, storage } from "./firebase-config.js";

import {
collection,
addDoc,
getDocs,
query,
where,
doc,
deleteDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;
let currentStore = null;
let currentProducts = [];

// ==========================================

const productForm =
document.getElementById("productForm");

const productTable =
document.querySelector("#productTable tbody");

const totalProducts =
document.getElementById("totalProducts");

const totalOrders =
document.getElementById("totalOrders");

const totalSales =
document.getElementById("totalSales");

const totalReviews =
document.getElementById("totalReviews");
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 2 / 8
// Authentication + Store Loading
// ==========================================

// ---------- Authentication ----------

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

await loadStore();

await loadProducts();

});

// ---------- Load Store ----------

async function loadStore(){

const q = query(

collection(db,"stores"),

where("owner","==",currentUser.uid)

);

const snapshot = await getDocs(q);

if(snapshot.empty){

window.location.href="create-store.html";

return;

}

snapshot.forEach((document)=>{

currentStore={

id:document.id,

...document.data()

};

});

const title=document.getElementById("storeTitle");

if(title){

title.textContent=currentStore.name;

}

}

// ---------- Logout ----------

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

window.location.href="login.html";

});

}
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 3 / 8
// Upload Product
// ==========================================

async function uploadImages(files){

let imageURLs=[];

for(const file of files){

const imageRef = ref(

storage,

`products/${currentUser.uid}/${Date.now()}_${file.name}`

);

await uploadBytes(imageRef,file);

const url = await getDownloadURL(imageRef);

imageURLs.push(url);

}

return imageURLs;

}

async function uploadVideo(file){

if(!file) return "";

const videoRef = ref(

storage,

`products/videos/${currentUser.uid}/${Date.now()}_${file.name}`

);

await uploadBytes(videoRef,file);

return await getDownloadURL(videoRef);

}

// ==========================================
// Create Product
// ==========================================

if(productForm){

productForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

const images = await uploadImages(

document.getElementById("productImages").files

);

const video = await uploadVideo(

document.getElementById("productVideo").files[0]

);

await addDoc(

collection(db,"products"),

{

sellerId:currentUser.uid,

storeId:currentStore.id,

storeName:currentStore.name,

productName:

document.getElementById("productName").value,

category:

document.getElementById("productCategory").value,

price:Number(

document.getElementById("productPrice").value

),

discountPrice:Number(

document.getElementById("discountPrice").value

),

stock:Number(

document.getElementById("productStock").value

),

brand:

document.getElementById("brand").value,

description:

document.getElementById("description").value,

images,

video,

status:"Active",

featured:false,

rating:0,

reviews:0,

sales:0,

createdAt:serverTimestamp()

}

);

alert("✅ Product Added Successfully");

productForm.reset();

await loadProducts();

}

catch(error){

console.error(error);

alert(error.message);

}

});

}
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 4 / 8
// Load Products + Dashboard Cards
// ==========================================

async function loadProducts(){

try{

const q = query(

collection(db,"products"),

where("sellerId","==",currentUser.uid)

);

const snapshot = await getDocs(q);

currentProducts=[];

snapshot.forEach((document)=>{

currentProducts.push({

id:document.id,

...document.data()

});

});

renderProducts();

updateDashboardCards();

}

catch(error){

console.error(error);

}

}

// ==========================================
// Dashboard Cards
// ==========================================

function updateDashboardCards(){

if(totalProducts){

totalProducts.textContent=currentProducts.length;

}

if(totalOrders){

let orders=0;

currentProducts.forEach(product=>{

orders+=product.sales||0;

});

totalOrders.textContent=orders;

}

if(totalSales){

let earnings=0;

currentProducts.forEach(product=>{

earnings+=(product.sales||0)*(product.price||0);

});

totalSales.textContent="Rs. "+earnings;

}

if(totalReviews){

let reviews=0;

currentProducts.forEach(product=>{

reviews+=product.reviews||0;

});

totalReviews.textContent=reviews;

}

}

// ==========================================
// Product Table
// ==========================================

function renderProducts(){

if(!productTable) return;

productTable.innerHTML="";

if(currentProducts.length===0){

productTable.innerHTML=`

<tr>

<td colspan="6">

No Products Yet

</td>

</tr>

`;

return;

}

currentProducts.forEach((product,index)=>{

productTable.innerHTML+=`

<tr>

<td>

<img
src="${product.images[0]}"
width="60">

</td>

<td>

${product.productName}

</td>

<td>

${product.category}

</td>

<td>

Rs. ${product.price}

</td>

<td>

${product.stock}

</td>

<td>

<button onclick="editProduct(${index})">

Edit

</button>

<button onclick="deleteProduct('${product.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 5 / 8
// Edit + Delete Product
// ==========================================

// ==========================================
// Delete Product
// ==========================================

window.deleteProduct = async function(productId){

try{

const confirmDelete = confirm(

"Are you sure you want to delete this product?"

);

if(!confirmDelete) return;

await deleteDoc(

doc(db,"products",productId)

);

alert("✅ Product Deleted Successfully");

await loadProducts();

}

catch(error){

console.error(error);

alert(error.message);

}

};

// ==========================================
// Edit Product
// ==========================================

let editingProductId = null;

window.editProduct = function(index){

const product = currentProducts[index];

editingProductId = product.id;

document.getElementById("productName").value =
product.productName;

document.getElementById("productCategory").value =
product.category;

document.getElementById("productPrice").value =
product.price;

document.getElementById("discountPrice").value =
product.discountPrice;

document.getElementById("productStock").value =
product.stock;

document.getElementById("brand").value =
product.brand;

document.getElementById("description").value =
product.description;

window.scrollTo({

top:0,

behavior:"smooth"

});

};

// ==========================================
// Update Existing Product
// ==========================================

async function updateExistingProduct(data){

await updateDoc(

doc(db,"products",editingProductId),

data

);

editingProductId = null;

}
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 6 / 8
// Update Product Logic
// ==========================================

async function saveOrUpdateProduct(productData){

try{

if(editingProductId){

await updateDoc(

doc(db,"products",editingProductId),

{

productName:productData.productName,

category:productData.category,

price:Number(productData.price),

discountPrice:Number(productData.discountPrice),

stock:Number(productData.stock),

brand:productData.brand,

description:productData.description,

status:"Active",

updatedAt:serverTimestamp()

}

);

alert("✅ Product Updated Successfully");

editingProductId = null;

}else{

await addDoc(

collection(db,"products"),

productData

);

alert("✅ Product Added Successfully");

}

productForm.reset();

await loadProducts();

}

catch(error){

console.error(error);

alert(error.message);

}

}

// ==========================================
// Helper
// ==========================================

function getProductFormData(images,video){

return{

sellerId:currentUser.uid,

storeId:currentStore.id,

storeName:currentStore.name,

productName:

document.getElementById("productName").value.trim(),

category:

document.getElementById("productCategory").value,

price:

document.getElementById("productPrice").value,

discountPrice:

document.getElementById("discountPrice").value,

stock:

document.getElementById("productStock").value,

brand:

document.getElementById("brand").value.trim(),

description:

document.getElementById("description").value.trim(),

images,

video,

featured:false,

status:"Active",

rating:0,

reviews:0,

sales:0,

updatedAt:serverTimestamp(),

createdAt:serverTimestamp()

};

}
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 7 / 8
// Search + Filters + Image Preview
// ==========================================

// ==========================================
// Product Image Preview
// ==========================================

const imageInput =
document.getElementById("productImages");

const previewContainer =
document.getElementById("imagePreview");

if(imageInput){

imageInput.addEventListener("change",()=>{

if(!previewContainer) return;

previewContainer.innerHTML="";

Array.from(imageInput.files).forEach(file=>{

const reader=new FileReader();

reader.onload=(e)=>{

previewContainer.innerHTML+=`

<img
src="${e.target.result}"
width="80"
height="80"
style="object-fit:cover;border-radius:8px;margin:5px;">

`;

};

reader.readAsDataURL(file);

});

});

}

// ==========================================
// Product Search
// ==========================================

const searchInput =
document.getElementById("searchProduct");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const keyword =
searchInput.value.toLowerCase();

const filtered=currentProducts.filter(product=>

product.productName.toLowerCase().includes(keyword)

);

renderFilteredProducts(filtered);

});

}

// ==========================================
// Category Filter
// ==========================================

const categoryFilter =
document.getElementById("categoryFilter");

if(categoryFilter){

categoryFilter.addEventListener("change",()=>{

const value=categoryFilter.value;

if(value===""){

renderProducts();

return;

}

const filtered=currentProducts.filter(product=>

product.category===value

);

renderFilteredProducts(filtered);

});

}

// ==========================================
// Render Filtered Products
// ==========================================

function renderFilteredProducts(list){

if(!productTable) return;

productTable.innerHTML="";

if(list.length===0){

productTable.innerHTML=`

<tr>

<td colspan="6">

No Products Found

</td>

</tr>

`;

return;

}

list.forEach((product,index)=>{

productTable.innerHTML+=`

<tr>

<td>

<img
src="${product.images[0]}"
width="60">

</td>

<td>

${product.productName}

</td>

<td>

${product.category}

</td>

<td>

Rs. ${product.price}

</td>

<td>

${product.stock}

</td>

<td>

<button onclick="editProduct(${index})">

Edit

</button>

<button onclick="deleteProduct('${product.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// ==========================================
// PrimeMart Seller Dashboard v3.0
// Part 8 / 8
// Final Initialization
// ==========================================

// ==========================================
// Refresh Dashboard
// ==========================================

async function refreshDashboard(){

await loadProducts();

updateDashboardCards();

}

// ==========================================
// Reset Form
// ==========================================

function resetProductForm(){

editingProductId = null;

if(productForm){

productForm.reset();

}

const previewContainer =
document.getElementById("imagePreview");

if(previewContainer){

previewContainer.innerHTML="";

}

}

// ==========================================
// Future Ready Exports
// ==========================================

window.refreshDashboard = refreshDashboard;

window.renderProducts = renderProducts;

window.renderFilteredProducts = renderFilteredProducts;

window.resetProductForm = resetProductForm;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{

console.log("PrimeMart Seller Dashboard Loaded");

});

// ==========================================
// PrimeMart Marketplace
// Seller Dashboard v3.0
// Firebase Ready
// Firestore Ready
// Storage Ready
// LocalStorage Removed
// ==========================================
