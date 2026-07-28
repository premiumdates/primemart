// ==========================================
// PrimeMart Notifications
// notifications.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;

let notifications = [];

let selectedNotification = null;

// ==========================================
// Elements
// ==========================================

const notificationsContainer =
document.getElementById("notificationsContainer");

const totalNotifications =
document.getElementById("totalNotifications");

const unreadNotifications =
document.getElementById("unreadNotifications");

const todayNotifications =
document.getElementById("todayNotifications");

const emptyNotifications =
document.getElementById("emptyNotifications");

const notificationSearch =
document.getElementById("notificationSearch");

const notificationFilter =
document.getElementById("notificationFilter");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

await loadNotifications();

});
// ==========================================
// PrimeMart Notifications
// Part 2 / 8
// Load Notifications
// ==========================================

async function loadNotifications(){

try{

const q = query(

collection(db,"notifications"),

where("userId","==",currentUser.uid)

);

const snapshot = await getDocs(q);

notifications = [];

snapshot.forEach((document)=>{

notifications.push({

id: document.id,

...document.data()

});

});

renderNotifications();

updateNotificationSummary();

}

catch(error){

console.error(error);

alert(error.message);

}

}
// ==========================================
// PrimeMart Notifications
// Part 3 / 8
// Render Notifications
// ==========================================

const notificationDetailsContainer =
document.getElementById("notificationDetailsContainer");

function renderNotifications(){

if(!notificationsContainer) return;

notificationsContainer.innerHTML = "";

if(notifications.length===0){

emptyNotifications.style.display="block";
notificationsContainer.style.display="none";
return;

}

emptyNotifications.style.display="none";
notificationsContainer.style.display="block";

notifications.forEach((notification)=>{

const date =
notification.createdAt?.toDate
? notification.createdAt.toDate().toLocaleString()
: "N/A";

notificationsContainer.innerHTML += `

<div class="notification-card ${notification.read ? "read" : "unread"}">

<div class="notification-header">

<h3>${notification.title || "Notification"}</h3>

<span>${notification.type || "System"}</span>

</div>

<p>${notification.message || ""}</p>

<p class="notification-date">

${date}

</p>

<button onclick="viewNotification('${notification.id}')">

View

</button>

</div>

`;

});

}

// ==========================================
// View Notification
// ==========================================

window.viewNotification = function(notificationId){

selectedNotification =
notifications.find(n=>n.id===notificationId);

if(!selectedNotification) return;

notificationDetailsContainer.innerHTML = `

<h3>${selectedNotification.title}</h3>

<p>${selectedNotification.message}</p>

<p><strong>Type:</strong> ${selectedNotification.type}</p>

<p><strong>Status:</strong>
${selectedNotification.read ? "Read" : "Unread"}</p>

`;

document
.getElementById("notificationDetailsSection")
.scrollIntoView({
behavior:"smooth"
});

};
// ==========================================
// PrimeMart Notifications
// Part 4 / 8
// Mark Read + Delete + Summary
// ==========================================

const markAllReadBtn =
document.getElementById("markAllReadBtn");

const deleteAllBtn =
document.getElementById("deleteAllBtn");

// ==========================================
// Update Summary
// ==========================================

function updateNotificationSummary(){

if(totalNotifications){

totalNotifications.textContent =
notifications.length;

}

if(unreadNotifications){

unreadNotifications.textContent =

notifications.filter(n=>!n.read).length;

}

if(todayNotifications){

const today =
new Date().toDateString();

todayNotifications.textContent =

notifications.filter(n=>{

if(!n.createdAt?.toDate) return false;

return n.createdAt.toDate().toDateString()===today;

}).length;

}

}

// ==========================================
// Mark Notification As Read
// ==========================================

async function markNotificationRead(notificationId){

try{

await updateDoc(

doc(db,"notifications",notificationId),

{

read:true

}

);

await loadNotifications();

}

catch(error){

console.error(error);

}

}

// ==========================================
// Mark All As Read
// ==========================================

if(markAllReadBtn){

markAllReadBtn.addEventListener("click",async()=>{

for(const notification of notifications){

if(!notification.read){

await updateDoc(

doc(db,"notifications",notification.id),

{

read:true

}

);

}

}

await loadNotifications();

});

}

// ==========================================
// Delete All Notifications
// ==========================================

if(deleteAllBtn){

deleteAllBtn.addEventListener("click",async()=>{

const ok = confirm(
"Delete all notifications?"
);

if(!ok) return;

for(const notification of notifications){

await deleteDoc(

doc(db,"notifications",notification.id)

);

}

await loadNotifications();

});

}
// ==========================================
// PrimeMart Notifications
// Part 5 / 8
// Search + Filter + Auto Read
// ==========================================

