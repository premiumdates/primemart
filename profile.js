// ==========================================
// PrimeMart Profile v2.0
// Part 1 / 6
// ==========================================

import { auth, db, storage } from "./firebase-config.js";

import {
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================
// Global Variables
// ==========================================

let currentUser = null;

let currentProfile = null;

// ==========================================
// HTML Elements
// ==========================================

const profileImage =
document.getElementById("profileImage");

const profileImageInput =
document.getElementById("profileImageInput");

const profileName =
document.getElementById("profileName");

const profileEmail =
document.getElementById("profileEmail");

const profileRole =
document.getElementById("profileRole");

const saveProfileBtn =
document.getElementById("saveProfileBtn");

const logoutBtn =
document.getElementById("logoutBtn");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

// آگے Part 2 میں
// Profile Load ہوگا

});
// ==========================================
// PrimeMart Profile v2.0
// Part 2 / 6
// Load User Profile
// ==========================================

async function loadProfile(){

try{

const userRef = doc(db,"users",currentUser.uid);

const snapshot = await getDoc(userRef);

if(!snapshot.exists()){

alert("Profile not found.");

return;

}

currentProfile = snapshot.data();

profileName.textContent =
currentProfile.fullName || "PrimeMart User";

profileEmail.textContent =
currentProfile.email || "";

profileRole.textContent =
currentProfile.role || "Buyer";

if(currentProfile.profileImage){

profileImage.src =
currentProfile.profileImage;

}

// Fill Form

document.getElementById("fullName").value =
currentProfile.fullName || "";

document.getElementById("email").value =
currentProfile.email || "";

document.getElementById("phone").value =
currentProfile.phone || "";

document.getElementById("country").value =
currentProfile.country || "";

document.getElementById("province").value =
currentProfile.province || "";

document.getElementById("city").value =
currentProfile.city || "";

document.getElementById("postalCode").value =
currentProfile.postalCode || "";

document.getElementById("address").value =
currentProfile.address || "";

document.getElementById("paymentMethod").value =
currentProfile.paymentMethod || "";

document.getElementById("paymentNumber").value =
currentProfile.paymentNumber || "";

}

catch(error){

console.error(error);

alert(error.message);

}

}

// ==========================================
// Continue Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

await loadProfile();

});
// ==========================================
// PrimeMart Profile v2.0
// Part 3 / 6
// Save Profile
// ==========================================

async function saveProfile(){

try{

await updateDoc(

doc(db,"users",currentUser.uid),

{

fullName:
document.getElementById("fullName").value,

phone:
document.getElementById("phone").value,

country:
document.getElementById("country").value,

province:
document.getElementById("province").value,

city:
document.getElementById("city").value,

postalCode:
document.getElementById("postalCode").value,

address:
document.getElementById("address").value,

paymentMethod:
document.getElementById("paymentMethod").value,

paymentNumber:
document.getElementById("paymentNumber").value

}

);

alert("✅ Profile Updated Successfully");

await loadProfile();

}

catch(error){

console.error(error);

alert(error.message);

}

}

// ==========================================
// Save Button
// ==========================================

if(saveProfileBtn){

saveProfileBtn.addEventListener(

"click",

saveProfile

);

}
// ==========================================
// PrimeMart Profile v2.0
// Part 4 / 6
// Profile Image Upload
// ==========================================

async function uploadProfileImage(file){

try{

if(!file) return;

const path =
`users/${currentUser.uid}/profile_${Date.now()}_${file.name}`;

const storageRef = ref(storage,path);

await uploadBytes(storageRef,file);

const imageURL =
await getDownloadURL(storageRef);

await updateDoc(

doc(db,"users",currentUser.uid),

{

profileImage:imageURL

}

);

profileImage.src = imageURL;

alert("✅ Profile Image Updated");

}

catch(error){

console.error(error);

alert(error.message);

}

}

// ==========================================
// Image Change Event
// ==========================================

if(profileImageInput){

profileImageInput.addEventListener(

"change",

async(e)=>{

const file = e.target.files[0];

await uploadProfileImage(file);

}

);

}
// ==========================================
// PrimeMart Profile v2.0
// Part 5 / 6
// Logout + Account Stats
// ==========================================

// ==========================================
// Logout
// ==========================================

if(logoutBtn){

logoutBtn.addEventListener("click",async()=>{

try{

await signOut(auth);

window.location.href="login.html";

}

catch(error){

console.error(error);

alert(error.message);

}

});

}

// ==========================================
// Account Statistics
// ==========================================

async function loadAccountStats(){

try{

document.getElementById("totalOrders").textContent="0";

document.getElementById("totalWishlist").textContent="0";

document.getElementById("totalReviews").textContent="0";

document.getElementById("accountStatus").textContent="Active";

}catch(error){

console.error(error);

}

}

// ==========================================
// Seller Center
// ==========================================

const sellerBtn=document.getElementById("sellerCenterBtn");

if(sellerBtn){

sellerBtn.addEventListener("click",()=>{

if(currentProfile?.role==="seller"){

window.location.href="seller-dashboard.html";

}else{

window.location.href="create-store.html";

}

});

}

// ==========================================
// Initial Load
// ==========================================

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

await loadProfile();

await loadAccountStats();

});
// ==========================================
// PrimeMart Profile v2.0
// Part 6 / 6
// Final Initialization
// ==========================================

// Refresh profile after updates
async function refreshProfile(){

await loadProfile();

await loadAccountStats();

}

// Future Ready Functions
window.refreshProfile = refreshProfile;
window.saveProfile = saveProfile;
window.uploadProfileImage = uploadProfileImage;

// ==========================================
// PrimeMart Profile Module
// Firebase Version 2.0
// LocalStorage Removed
// Firestore Ready
// ==========================================
