// ==========================================
// PrimeMart Orders
// orders.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
collection,
query,
where,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;

let orders = [];

// ==========================================
// Elements
// ==========================================

const ordersContainer =
document.getElementById("ordersContainer");

const totalOrders =
document.getElementById("totalOrders");

const pendingOrders =
document.getElementById("pendingOrders");

const completedOrders =
document.getElementById("completedOrders");

const emptyOrders =
document.getElementById("emptyOrders");

const orderSearch =
document.getElementById("orderSearch");

const statusFilter =
document.getElementById("statusFilter");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

await loadOrders();

});
// ==========================================
// PrimeMart Orders
// Part 2 / 8
// Load Orders From Firestore
// ==========================================

async function loadOrders(){

try{

const q = query(

collection(db,"orders"),

where("buyerId","==",currentUser.uid)

);

const snapshot = await getDocs(q);

orders = [];

snapshot.forEach((document)=>{

orders.push({

id:document.id,

...document.data()

});

});

renderOrders();

updateSummary();

}

catch(error){

console.error(error);

alert(error.message);

}

}
// ==========================================
// PrimeMart Orders
// Part 3 / 8
// Render Orders
// ==========================================

function renderOrders(){

if(!ordersContainer) return;

ordersContainer.innerHTML = "";

if(orders.length===0){

emptyOrders.style.display="block";

ordersContainer.style.display="none";

return;

}

emptyOrders.style.display="none";

ordersContainer.style.display="block";

orders.forEach((order)=>{

const date = order.createdAt?.toDate
? order.createdAt.toDate().toLocaleString()
: "N/A";

ordersContainer.innerHTML += `

<div class="order-card">

<div class="order-top">

<h3>

Order #${order.id.substring(0,8)}

</h3>

<span class="status-badge">

${order.status}

</span>

</div>

<p>

📅 ${date}

</p>

<p>

📦 ${order.products?.length || 0} Item(s)

</p>

<p>

💰 Rs. ${order.grandTotal || 0}

</p>

<button
onclick="viewOrder('${order.id}')">

View Details

</button>

</div>

`;

});

}
// ==========================================
// PrimeMart Orders
// Part 4 / 8
// Search + Filter + Summary
// ==========================================

// ==========================================
// Summary
// ==========================================

function updateSummary(){

if(totalOrders){

totalOrders.textContent = orders.length;

}

if(pendingOrders){

pendingOrders.textContent =

orders.filter(o=>o.status==="Pending").length;

}

if(completedOrders){

completedOrders.textContent =

orders.filter(o=>o.status==="Completed").length;

}

}

// ==========================================
// Search + Filter
// ==========================================

function applyFilters(){

const search =
orderSearch.value.trim().toLowerCase();

const status =
statusFilter.value;

const cards =
document.querySelectorAll(".order-card");

cards.forEach(card=>{

const text =
card.innerText.toLowerCase();

const badge =
card.querySelector(".status-badge")?.innerText || "";

const matchSearch =
text.includes(search);

const matchStatus =
status==="all" || badge===status;

card.style.display =
(matchSearch && matchStatus)
? "block"
: "none";

});

}

// ==========================================
// Events
// ==========================================

if(orderSearch){

orderSearch.addEventListener("input",applyFilters);

}

if(statusFilter){

statusFilter.addEventListener("change",applyFilters);

}
// ==========================================
// PrimeMart Orders
// Part 5 / 8
// View Order Details
// ==========================================

const orderDetailsContainer =
document.getElementById("orderDetailsContainer");

// ==========================================
// View Order
// ==========================================

