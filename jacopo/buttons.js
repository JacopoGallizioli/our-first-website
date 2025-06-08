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

      // Important: let main.js initialize the map only once
      const event = new Event("initialize-map");
      window.dispatchEvent(event);
    });
  }
});
