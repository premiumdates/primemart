document.addEventListener("DOMContentLoaded", () => {

    // ===== Search =====
    const search = document.getElementById("searchBox");
    const cards = document.querySelectorAll(".card");

    if (search) {

        search.addEventListener("keyup", () => {

            const value = search.value.toLowerCase();

            cards.forEach((card) => {

                if (card.innerText.toLowerCase().includes(value)) {

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }

    // ===== Open Store =====
    const openStoreBtn = document.getElementById("openStoreBtn");

    if (openStoreBtn) {

        openStoreBtn.addEventListener("click", () => {

            window.location.href = "signup.html";

        });

    }

});