window.viewOrder = function(orderId){

const order = orders.find(o=>o.id===orderId);

if(!order) return;

let html = `

<h3>Order #${order.id.substring(0,8)}</h3>

<p><strong>Status:</strong> ${order.status}</p>

<p><strong>Customer:</strong> ${order.customerName}</p>

<p><strong>Email:</strong> ${order.customerEmail}</p>

<p><strong>Phone:</strong> ${order.customerPhone}</p>

<p><strong>Address:</strong> ${order.shippingAddress}</p>

<p><strong>Payment:</strong> ${order.paymentMethod}</p>

<hr>

<h4>Products</h4>

`;

(order.products || []).forEach(product=>{

const price =
Number(product.discountPrice || product.price || 0);

html += `

<div class="ordered-product">

<p><strong>${product.productName}</strong></p>

<p>Quantity: ${product.quantity}</p>

<p>Price: Rs. ${price}</p>

</div>

`;

});

html += `

<hr>

<p><strong>Total:</strong> Rs. ${order.grandTotal}</p>

`;

orderDetailsContainer.innerHTML = html;

document
.getElementById("orderDetailsSection")
.scrollIntoView({
behavior:"smooth"
});

};
// ==========================================
// PrimeMart Orders
// Part 6 / 8
// Reorder + Review + Contact Seller
// ==========================================

const reorderBtn =
document.getElementById("reorderBtn");

const writeReviewBtn =
document.getElementById("writeReviewBtn");

const contactSellerBtn =
document.getElementById("contactSellerBtn");

// Selected order
let selectedOrder = null;

// ==========================================
// Update Selected Order
// ==========================================

const oldViewOrder = window.viewOrder;

window.viewOrder = function(orderId){

selectedOrder =
orders.find(o=>o.id===orderId) || null;

oldViewOrder(orderId);

};

// ==========================================
// Order Again
// ==========================================

if(reorderBtn){

reorderBtn.addEventListener("click",()=>{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

window.location.href = "cart.html";

});

}

// ==========================================
// Write Review
// ==========================================

if(writeReviewBtn){

writeReviewBtn.addEventListener("click",()=>{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

window.location.href = "product-details.html";

});

}

// ==========================================
// Contact Seller
// ==========================================

if(contactSellerBtn){

contactSellerBtn.addEventListener("click",()=>{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

alert("Seller chat will be available in a future update.");

});

}
// ==========================================
// PrimeMart Orders
// Part 7 / 8
// Invoice + Tracking + History
// ==========================================

const downloadInvoiceBtn =
document.getElementById("downloadInvoiceBtn");

const orderHistoryContainer =
document.getElementById("orderHistoryContainer");

// ==========================================
// Download Invoice
// ==========================================

if(downloadInvoiceBtn){

downloadInvoiceBtn.addEventListener("click",()=>{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

window.print();

});

}

// ==========================================
// Tracking
// ==========================================

function updateTracking(status){

["Pending","Accepted","Shipped","Completed"].forEach(step=>{

const element =
document.getElementById("step"+step);

if(element){

element.classList.remove("active");

}

});

const active =
document.getElementById("step"+status);

if(active){

active.classList.add("active");

}

}

// ==========================================
// History
// ==========================================

function loadHistory(){

if(!orderHistoryContainer) return;

orderHistoryContainer.innerHTML="";

orders.forEach(order=>{

const date = order.createdAt?.toDate
? order.createdAt.toDate().toLocaleString()
: "N/A";

orderHistoryContainer.innerHTML += `

<div class="history-card">

<p>

📦 ${order.status}

</p>

<p>

📅 ${date}

</p>

</div>

`;

});

}

// ==========================================
// Extend View Order
// ==========================================

const previousViewOrder = window.viewOrder;

window.viewOrder = function(orderId){

previousViewOrder(orderId);

if(selectedOrder){

updateTracking(selectedOrder.status);

}

};
// ==========================================
// PrimeMart Orders
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Refresh Orders
// ==========================================

async function refreshOrders(){

await loadOrders();

loadHistory();

}

// ==========================================
// Global Functions
// ==========================================

window.refreshOrders = refreshOrders;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", async()=>{

console.log("PrimeMart Orders Ready");

if(currentUser){

await refreshOrders();

}

});

// ==========================================
// PrimeMart Orders
// Firebase v3.0
// Firestore Ready
// Storage Ready
// LocalStorage Removed
// Commercial Version
// ==========================================
