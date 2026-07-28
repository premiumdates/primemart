// ==========================================
// PrimeMart Seller Orders
// seller-orders.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================
// Global Variables
// ==========================================

let currentUser = null;
let sellerOrders = [];
let selectedOrder = null;

// ==========================================
// HTML Elements
// ==========================================

const sellerOrdersContainer =
document.getElementById("sellerOrdersContainer");

const sellerTotalOrders =
document.getElementById("sellerTotalOrders");

const sellerPendingOrders =
document.getElementById("sellerPendingOrders");

const sellerCompletedOrders =
document.getElementById("sellerCompletedOrders");

const sellerEmptyOrders =
document.getElementById("sellerEmptyOrders");

const sellerOrderSearch =
document.getElementById("sellerOrderSearch");

const sellerStatusFilter =
document.getElementById("sellerStatusFilter");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "login.html";
    return;

  }

  currentUser = user;

  // Load seller orders
  await loadSellerOrders();

});
// ==========================================
// Load Seller Orders
// ==========================================

async function loadSellerOrders() {

  try {

    sellerOrders = [];

    const ordersRef = collection(db, "orders");

    const snapshot = await getDocs(ordersRef);

    snapshot.forEach((document) => {

      const order = {
        id: document.id,
        ...document.data()
      };

      const products = order.products || [];

      const belongsToSeller = products.some(product =>
        product.sellerId === currentUser.uid
      );

      if (belongsToSeller) {

        sellerOrders.push(order);

      }

    });

    renderSellerOrders();

    updateSellerSummary();

  }

  catch (error) {

    console.error("Load Seller Orders Error:", error);

    alert(error.message);

  }

}
// ==========================================
// Render Seller Orders
// ==========================================

function renderSellerOrders() {

  if (!sellerOrdersContainer) return;

  sellerOrdersContainer.innerHTML = "";

  if (sellerOrders.length === 0) {

    sellerEmptyOrders.style.display = "block";
    sellerOrdersContainer.style.display = "none";
    return;

  }

  sellerEmptyOrders.style.display = "none";
  sellerOrdersContainer.style.display = "block";

  sellerOrders.forEach((order) => {

    const createdDate =
      order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleString()
        : "N/A";

    sellerOrdersContainer.innerHTML += `

      <div class="seller-order-card">

        <div class="seller-order-header">

          <h3>Order #${order.id.substring(0,8)}</h3>

          <span class="status-badge">

            ${order.status}

          </span>

        </div>

        <p><strong>Buyer:</strong> ${order.customerName}</p>

        <p><strong>Items:</strong> ${order.products?.length || 0}</p>

        <p><strong>Total:</strong> Rs. ${order.grandTotal || 0}</p>

        <p><strong>Date:</strong> ${createdDate}</p>

        <button onclick="viewSellerOrder('${order.id}')">

          View Details

        </button>

      </div>

    `;

  });

}
// ==========================================
// View Seller Order
// ==========================================

const sellerOrderDetailsContainer =
document.getElementById("sellerOrderDetailsContainer");

window.viewSellerOrder = function(orderId){

selectedOrder =
sellerOrders.find(order => order.id === orderId);

if(!selectedOrder) return;

let html = `

<h3>Order #${selectedOrder.id.substring(0,8)}</h3>

<p><strong>Status:</strong> ${selectedOrder.status}</p>

<p><strong>Buyer:</strong> ${selectedOrder.customerName}</p>

<p><strong>Email:</strong> ${selectedOrder.customerEmail}</p>

<p><strong>Phone:</strong> ${selectedOrder.customerPhone}</p>

<p><strong>Address:</strong> ${selectedOrder.shippingAddress}</p>

<hr>

<h4>Products</h4>

`;

(selectedOrder.products || []).forEach(product=>{

const price =
Number(product.discountPrice || product.price || 0);

html += `

<div class="seller-product-item">

<p><strong>${product.productName}</strong></p>

<p>Quantity: ${product.quantity}</p>

<p>Price: Rs. ${price}</p>

</div>

`;

});

html += `

<hr>

<p><strong>Grand Total:</strong> Rs. ${selectedOrder.grandTotal}</p>

`;

sellerOrderDetailsContainer.innerHTML = html;

// Update tracking

["Pending","Accepted","Shipped","Completed"].forEach(step=>{

const el =
document.getElementById("sellerStep"+step);

if(el){

el.classList.remove("active");

}

});

const active =
document.getElementById("sellerStep"+selectedOrder.status);

if(active){

active.classList.add("active");

}

document
.getElementById("sellerOrderDetailsSection")
.scrollIntoView({
behavior:"smooth"
});

};
// ==========================================
// Order Status Management
// Part 5 / 8
// ==========================================

