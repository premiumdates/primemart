// ==========================================
// PrimeMart Create Store v2.0
// Part 1 / 6
// ==========================================

import { auth, db, storage } from "./firebase-config.js";

import {
collection,
addDoc,
query,
where,
getDocs,
doc,
updateDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================
// Global Variables
// ==========================================

let currentUser = null;

let logoURL = "";

let bannerURL = "";

// ==========================================
// HTML Elements
// ==========================================

const form =
document.getElementById("createStoreForm");

const storeName =
document.getElementById("storeName");

const storeDescription =
document.getElementById("storeDescription");

const paymentMethod =
document.getElementById("paymentMethod");

const paymentNumber =
document.getElementById("paymentNumber");

const storeCategory =
document.getElementById("storeCategory");

const logoInput =
document.getElementById("storeLogo");

const bannerInput =
document.getElementById("storeBanner");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

// اگلا Part میں Store Check ہوگا

});
// ==========================================
// PrimeMart Create Store v2.0
// Part 2 / 6
// ==========================================

// ==========================================
// Check Existing Store
// ==========================================

async function checkExistingStore(){

try{

const q = query(

collection(db,"stores"),

where("owner","==",currentUser.uid)

);

const snapshot = await getDocs(q);

if(!snapshot.empty){

window.location.href="seller-dashboard.html";

return;

}

}catch(error){

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

currentUser = user;

await checkExistingStore();

});

// ==========================================
// Upload Store Logo
// ==========================================

async function uploadLogo(file){

if(!file) return "";

const path =

`stores/${currentUser.uid}/logo_${Date.now()}_${file.name}`;

const storageRef = ref(storage,path);

await uploadBytes(storageRef,file);

logoURL = await getDownloadURL(storageRef);

return logoURL;

}

// ==========================================
// Upload Store Banner
// ==========================================

async function uploadBanner(file){

if(!file) return "";

const path =

`stores/${currentUser.uid}/banner_${Date.now()}_${file.name}`;

const storageRef = ref(storage,path);

await uploadBytes(storageRef,file);

bannerURL = await getDownloadURL(storageRef);

return bannerURL;

}
// ==========================================
// PrimeMart Create Store v2.0
// Part 3 / 6
// ==========================================

// ==========================================
// Create Store
// ==========================================

if(form){

form.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

const logoFile = logoInput.files[0];

const bannerFile = bannerInput.files[0];

// Upload Files

const logo = await uploadLogo(logoFile);

const banner = await uploadBanner(bannerFile);

// Save Store

const storeRef = await addDoc(

collection(db,"stores"),

{

owner:currentUser.uid,

name:storeName.value,

description:storeDescription.value,

category:storeCategory.value,

paymentMethod:paymentMethod.value,

paymentNumber:paymentNumber.value,

logo:logo,

banner:banner,

status:"Active",

verified:false,

followers:0,

rating:0,

reviews:0,

products:0,

orders:0,

createdAt:serverTimestamp()

}

);

// Update User Role

await updateDoc(

doc(db,"users",currentUser.uid),

{

role:"seller",

storeCreated:true,

storeId:storeRef.id

}

);

alert("🎉 Store Created Successfully");

window.location.href="seller-dashboard.html";

}catch(error){

console.error(error);

alert(error.message);

}

});

}
// ==========================================
// PrimeMart Create Store v2.0
// Part 4 / 6
// Validation System
// ==========================================

// ==========================================
// Payment Validation
// ==========================================

function validatePayment(){

const method = paymentMethod.value.trim();

const number = paymentNumber.value.trim();

if(method===""){

alert("Please select Payment Method");

return false;

}

if(number===""){

alert("Please enter Payment Number");

return false;

}

if(method==="JazzCash" || method==="EasyPaisa"){

if(number.length!==11){

alert("Mobile Wallet number must be 11 digits.");

return false;

}

}

if(method==="Bank"){

if(number.length<20){

alert("Please enter a valid IBAN.");

return false;

}

}

return true;

}

// ==========================================
// Store Validation
// ==========================================

function validateStore(){

if(storeName.value.trim()===""){

alert("Please enter Store Name");

return false;

}

if(storeDescription.value.trim()===""){

alert("Please enter Store Description");

return false;

}

if(storeCategory.value===""){

alert("Please select Store Category");

return false;

}

if(!validatePayment()){

return false;

}

return true;

}

// ==========================================
// Duplicate Store Name Check
// ==========================================

async function checkDuplicateStore(){

const q = query(

collection(db,"stores"),

where("name","==",storeName.value.trim())

);

const snapshot = await getDocs(q);

return !snapshot.empty;

}
// ==========================================
// PrimeMart Create Store v2.0
// Part 5 / 6
// Final Validation + Safe Create
// ==========================================

// ==========================================
// Enhanced Submit
// ==========================================

if(form){

form.addEventListener("submit", async(e)=>{

e.preventDefault();

try{

// Basic Validation

if(!validateStore()){

return;

}

// Duplicate Store Check

const duplicate = await checkDuplicateStore();

if(duplicate){

alert("Store name already exists. Please choose another name.");

return;

}

// Upload Logo

let logo = "";

if(logoInput.files.length>0){

logo = await uploadLogo(logoInput.files[0]);

}

// Upload Banner

let banner = "";

if(bannerInput.files.length>0){

banner = await uploadBanner(bannerInput.files[0]);

}

// Create Store

const storeRef = await addDoc(

collection(db,"stores"),

{

owner:currentUser.uid,

name:storeName.value.trim(),

description:storeDescription.value.trim(),

category:storeCategory.value,

paymentMethod:paymentMethod.value,

paymentNumber:paymentNumber.value,

logo,

banner,

status:"Active",

verified:false,

followers:0,

rating:0,

reviews:0,

products:0,

orders:0,

createdAt:serverTimestamp()

}

);

// Update User

await updateDoc(

doc(db,"users",currentUser.uid),

{

role:"seller",

storeCreated:true,

storeId:storeRef.id

}

);

alert("🎉 Store Created Successfully!");

window.location.href="seller-dashboard.html";

}

catch(error){

console.error(error);

alert(error.message);

}

});

}
// ==========================================
// PrimeMart Create Store v2.0
// Part 6 / 6
// Final Initialization
// ==========================================

// ==========================================
// Reset Form
// ==========================================

function resetStoreForm(){

if(form){

form.reset();

}

logoURL="";

bannerURL="";

}

// ==========================================
// Loading Helpers
// ==========================================

function disableForm(){

const btn=form.querySelector("button[type='submit']");

if(btn){

btn.disabled=true;

btn.innerText="Creating Store...";

}

}

function enableForm(){

const btn=form.querySelector("button[type='submit']");

if(btn){

btn.disabled=false;

btn.innerText="Create Store";

}

}

// ==========================================
// Future Ready
// ==========================================

window.validateStore = validateStore;

window.checkDuplicateStore = checkDuplicateStore;

window.uploadLogo = uploadLogo;

window.uploadBanner = uploadBanner;

// ==========================================
// PrimeMart Marketplace
// Create Store Module
// Firebase Version 2.0
// LocalStorage Removed
// ==========================================
