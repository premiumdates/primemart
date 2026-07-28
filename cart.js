// =====================================================
// PrimeMart Commercial Marketplace
// Cart System v2.0
// Part 1 / 3
// =====================================================

import { auth, db } from "./firebase-config.js";

import {
collection,
query,
where,
onSnapshot,
doc,
getDoc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =====================================================
// STATE
// =====================================================

let currentUser = null;

let cartItems = [];

let unsubscribeCart = null;

const DELIVERY_FEE = 250;

// =====================================================
// DOM
// =====================================================

const cartContainer =
document.getElementById("cartItems");

const emptyCart =
document.getElementById("emptyCart");

const totalItems =
document.getElementById("totalItems");

const subtotal =
document.getElementById("subtotal");

const delivery =
document.getElementById("deliveryCharges");

const grandTotal =
document.getElementById("grandTotal");

const checkoutBtn =
document.getElementById("checkoutBtn");

// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

startCartListener();

});

// =====================================================
// LIVE CART
// =====================================================

function startCartListener(){

if(unsubscribeCart){

unsubscribeCart();

}

const q=query(

collection(db,"cart"),

where("buyerId","==",currentUser.uid)

);

unsubscribeCart=onSnapshot(

q,

async(snapshot)=>{

cartItems=[];

for(const cartDoc of snapshot.docs){

const cart=cartDoc.data();

const productRef=doc(

db,

"products",

cart.productId

);

const productSnap=

await getDoc(productRef);

if(productSnap.exists()){

cartItems.push({

cartId:cartDoc.id,

...cart,

product:productSnap.data()

});

}

}

renderCart();

calculateTotals();

}

);

}

// =====================================================
// RENDER
// =====================================================

function renderCart(){

if(cartItems.length===0){

cartContainer.style.display="none";

emptyCart.style.display="block";

return;

}

cartContainer.style.display="block";

emptyCart.style.display="none";

cartContainer.innerHTML="";

cartItems.forEach(item=>{

const p=item.product;

cartContainer.innerHTML+=`

<div class="cart-item">

<img
src="${p.images?.[0]||'default-product.png'}">

<div class="cart-details">

<h3>${p.productName}</h3>

<p>

Rs. ${p.discountPrice||p.price}

</p>

<div class="qty">

<button
onclick="decreaseQty('${item.cartId}')">

-

</button>

<span>

${item.quantity}

</span>

<button
onclick="increaseQty('${item.cartId}')">

+

</button>

</div>

<button
onclick="removeItem('${item.cartId}')">

Remove

</button>

</div>

</div>

`;

});

}
// =====================================================
// PrimeMart Commercial Marketplace
// Cart System v2.0
// Part 2 / 3
// =====================================================

// =====================================================
// QUANTITY +
// =====================================================

window.increaseQty = async function(cartId){

try{

const item = cartItems.find(x=>x.cartId===cartId);

if(!item) return;

await updateDoc(

doc(db,"cart",cartId),

{

quantity:item.quantity+1

}

);

}

catch(error){

console.error(error);

alert(error.message);

}

};

// =====================================================
// QUANTITY -
// =====================================================

window.decreaseQty = async function(cartId){

try{

const item = cartItems.find(x=>x.cartId===cartId);

if(!item) return;

if(item.quantity<=1) return;

await updateDoc(

doc(db,"cart",cartId),

{

quantity:item.quantity-1

}

);

}

catch(error){

console.error(error);

alert(error.message);

}

};

// =====================================================
// REMOVE ITEM
// =====================================================

window.removeItem = async function(cartId){

const ok = confirm(

"Remove this product from cart?"

);

if(!ok) return;

try{

await deleteDoc(

doc(db,"cart",cartId)

);

}

catch(error){

console.error(error);

alert(error.message);

}

};

// =====================================================
// TOTALS
// =====================================================

function calculateTotals(){

let qty=0;

let sub=0;

cartItems.forEach(item=>{

qty += item.quantity;

const price = Number(

item.product.discountPrice ||

item.product.price ||

0

);

sub += price * item.quantity;

});

const grand = sub + DELIVERY_FEE;

if(totalItems){

totalItems.textContent = qty;

}

if(subtotal){

subtotal.textContent =

`Rs. ${sub.toLocaleString()}`;

}

if(delivery){

delivery.textContent =

`Rs. ${DELIVERY_FEE.toLocaleString()}`;

}

if(grandTotal){

grandTotal.textContent =

`Rs. ${grand.toLocaleString()}`;

}

}

// =====================================================
// CHECKOUT
// =====================================================

if(checkoutBtn){

checkoutBtn.addEventListener("click",()=>{

if(cartItems.length===0){

alert("Your cart is empty.");

return;

}

window.location.href="checkout.html";

});

}
// =====================================================
// PrimeMart Commercial Marketplace
// Cart System v2.0
// Part 3 / 3 (Final)
// =====================================================

// =====================================================
// REFRESH
// =====================================================

async function refreshCart(){

if(currentUser){

startCartListener();

}

}

window.refreshCart = refreshCart;

// =====================================================
// CONTINUE SHOPPING
// =====================================================

window.continueShopping = function(){

window.location.href = "index.html";

};

// =====================================================
// SUPPORT
// =====================================================

const contactSupportBtn =
document.getElementById("contactSupportBtn");

if(contactSupportBtn){

contactSupportBtn.addEventListener("click",()=>{

alert(
"PrimeMart Support will be available soon."
);

});

}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded",()=>{

console.log(
"PrimeMart Cart Commercial v2 Loaded Successfully"
);

});

// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(()=>{

if(currentUser){

refreshCart();

}

},30000);

// =====================================================
// END OF FILE
// PrimeMart Cart Commercial v2
// Stable Architecture
// Firebase Firestore Ready
// =====================================================
