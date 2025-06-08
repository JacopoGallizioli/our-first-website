document.addEventListener("DOMContentLoaded", () => {
  const tableBtn = document.getElementById("show-table");
  const mapBtn = document.getElementById("show-map");
  const tableSection = document.getElementById("table-section");
  const mapSection = document.getElementById("map-section");

  let mapInitialized = false;
  let map;

  function initMap() {
    map = L.map("map-section").setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Example marker: Hanoi
    const hanoiMarker = L.marker([21.0285, 105.8542]).addTo(map);
    hanoiMarker.bindPopup(`
      <div style="text-align:center;">
        <img src="HCM.jpg" style="width:100px;height:100px;"><br>
        Hanoi
      </div>
    `);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

  // Show table by default on page load
  tableSection.style.display = "block";
  mapSection.style.display = "none";
  tableBtn.classList.add("active");
  mapBtn.classList.remove("active");

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

    if (!mapInitialized) {
      initMap();
      mapInitialized = true;
    } else {
      // If map is already initialized, just invalidate size to fix display
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  });
});
