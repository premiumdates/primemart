// ==========================================
// PrimeMart Chat
// chat.js
// Part 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
collection,
query,
orderBy,
onSnapshot,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================

let currentUser = null;
let currentChatId = null;

// ==========================================
// Elements
// ==========================================

const messagesContainer =
document.getElementById("messagesContainer");

const messageInput =
document.getElementById("messageInput");

const sendMessageBtn =
document.getElementById("sendMessageBtn");

// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser = user;

// Chat ID will later come from URL
const params = new URLSearchParams(window.location.search);

currentChatId = params.get("chatId");

if(currentChatId){

listenMessages();

}

});
// ==========================================
// PrimeMart Chat
// Part 2 / 8
// Real-time Message Listener
// ==========================================

function listenMessages(){

const messagesRef = collection(
db,
"chats",
currentChatId,
"messages"
);

const messagesQuery = query(
messagesRef,
orderBy("createdAt","asc")
);

onSnapshot(messagesQuery,(snapshot)=>{

messagesContainer.innerHTML = "";

snapshot.forEach((document)=>{

const message = document.data();

const own =
message.senderId === currentUser.uid;

messagesContainer.innerHTML += `

<div class="message ${own ? "sent" : "received"}">

<p>

${message.text || ""}

</p>

<span class="message-time">

${
message.createdAt?.toDate
? message.createdAt.toDate().toLocaleTimeString()
: ""
}

</span>

</div>

`;

});

messagesContainer.scrollTop =
messagesContainer.scrollHeight;

});

}
// ==========================================
// PrimeMart Chat
// Part 3 / 8
// Send Message
// ==========================================

async function sendMessage(){

try{

const text = messageInput.value.trim();

if(text==="") return;

await addDoc(

collection(
db,
"chats",
currentChatId,
"messages"
),

{

senderId: currentUser.uid,

text: text,

type: "text",

read: false,

createdAt: serverTimestamp()

}

);

messageInput.value = "";

}

catch(error){

console.error(error);

alert(error.message);

}

}

// ==========================================
// Send Events
// ==========================================

if(sendMessageBtn){

sendMessageBtn.addEventListener("click",sendMessage);

}

if(messageInput){

messageInput.addEventListener("keypress",(event)=>{

if(event.key==="Enter"){

event.preventDefault();

sendMessage();

}

});

}
// ==========================================
// PrimeMart Chat
// Part 4 / 8
// Read Status + Typing Indicator
// ==========================================

const typingIndicator =
document.getElementById("typingIndicator");

const chatUserStatus =
document.getElementById("chatUserStatus");

// ==========================================
// Typing Indicator
// ==========================================

let typingTimeout = null;

if(messageInput){

messageInput.addEventListener("input",()=>{

if(typingIndicator){

typingIndicator.textContent = "Typing...";

}

clearTimeout(typingTimeout);

typingTimeout = setTimeout(()=>{

if(typingIndicator){

typingIndicator.textContent = "";

}

},1500);

});

}

// ==========================================
// Read Status (UI)
// ==========================================

function updateReadStatus(isRead){

const readStatus =
document.getElementById("readStatus");

if(readStatus){

readStatus.textContent =
isRead ? "Read" : "Unread";

}

}

// ==========================================
// Online Status (Temporary)
// ==========================================

function updateOnlineStatus(isOnline){

if(chatUserStatus){

chatUserStatus.textContent =
isOnline ? "Online" : "Offline";

}

}

// Demo online status
updateOnlineStatus(true);
// ==========================================
// PrimeMart Chat
// Part 5 / 8
// Image Preview + Share Media
// ==========================================

const chatImageInput =
document.getElementById("chatImageInput");

const uploadImageBtn =
document.getElementById("uploadImageBtn");

const imagePreviewSection =
document.getElementById("imagePreviewSection");

const imagePreview =
document.getElementById("imagePreview");

const removeImageBtn =
document.getElementById("removeImageBtn");

// ==========================================
// Open File Picker
// ==========================================

if(uploadImageBtn){

uploadImageBtn.addEventListener("click",()=>{

chatImageInput.click();

});

}

// ==========================================
// Preview Selected Image
// ==========================================

if(chatImageInput){

chatImageInput.addEventListener("change",(event)=>{

const file = event.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(e){

imagePreview.src = e.target.result;

imagePreviewSection.style.display = "block";

};

reader.readAsDataURL(file);

});

}

// ==========================================
// Remove Preview
// ==========================================

if(removeImageBtn){

removeImageBtn.addEventListener("click",()=>{

chatImageInput.value = "";

imagePreview.src = "";

imagePreviewSection.style.display = "none";

});

}
// ==========================================
// PrimeMart Chat
// Part 6 / 8
// Emoji + Clear Chat + Block User
// ==========================================

const emojiBtn =
document.getElementById("emojiBtn");

const clearChatBtn =
document.getElementById("clearChatBtn");

const blockUserBtn =
document.getElementById("blockUserBtn");

// ==========================================
// Emoji
// ==========================================

if(emojiBtn){

emojiBtn.addEventListener("click",()=>{

messageInput.value += "😊";

messageInput.focus();

});

}

// ==========================================
// Clear Chat (UI Only)
// ==========================================

if(clearChatBtn){

clearChatBtn.addEventListener("click",()=>{

const ok = confirm(
"Clear chat messages from this screen?"
);

if(!ok) return;

messagesContainer.innerHTML = "";

});

}

// ==========================================
// Block User (Placeholder)
// ==========================================

if(blockUserBtn){

blockUserBtn.addEventListener("click",()=>{

const ok = confirm(
"Block this user?"
);

if(ok){

alert("User blocked feature will be connected in a future update.");

}

});

}
// ==========================================
// PrimeMart Chat
// Part 7 / 8
// Calls + Refresh + Recent Activity
// ==========================================

const voiceCallBtn =
document.getElementById("voiceCallBtn");

const videoCallBtn =
document.getElementById("videoCallBtn");

// ==========================================
// Voice Call
// ==========================================

if(voiceCallBtn){

voiceCallBtn.addEventListener("click",()=>{

alert("Voice calling will be available in a future update.");

});

}

// ==========================================
// Video Call
// ==========================================

if(videoCallBtn){

videoCallBtn.addEventListener("click",()=>{

alert("Video calling will be available in a future update.");

});

}

// ==========================================
// Refresh Chat
// ==========================================

async function refreshChat(){

if(currentChatId){

listenMessages();

}

}

// ==========================================
// Recent Activity
// ==========================================

function loadRecentChatActivity(){

console.log("Recent chat activity loaded.");

}
// ==========================================
// PrimeMart Chat
// Part 8 / 8 (Final)
// ==========================================

// ==========================================
// Global Functions
// ==========================================

window.refreshChat = refreshChat;

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", async()=>{

console.log("PrimeMart Chat Ready");

if(currentUser && currentChatId){

await refreshChat();

loadRecentChatActivity();

}

});

// ==========================================
// Auto Refresh
// ==========================================

setInterval(async()=>{

if(currentUser && currentChatId){

await refreshChat();

}

},5000);

// ==========================================
// PrimeMart Chat
// Firebase v3.0
// Firestore Ready
// Commercial Version
// ==========================================
