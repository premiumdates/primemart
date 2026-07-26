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

const addBtn = document.getElementById("addBtn");
const table = document.getElementById("productTable");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");

let editingId = null;
async function loadProducts() {
  table.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  document.getElementById("productCount").innerHTML = snapshot.size;

  snapshot.forEach((docSnap) => {
    const p = docSnap.data();

    table.innerHTML += `
      <tr>
        <td>📦</td>
        <td>${p.name}</td>
        <td>Rs. ${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="editProduct('${docSnap.id}','${p.name}','${p.price}','${p.stock}','${p.category}','${p.description || ""}')">
            Edit
          </button>

          <button onclick="deleteProduct('${docSnap.id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

loadProducts();
addBtn.onclick = async function () {
alert("Button Clicked");
  const product = {
    name: nameInput.value,
    price: priceInput.value,
    stock: stockInput.value,
    category: categoryInput.value,
    description: descriptionInput.value
  };

  if (
    product.name == "" ||
    product.price == "" ||
    product.stock == ""
  ) {
    alert("تمام فیلڈز بھریں");
    return;
  }

  if (editingId == null) {

    try {

        await addDoc(collection(db, "products"), product);
        alert("Product Added Successfully");

    } catch (error) {

        alert(error.message);

    }

} else {

    await updateDoc(doc(db, "products", editingId), product);

    editingId = null;
    addBtn.innerHTML = "Add Product";
  }

  nameInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  categoryInput.value = "";
  descriptionInput.value = "";

  loadProducts();
};

window.deleteProduct = async function (id) {

  if (confirm("کیا آپ واقعی یہ پروڈکٹ حذف کرنا چاہتے ہیں؟")) {

    await deleteDoc(doc(db, "products", id));

    loadProducts();
  }
};

window.editProduct = function (
  id,
  name,
  price,
  stock,
  category,
  description
) {

  editingId = id;

  nameInput.value = name;
  priceInput.value = price;
  stockInput.value = stock;
  categoryInput.value = category;
  descriptionInput.value = description;

  addBtn.innerHTML = "Update Product";
};
