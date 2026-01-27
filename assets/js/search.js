document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");

    input.addEventListener("input", () => {
        const q = input.value.toLowerCase();
        document.querySelectorAll(".route-card").forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(q) ? "block" : "none";
        });
    });
});