// ==========================================
// Search + Filter
// ==========================================

function applyNotificationFilters(){

const search =
notificationSearch.value.trim().toLowerCase();

const filter =
notificationFilter.value.toLowerCase();

const cards =
document.querySelectorAll(".notification-card");

cards.forEach(card=>{

const text =
card.innerText.toLowerCase();

const type =
card.querySelector(".notification-header span")
?.innerText.toLowerCase() || "";

const matchSearch =
text.includes(search);

const matchFilter =
filter==="all" || type===filter;

card.style.display =
(matchSearch && matchFilter)
? "block"
: "none";

});

}

// ==========================================
// Events
// ==========================================

if(notificationSearch){

notificationSearch.addEventListener(
"input",
applyNotificationFilters
);

}

if(notificationFilter){

notificationFilter.addEventListener(
"change",
applyNotificationFilters
);

}

// ==========================================
// Auto Mark Read
// ==========================================

const previousViewNotification =
window.viewNotification;

window.viewNotification = async function(notificationId){

await markNotificationRead(notificationId);

previousViewNotification(notificationId);

};
// ==========================================
// PrimeMart Notifications
// Part 6 / 8
// Preferences + Mute
// ==========================================

const orderNotifications =
document.getElementById("orderNotifications");

const shippingNotifications =
document.getElementById("shippingNotifications");

const promotionNotifications =
document.getElementById("promotionNotifications");

const systemNotifications =
document.getElementById("systemNotifications");

const muteDuration =
document.getElementById("muteDuration");

// ==========================================
// Save Preferences
// ==========================================

function saveNotificationPreferences(){

const preferences = {

orders: orderNotifications?.checked || false,

shipping: shippingNotifications?.checked || false,

promotions: promotionNotifications?.checked || false,

system: systemNotifications?.checked || false,

mute: muteDuration?.value || "0"

};

localStorage.setItem(

"primemart_notification_preferences",

JSON.stringify(preferences)

);

}

// ==========================================
// Load Preferences
// ==========================================

function loadNotificationPreferences(){

const saved = localStorage.getItem(

"primemart_notification_preferences"

);

if(!saved) return;

const preferences = JSON.parse(saved);

if(orderNotifications)
orderNotifications.checked = preferences.orders;

if(shippingNotifications)
shippingNotifications.checked = preferences.shipping;

if(promotionNotifications)
promotionNotifications.checked = preferences.promotions;

if(systemNotifications)
systemNotifications.checked = preferences.system;

if(muteDuration)
muteDuration.value = preferences.mute;

}

// ==========================================
// Events
// ==========================================

[
orderNotifications,
shippingNotifications,
promotionNotifications,
systemNotifications,
muteDuration

].forEach(element=>{

if(element){

element.addEventListener(

"change",

saveNotificationPreferences

);

}

});
// ==========================================
// PrimeMart Notifications
// Part 7 / 8
// Recent Activity + Support + Refresh
// ==========================================

const recentActivityContainer =
document.getElementById("recentActivityContainer");

const notificationSupportBtn =
document.getElementById("notificationSupportBtn");

// ==========================================
// Recent Activity
// ==========================================

function loadRecentActivity(){

if(!recentActivityContainer) return;

recentActivityContainer.innerHTML = "";

notifications.slice(0,10).forEach(notification=>{

const date =
notification.createdAt?.toDate
? notification.createdAt.toDate().toLocaleString()
: "N/A";

recentActivityContainer.innerHTML += `

<div class="activity-card">

<h4>${notification.title}</h4>

<p>${date}</p>

</div>

`;

});

}

// ==========================================
// Support
// ==========================================

if(notificationSupportBtn){

notificationSupportBtn.addEventListener("click",()=>{

alert("PrimeMart Support will be available soon.");

});

}

// ==========================================
// Refresh
// ==========================================

async function refreshNotifications(){

await loadNotifications();

loadRecentActivity();

loadNotificationPreferences();

}
// ==========================================
// PrimeMart Notifications
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Global Functions
// ==========================================

window.refreshNotifications = refreshNotifications;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", async()=>{

console.log("PrimeMart Notifications Ready");

loadNotificationPreferences();

if(currentUser){

await refreshNotifications();

}

});

// ==========================================
// Auto Refresh Every 60 Seconds
// ==========================================

setInterval(async()=>{

if(currentUser){

await refreshNotifications();

}

},60000);

// ==========================================
// PrimeMart Notifications
// Firebase v3.0
// Firestore Ready
// Commercial Version
// ==========================================
