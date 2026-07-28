// ==========================================
// PrimeMart Checkout
// checkout.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
collection,
getDocs,
addDoc,
deleteDoc,
serverTimestamp,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;

let checkoutProducts = [];

const DELIVERY_CHARGE = 250;

// ==========================================
// Elements
// ==========================================

const checkoutItems =
document.getElementById("checkoutItems");

const checkoutSubtotal =
document.getElementById("checkoutSubtotal");

const checkoutDelivery =
document.getElementById("checkoutDelivery");

const checkoutGrandTotal =
document.getElementById("checkoutGrandTotal");

const placeOrderBtn =
document.getElementById("placeOrderBtn");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

await loadCheckoutCart();

});
// ==========================================
// PrimeMart Checkout
// Part 2 / 8
// Load Cart + Order Summary
// ==========================================

async function loadCheckoutCart(){

try{

const snapshot = await getDocs(

collection(db,"users",currentUser.uid,"cart")

);

checkoutProducts = [];

checkoutItems.innerHTML = "";

let subtotal = 0;

for(const cartDoc of snapshot.docs){

const cart = cartDoc.data();

const productSnap = await getDocs(

collection(db,"products")

);

productSnap.forEach((p)=>{

if(p.id===cart.productId){

const product = {

id:p.id,

...p.data(),

quantity:cart.quantity || 1

};

checkoutProducts.push(product);

const price = Number(

product.discountPrice || product.price || 0

);

subtotal += price * product.quantity;

checkoutItems.innerHTML += `

<div class="checkout-item">

<p>

${product.productName}

</p>

<p>

${product.quantity} × Rs. ${price}

</p>

</div>

`;

}

});

}

checkoutSubtotal.textContent =
`Rs. ${subtotal}`;

checkoutDelivery.textContent =
`Rs. ${DELIVERY_CHARGE}`;

checkoutGrandTotal.textContent =
`Rs. ${subtotal + DELIVERY_CHARGE}`;

}

catch(error){

console.error(error);

alert(error.message);

}

}
// ==========================================
// PrimeMart Checkout
// Part 3 / 8
// Customer Information + Validation
// ==========================================

const customerName =
document.getElementById("customerName");

const customerEmail =
document.getElementById("customerEmail");

const customerPhone =
document.getElementById("customerPhone");

const shippingAddress =
document.getElementById("shippingAddress");

const paymentMethod =
document.getElementById("paymentMethod");

const paymentNumber =
document.getElementById("paymentNumber");

const orderNotes =
document.getElementById("orderNotes");

// ==========================================
// Validate Checkout Form
// ==========================================

function validateCheckout(){

if(customerName.value.trim()===""){

alert("Please enter your full name.");

return false;

}

if(customerEmail.value.trim()===""){

alert("Please enter your email.");

return false;

}

if(customerPhone.value.trim()===""){

alert("Please enter your phone number.");

return false;

}

if(shippingAddress.value.trim()===""){

alert("Please enter your shipping address.");

return false;

}

const method = paymentMethod.value;

if((method==="jazzcash" || method==="easypaisa")

&& paymentNumber.value.trim()===""){

alert("Please enter your payment number.");

return false;

}

return true;

}
// ==========================================
// PrimeMart Checkout
// Part 4 / 8
// Place Order (Firestore)
// ==========================================

async function placeOrder(){

try{

if(!validateCheckout()) return;

let subtotal = 0;

checkoutProducts.forEach(product=>{

const price =
Number(product.discountPrice || product.price || 0);

subtotal += price * product.quantity;

});

const grandTotal =
subtotal + DELIVERY_CHARGE;

// ==========================================
// Save Order
// ==========================================

await addDoc(

collection(db,"orders"),

{

buyerId:currentUser.uid,

customerName:customerName.value.trim(),

customerEmail:customerEmail.value.trim(),

customerPhone:customerPhone.value.trim(),

shippingAddress:shippingAddress.value.trim(),

paymentMethod:paymentMethod.value,

paymentNumber:paymentNumber.value.trim(),

notes:orderNotes.value.trim(),

products:checkoutProducts,

subtotal,

delivery:DELIVERY_CHARGE,

grandTotal,

status:"Pending",

createdAt:serverTimestamp()

}

);

alert("✅ Order Placed Successfully");

await clearCart();

window.location.href="orders.html";

}

catch(error){

console.error(error);

alert(error.message);

}

}
// ==========================================
// PrimeMart Checkout
// Part 5 / 8
// Clear Cart + Button Event
// ==========================================

// ==========================================
// Clear Cart
// ==========================================

async function clearCart(){

try{

const snapshot = await getDocs(

collection(db,"users",currentUser.uid,"cart")

);

for(const cartDoc of snapshot.docs){

await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"cart",

cartDoc.id

)

);

}

}

catch(error){

console.error(error);

}

}

// ==========================================
// Place Order Button
// ==========================================

if(placeOrderBtn){

placeOrderBtn.addEventListener("click",async()=>{

await placeOrder();

});

}
// ==========================================
// PrimeMart Checkout
// Part 6 / 8
// Delivery Charges + Live Total
// ==========================================

const deliveryOptions =
document.getElementsByName("delivery");

let currentDeliveryCharge = DELIVERY_CHARGE;

// ==========================================
// Update Delivery
// ==========================================

function updateDeliveryCharge(){

deliveryOptions.forEach(option=>{

if(option.checked){

currentDeliveryCharge =

option.value==="express"

? 500

: 250;

}

});

checkoutDelivery.textContent =
`Rs. ${currentDeliveryCharge}`;

let subtotalValue = 0;

checkoutProducts.forEach(product=>{

const price =
Number(product.discountPrice || product.price || 0);

subtotalValue += price * product.quantity;

});

checkoutGrandTotal.textContent =
`Rs. ${subtotalValue + currentDeliveryCharge}`;

}

// ==========================================
// Delivery Change Event
// ==========================================

deliveryOptions.forEach(option=>{

option.addEventListener("change",()=>{

updateDeliveryCharge();

});

});
// ==========================================
// PrimeMart Checkout
// Part 7 / 8
// Auto Fill + Refresh
// ==========================================

// ==========================================
// Auto Fill User Information
// ==========================================

function autoFillCustomer(){

if(!currentUser) return;

if(customerName && !customerName.value){

customerName.value =
currentUser.displayName || "";

}

if(customerEmail && !customerEmail.value){

customerEmail.value =
currentUser.email || "";

}

}

// ==========================================
// Refresh Checkout
// ==========================================

async function refreshCheckout(){

await loadCheckoutCart();

updateDeliveryCharge();

autoFillCustomer();

}

// ==========================================
// Initial Setup
// ==========================================

document.addEventListener("DOMContentLoaded",async()=>{

if(currentUser){

await refreshCheckout();

}

});

// ==========================================
// Support Button
// ==========================================

const supportBtn =
document.getElementById("supportBtn");

if(supportBtn){

supportBtn.addEventListener("click",()=>{

alert("PrimeMart Customer Support will be available soon.");

});

}
// ==========================================
// PrimeMart Checkout
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Global Functions
// ==========================================

window.refreshCheckout = refreshCheckout;

window.placeOrder = placeOrder;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", async()=>{

console.log("PrimeMart Checkout Ready");

if(currentUser){

await refreshCheckout();

}

});

// ==========================================
// PrimeMart Checkout
// Firebase v3.0
// Firestore Ready
// Storage Ready
// LocalStorage Removed
// Commercial Version
// ==========================================
