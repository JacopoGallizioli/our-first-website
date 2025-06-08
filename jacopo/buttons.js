document.addEventListener("DOMContentLoaded", () => {
  const tableBtn = document.getElementById("show-table");
  const mapBtn = document.getElementById("show-map");
  const tableSection = document.getElementById("table-section");
  const mapSection = document.getElementById("map-section");

  if (tableBtn && mapBtn && tableSection && mapSection) {
    tableBtn.addEventListener("click", () => {
      tableSection.style.display = "block";
      mapSection.style.display = "none";
    });

    mapBtn.addEventListener("click", () => {
      tableSection.style.display = "none";
      mapSection.style.display = "block";
    });
  }
});

tableBtn.addEventListener("click", () => {
  tableSection.style.display = "block";
  mapSection.style.display = "none";
  tableBtn.classList.add("active");
  mapBtn.classList.remove("active");
});

mapBtn.addEventListener("click", () => {
  tableSection.style.display = "none";
  mapSection.style.display = "block";
  mapBtn.classList.add("active");
  tableBtn.classList.remove("active");
});
