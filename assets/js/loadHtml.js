// Load header/footer
      function loadHTML(id, file) {
        fetch(file)
          .then((r) => r.text())
          .then((data) => (document.getElementById(id).innerHTML = data))
          .catch((err) => console.error(`Fout bij laden van ${file}:`, err));
      }
      loadHTML("header", "includes/header.html");
