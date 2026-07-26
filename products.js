import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCyEX9kj1lbhWJNUkJC4lraKAZFNj3PuWE",
authDomain: "premium-dates.firebaseapp.com",
projectId: "premium-dates",
storageBucket: "premium-dates.firebasestorage.app",
messagingSenderId: "696354648755",
appId: "1:696354648755:web:ff911e82623f985f44f6c6",
measurementId: "G-EPTZDDLZTM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("productsContainer");

async function loadProducts(){

const snapshot = await getDocs(collection(db,"products"));

container.innerHTML="";

snapshot.forEach(doc=>{

const p = doc.data();

container.innerHTML += `
<div class="card">

<h3>${p.name}</h3>

<p>Rs. ${p.price}</p>

<p>${p.category}</p>

<button>Buy Now</button>

</div>
`;

});

}

loadProducts();
