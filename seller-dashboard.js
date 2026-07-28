// =====================================
// PrimeMart Seller Dashboard v2.0
// Step 1
// Firebase Ready Version
// =====================================

import { auth, db, storage } from "./firebase-config.js";

import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc,
query,
where,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL,
deleteObject
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =====================================
// Global Variables
// =====================================

let currentUser = null;
let currentStore = null;
let products = [];
let editProductId = null;

// =====================================
// HTML Elements
// =====================================

const productForm = document.getElementById("productForm");

const storeTitle = document.getElementById("storeTitle");

const logoutBtn = document.getElementById("logoutBtn");

const productTableBody =
document.getElementById("productTableBody");

const totalProducts =
document.getElementById("totalProducts");

const totalOrders =
document.getElementById("totalOrders");

const totalRevenue =
document.getElementById("totalRevenue");

const storeRating =
document.getElementById("storeRating");

// =====================================
// Authentication
// =====================================

onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

// آگے Step 2 میں
// Store Load ہوگا

});
// =====================================
// Step 2
// Load Seller Store
// =====================================

async function loadSellerStore() {

    try {

        const q = query(
            collection(db, "stores"),
            where("owner", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            alert("Store not found.");

            window.location.href = "create-store.html";

            return;

        }

        snapshot.forEach((docSnap) => {

            currentStore = {

                id: docSnap.id,

                ...docSnap.data()

            };

        });

        if (storeTitle) {

            storeTitle.textContent = currentStore.name;

        }

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load seller store.");

    }

}

// =====================================
// Load Products
// =====================================

async function loadProducts() {

    products = [];

    const q = query(

        collection(db, "products"),

        where("sellerId", "==", currentUser.uid)

    );

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        products.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });

    renderProducts();

    updateDashboardCards();

}

// =====================================
// Continue Authentication
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

    await loadSellerStore();

});
// =====================================
// Step 3
// Dashboard Cards + Product Rendering
// =====================================

function updateDashboardCards() {

    if (totalProducts) {

        totalProducts.textContent = products.length;

    }

    if (totalOrders) {

        totalOrders.textContent = "0";

    }

    if (totalRevenue) {

        totalRevenue.textContent = "Rs.0";

    }

    if (storeRating) {

        storeRating.textContent = "0 ⭐";

    }

}

// =====================================
// Render Products
// =====================================

function renderProducts() {

    if (!productTableBody) return;

    productTableBody.innerHTML = "";

    if (products.length === 0) {

        productTableBody.innerHTML = `

<tr>

<td colspan="7">

No Products Available

</td>

</tr>

`;

        return;

    }

    products.forEach((product) => {

        productTableBody.innerHTML += `

<tr>

<td>

<img
src="${product.image || 'logo.png'}"
width="60"
height="60"
style="border-radius:8px;object-fit:cover;">

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

${product.status || "Active"}

</td>

<td>

<button
onclick="editProduct('${product.id}')">

Edit

</button>

<button
onclick="deleteProduct('${product.id}','${product.imagePath || ""}')">

Delete

</button>

</td>

</tr>

`;

    });

}
// =====================================
// Step 4
// Create Product (Firestore + Storage)
// =====================================

if (productForm) {

productForm.addEventListener("submit", async (e) => {

e.preventDefault();

try {

const productName =
document.getElementById("productName").value;

const productCategory =
document.getElementById("productCategory").value;

const productPrice =
document.getElementById("productPrice").value;

const discountPrice =
document.getElementById("discountPrice").value;

const productStock =
document.getElementById("productStock").value;

const brand =
document.getElementById("brand").value;

const description =
document.getElementById("description").value;

const imageFile =
document.getElementById("productImages").files[0];

const videoFile =
document.getElementById("productVideo").files[0];

let imageURL = "";
let imagePath = "";

let videoURL = "";
let videoPath = "";

// =====================
// Upload Image
// =====================

if (imageFile) {

imagePath =
`products/${currentUser.uid}/${Date.now()}_${imageFile.name}`;

const imageRef = ref(storage, imagePath);

await uploadBytes(imageRef, imageFile);

imageURL =
await getDownloadURL(imageRef);

}

// =====================
// Upload Video
// =====================

if (videoFile) {

videoPath =
`products/${currentUser.uid}/${Date.now()}_${videoFile.name}`;

const videoRef = ref(storage, videoPath);

await uploadBytes(videoRef, videoFile);

videoURL =
await getDownloadURL(videoRef);

}

// =====================
// Save Product
// =====================

await addDoc(collection(db, "products"), {

sellerId: currentUser.uid,

storeId: currentStore.id,

storeName: currentStore.name,

name: productName,

category: productCategory,

price: Number(productPrice),

discountPrice: Number(discountPrice),

stock: Number(productStock),

brand: brand,

description: description,

image: imageURL,

imagePath: imagePath,

video: videoURL,

videoPath: videoPath,

status: "Active",

rating: 0,

reviews: 0,

orders: 0,

createdAt: serverTimestamp()

});

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
// =====================================
// Step 5
// Delete + Edit + Logout
// =====================================

import {
deleteDoc,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
deleteObject,
ref
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// =====================================
// Delete Product
// =====================================

window.deleteProduct = async function(productId, imagePath){

try{

const confirmDelete =
confirm("Delete this product?");

if(!confirmDelete) return;

// Delete Image

if(imagePath){

const imageRef = ref(storage,imagePath);

await deleteObject(imageRef);

}

// Delete Firestore Document

await deleteDoc(
doc(db,"products",productId)
);

await loadProducts();

alert("✅ Product Deleted");

}catch(error){

console.error(error);

alert(error.message);

}

};

// =====================================
// Edit Product
// =====================================

window.editProduct = function(productId){

const product =
products.find(p=>p.id===productId);

if(!product) return;

editProductId = product.id;

document.getElementById("productName").value =
product.name;

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

// =====================================
// Logout
// =====================================

if(logoutBtn){

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

window.location.href="login.html";

});

}

// =====================================
// Refresh Dashboard
// =====================================

window.refreshDashboard = async()=>{

await loadProducts();

updateDashboardCards();

};
// =====================================
// Step 6
// Update Product + Final Initialization
// =====================================

// =====================
// Update Existing Product
// =====================

async function updateExistingProduct(data){

try{

await updateDoc(

doc(db,"products",editProductId),

{

name:data.name,

category:data.category,

price:Number(data.price),

discountPrice:Number(data.discount),

stock:Number(data.stock),

brand:data.brand,

description:data.description,

updatedAt:serverTimestamp()

}

);

editProductId = null;

await loadProducts();

alert("✅ Product Updated Successfully");

}

catch(error){

console.error(error);

alert(error.message);

}

}

// =====================================
// Dashboard Initialization
// =====================================

document.addEventListener("DOMContentLoaded",async()=>{

if(auth.currentUser){

currentUser = auth.currentUser;

await loadSellerStore();

}

});

// =====================================
// Export (Future)
// =====================================

window.loadProducts = loadProducts;

window.updateDashboardCards = updateDashboardCards;

// =====================================
// PrimeMart Seller Dashboard v2.0
// Firebase Ready
// LocalStorage Removed
// =====================================
