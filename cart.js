// ==========================================
// PrimeMart Cart
// cart.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc,
query
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;

let cartProducts = [];

// ==========================================
// HTML Elements
// ==========================================

const cartItems =
document.getElementById("cartItems");

const totalItems =
document.getElementById("totalItems");

const subtotal =
document.getElementById("subtotal");

const grandTotal =
document.getElementById("grandTotal");

const deliveryCharges =
document.getElementById("deliveryCharges");

const emptyCart =
document.getElementById("emptyCart");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

await loadCart();

});
// ==========================================
// PrimeMart Cart
// Part 2 / 8
// Load Cart From Firestore
// ==========================================

async function loadCart(){

try{

const cartQuery = query(

collection(db,"users",currentUser.uid,"cart")

);

const cartSnapshot = await getDocs(cartQuery);

cartProducts = [];

for(const cartDoc of cartSnapshot.docs){

const cartData = cartDoc.data();

const productRef = doc(db,"products",cartData.productId);

const productSnapshot = await getDocs(
query(collection(db,"products"))
);

// Find matching product
productSnapshot.forEach((p)=>{

if(p.id===cartData.productId){

cartProducts.push({

id:p.id,

...p.data(),

quantity:cartData.quantity || 1

});

}

});

}

renderCart();

updateTotals();

}

catch(error){

console.error(error);

alert(error.message);

}

}
// ==========================================
// PrimeMart Cart
// Part 3 / 8
// Render Cart Items
// ==========================================

function renderCart(){

if(!cartItems) return;

cartItems.innerHTML = "";

if(cartProducts.length===0){

emptyCart.style.display="block";

cartItems.style.display="none";

return;

}

emptyCart.style.display="none";

cartItems.style.display="block";

cartProducts.forEach((product)=>{

cartItems.innerHTML += `

<div class="cart-item">

<img
src="${product.images?.[0] || 'default-product.png'}"
class="cart-image">

<div class="cart-info">

<h3>${product.productName}</h3>

<p>Rs. ${product.price}</p>

<div class="qty-box">

<button
onclick="decreaseQty('${product.id}')">

−

</button>

<span>

${product.quantity}

</span>

<button
onclick="increaseQty('${product.id}')">

+

</button>

</div>

<button
class="remove-btn"
onclick="removeItem('${product.id}')">

Remove

</button>

</div>

</div>

`;

});

}
// ==========================================
// PrimeMart Cart
// Part 4 / 8
// Quantity + Remove
// ==========================================

// ==========================================
// Increase Quantity
// ==========================================

window.increaseQty = async function(productId){

try{

const item = cartProducts.find(p=>p.id===productId);

if(!item) return;

item.quantity++;

await updateDoc(

doc(db,"users",currentUser.uid,"cart",productId),

{

quantity:item.quantity

}

);

renderCart();

updateTotals();

}

catch(error){

console.error(error);

alert(error.message);

}

};

// ==========================================
// Decrease Quantity
// ==========================================

window.decreaseQty = async function(productId){

try{

const item = cartProducts.find(p=>p.id===productId);

if(!item) return;

if(item.quantity>1){

item.quantity--;

await updateDoc(

doc(db,"users",currentUser.uid,"cart",productId),

{

quantity:item.quantity

}

);

renderCart();

updateTotals();

}

}

catch(error){

console.error(error);

alert(error.message);

}

};

// ==========================================
// Remove Item
// ==========================================

window.removeItem = async function(productId){

try{

const ok = confirm("Remove this product from cart?");

if(!ok) return;

await deleteDoc(

doc(db,"users",currentUser.uid,"cart",productId)

);

cartProducts = cartProducts.filter(

p=>p.id!==productId

);

renderCart();

updateTotals();

}

catch(error){

console.error(error);

alert(error.message);

}

};
// ==========================================
// PrimeMart Cart
// Part 5 / 8
// Order Summary
// ==========================================

const DELIVERY_FEE = 250;

// ==========================================
// Update Totals
// ==========================================

function updateTotals(){

let items = 0;
let subtotalPrice = 0;

cartProducts.forEach(product=>{

items += product.quantity;

const price =
Number(product.discountPrice || product.price || 0);

subtotalPrice += price * product.quantity;

});

const grand = subtotalPrice + DELIVERY_FEE;

// Update UI

if(totalItems){

totalItems.textContent = items;

}

if(subtotal){

subtotal.textContent = `Rs. ${subtotalPrice}`;

}

if(deliveryCharges){

deliveryCharges.textContent = `Rs. ${DELIVERY_FEE}`;

}

if(grandTotal){

grandTotal.textContent = `Rs. ${grand}`;

}

}
// ==========================================
// PrimeMart Cart
// Part 6 / 8
// Coupon + Checkout
// ==========================================

const couponInput =
document.getElementById("couponCode");

const couponMessage =
document.getElementById("couponMessage");

const applyCouponBtn =
document.getElementById("applyCouponBtn");

const checkoutBtn =
document.getElementById("checkoutBtn");

let couponDiscount = 0;

// ==========================================
// Coupon (Future Ready)
// ==========================================

if(applyCouponBtn){

applyCouponBtn.addEventListener("click",()=>{

const code = couponInput.value.trim().toUpperCase();

if(code==="PRIME10"){

couponDiscount = 10;

couponMessage.textContent =
"✅ Coupon Applied (10% Discount)";

}else{

couponDiscount = 0;

couponMessage.textContent =
"❌ Invalid Coupon";

}

updateTotals();

});

}

// ==========================================
// Update Totals With Coupon
// ==========================================

const originalUpdateTotals = updateTotals;

updateTotals = function(){

originalUpdateTotals();

if(couponDiscount>0){

let subtotalValue = 0;

cartProducts.forEach(product=>{

const price =
Number(product.discountPrice || product.price || 0);

subtotalValue += price * product.quantity;

});

const discountAmount =
Math.round(subtotalValue * couponDiscount / 100);

const finalTotal =
subtotalValue - discountAmount + DELIVERY_FEE;

if(grandTotal){

grandTotal.textContent = `Rs. ${finalTotal}`;

}

}

};

// ==========================================
// Checkout
// ==========================================

if(checkoutBtn){

checkoutBtn.addEventListener("click",()=>{

window.location.href = "checkout.html";

});

}
// ==========================================
// PrimeMart Cart
// Part 7 / 8
// Auto Refresh + Firestore Sync
// ==========================================

// ==========================================
// Refresh Cart
// ==========================================

async function refreshCart(){

await loadCart();

}

// ==========================================
// Auto Refresh Every 60 Seconds
// ==========================================

setInterval(async()=>{

if(currentUser){

await refreshCart();

}

},60000);

// ==========================================
// Contact Support
// ==========================================

const contactSupportBtn =
document.getElementById("contactSupportBtn");

if(contactSupportBtn){

contactSupportBtn.addEventListener("click",()=>{

alert("PrimeMart Support will be available soon.");

});

}

// ==========================================
// Continue Shopping Shortcut
// ==========================================

window.continueShopping = function(){

window.location.href = "index.html";

};
// ==========================================
// PrimeMart Cart
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Global Functions
// ==========================================

window.refreshCart = refreshCart;

window.renderCart = renderCart;

window.updateTotals = updateTotals;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", async()=>{

if(currentUser){

await refreshCart();

}

console.log("PrimeMart Cart Ready");

});

// ==========================================
// PrimeMart Cart
// Firebase v3.0
// Firestore Ready
// Storage Ready
// LocalStorage Removed
// Commercial Version
// ==========================================
