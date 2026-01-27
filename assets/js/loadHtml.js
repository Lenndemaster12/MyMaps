function loadHTML(id, file, callback) {
  fetch(file)
    .then((r) => r.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); // NAVIGATIE INITIATIE
    })
    .catch((err) => console.error(`Fout bij laden van ${file}:`, err));
}

// Load header en initialiseer navbar active links
loadHTML("header", "includes/header.html", () => {
  const links = document.querySelectorAll(".nav__link");

  function setActive() {
    const hash = window.location.hash || "#home";
    links.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === hash);
    });
  }

  setActive();
  window.addEventListener("hashchange", setActive);
});
