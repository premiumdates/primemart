import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const addBtn = document.getElementById("addBtn");
const table = document.getElementById("productTable");

let products = [];

addBtn.onclick = function () {

const name = document.getElementById("name").value;
const price = document.getElementById("price").value;
const stock = document.getElementById("stock").value;
const category = document.getElementById("category").value;

if(name=="" || price=="" || stock==""){
alert("Fill all fields");
return;
}

products.push({
name,
price,
stock,
category
});

showProducts();

};

function showProducts(){

table.innerHTML="";

products.forEach((p,index)=>{

table.innerHTML += `
<tr>

<td>📦</td>

<td>${p.name}</td>

<td>Rs. ${p.price}</td>

<td>${p.stock}</td>

<td>

<button onclick="editProduct(${index})">Edit</button>

<button onclick="deleteProduct(${index})">Delete</button>

</td>

</tr>
`;

});

document.getElementById("productCount").innerHTML=products.length;

}

function deleteProduct(index){

products.splice(index,1);

showProducts();

}

function editProduct(index){

document.getElementById("name").value=products[index].name;
document.getElementById("price").value=products[index].price;
document.getElementById("stock").value=products[index].stock;

products.splice(index,1);

showProducts();

}