const acceptOrderBtn =
document.getElementById("acceptOrderBtn");

const rejectOrderBtn =
document.getElementById("rejectOrderBtn");

const shipOrderBtn =
document.getElementById("shipOrderBtn");

const completeOrderBtn =
document.getElementById("completeOrderBtn");

// ==========================================
// Update Order Status
// ==========================================

async function updateOrderStatus(status){

try{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

await updateDoc(

doc(db,"orders",selectedOrder.id),

{

status: status

}

);

selectedOrder.status = status;

await loadSellerOrders();

window.viewSellerOrder(selectedOrder.id);

alert("Order updated successfully.");

}

catch(error){

console.error(error);

alert(error.message);

}

}

// ==========================================
// Button Events
// ==========================================

if(acceptOrderBtn){

acceptOrderBtn.addEventListener("click",()=>{

updateOrderStatus("Accepted");

});

}

if(rejectOrderBtn){

rejectOrderBtn.addEventListener("click",()=>{

updateOrderStatus("Rejected");

});

}

if(shipOrderBtn){

shipOrderBtn.addEventListener("click",()=>{

updateOrderStatus("Shipped");

});

}

if(completeOrderBtn){

completeOrderBtn.addEventListener("click",()=>{

updateOrderStatus("Completed");

});

}
// ==========================================
// Search + Filter + Summary
// Part 6 / 8
// ==========================================

// ==========================================
// Summary
// ==========================================

function updateSellerSummary(){

if(sellerTotalOrders){

sellerTotalOrders.textContent =
sellerOrders.length;

}

if(sellerPendingOrders){

sellerPendingOrders.textContent =

sellerOrders.filter(order=>
order.status==="Pending"
).length;

}

if(sellerCompletedOrders){

sellerCompletedOrders.textContent =

sellerOrders.filter(order=>
order.status==="Completed"
).length;

}

}

// ==========================================
// Search + Filter
// ==========================================

function applySellerFilters(){

const search =
sellerOrderSearch.value.trim().toLowerCase();

const status =
sellerStatusFilter.value;

const cards =
document.querySelectorAll(".seller-order-card");

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

if(sellerOrderSearch){

sellerOrderSearch.addEventListener(
"input",
applySellerFilters
);

}

if(sellerStatusFilter){

sellerStatusFilter.addEventListener(
"change",
applySellerFilters
);

}
// ==========================================
// Extra Seller Actions
// Part 7 / 8
// ==========================================

const printInvoiceBtn =
document.getElementById("printInvoiceBtn");

const contactBuyerBtn =
document.getElementById("contactBuyerBtn");

const sellerNotes =
document.getElementById("sellerNotes");

// ==========================================
// Print Invoice
// ==========================================

if(printInvoiceBtn){

printInvoiceBtn.addEventListener("click",()=>{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

window.print();

});

}

// ==========================================
// Contact Buyer
// ==========================================

if(contactBuyerBtn){

contactBuyerBtn.addEventListener("click",()=>{

if(!selectedOrder){

alert("Please select an order first.");

return;

}

alert(
`Buyer Contact

Name: ${selectedOrder.customerName}

Phone: ${selectedOrder.customerPhone}

Email: ${selectedOrder.customerEmail}`
);

});

}

// ==========================================
// Seller Notes
// ==========================================

if(sellerNotes){

sellerNotes.addEventListener("input",()=>{

if(selectedOrder){

selectedOrder.localSellerNotes =
sellerNotes.value;

}

});

}
// ==========================================
// PrimeMart Seller Orders
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Refresh
// ==========================================

async function refreshSellerOrders(){

await loadSellerOrders();

}

// ==========================================
// Global
// ==========================================

window.refreshSellerOrders = refreshSellerOrders;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", async()=>{

console.log("PrimeMart Seller Orders Ready");

if(currentUser){

await refreshSellerOrders();

}

});

// ==========================================
// PrimeMart Seller Orders
// Firebase v3.0
// Firestore Ready
// Commercial Version
// ==========================================
