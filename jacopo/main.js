document.addEventListener("DOMContentLoaded", () => {
  const mapButton = document.getElementById("map-button");
  const mapSection = document.getElementById("map-section");
  let mapInitialized = false;
  let map; // Declare it outside to access in timeout

  mapButton.addEventListener("click", () => {
    mapSection.style.display = "block";

    if (!mapInitialized) {
      map = L.map("map-section").setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Example marker: Hanoi
      const hanoiMarker = L.marker([21.0285, 105.8542]).addTo(map);
      hanoiMarker.bindPopup(`
        <div style="text-align:center;">
          <img src="images/hanoi.jpg" style="width:100px;height:100px;"><br>
          Hanoi
        </div>
      `);

      // Fix size after showing map
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      mapInitialized = true;
    }
  });
});
