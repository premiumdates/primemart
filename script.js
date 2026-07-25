const products = [
{
name:"Ajwa Dates",
price:"Rs. 2,500 / Kg",
image:"https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600"
},
{
name:"Medjool Dates",
price:"Rs. 3,500 / Kg",
image:"https://images.unsplash.com/photo-1571687949920-8b0d1c9e4f5f?w=600"
},
{
name:"Mabroom Dates",
price:"Rs. 2,900 / Kg",
image:"https://images.unsplash.com/photo-1514512364185-4c2b1d5d0e44?w=600"
}
];

const container=document.getElementById("products");

products.forEach(product=>{

container.innerHTML+=`

<div class="card">

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>${product.price}</p>

<button>Buy Now</button>

</div>

`;

});
