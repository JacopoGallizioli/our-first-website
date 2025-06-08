document.addEventListener("DOMContentLoaded", () => {
  const mapButton = document.getElementById("show-map");
  const mapSection = document.getElementById("map-section");
  let mapInitialized = false;
  let map;

  if (mapButton && mapSection) {
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
            <img src="HCM.jpg" style="width:100px;height:100px;"><br>
            Hanoi
          </div>
        `);

        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        mapInitialized = true;
      }
    });
  }
});
