





// -------------------------------
// Search/filter events | events.php
// -------------------------------
const form = document.getElementById("content");
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchContainer = document.querySelector(".search-container");
const eventsContainer = document.querySelector(".routes-container");
const cards = document.querySelectorAll(".route-card");

form.addEventListener("submit", e => e.preventDefault());

const expand = () => {
    const isOpen = searchBtn.classList.contains("close");
    if(!isOpen){
        searchContainer.style.margin = "60px 0";
        eventsContainer.style.maxHeight = "71vh";
        searchBtn.classList.add("close");
        input.classList.add("square");
        input.focus({ preventScroll: true });
        //input.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
        searchBtn.classList.remove("close");
        input.classList.remove("square");
        setTimeout(() => {
            searchContainer.style.margin = "0px 0";
            eventsContainer.style.maxHeight = "79vh";
            input.value = "";
            cards.forEach(card => card.style.display = "block");
        }, 400);
    }
};

searchBtn.addEventListener("click", expand);

input.addEventListener("input", function() {
    const query = this.value.toLowerCase();
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? "block" : "none";
    });
});

