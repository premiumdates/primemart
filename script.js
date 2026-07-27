document.addEventListener("DOMContentLoaded", () => {

const search = document.getElementById("searchBox");

const cards = document.querySelectorAll(".card");

search.addEventListener("keyup", function () {

let value = search.value.toLowerCase();

cards.forEach((card)=>{

if(card.innerText.toLowerCase().includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

});
const openStoreBtn = document.getElementById("openStoreBtn");

if (openStoreBtn) {
    openStoreBtn.addEventListener("click", function () {
        window.location.href = "signup.html";
    });
}
