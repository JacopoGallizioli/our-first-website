document.addEventListener("DOMContentLoaded", () => {
  const tableBtn = document.getElementById("show-table");
  const mapBtn = document.getElementById("show-map");
  const tableSection = document.getElementById("table-section");
  const mapSection = document.getElementById("map-section");

  let mapInitialized = false;
  let map;

  function initMap() {
    map = L.map("map-section").setView([30, 10], 2.5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const magnets = [
      { coords: [22.3569, 103.9023], img: "Sapa.jpg", name: "Sapa", country: "Vietnam" },
      { coords: [21.0285, 105.8542], img: "HCM.jpg", name: "Hanoi", country: "Vietnam" },
      { coords: [29.563, 106.5516], img: "Chongqing.jpg", name: "Chongqing", country: "China" },
      { coords: [44.4949, 11.3426], img: "Bologna.jpg", name: "Bologna", country: "Italy" },
      { coords: [20.2539, 105.9745], img: "Ninhbinh.jpg", name: "Ninh Binh", country: "Vietnam" },
      { coords: [20.9101, 107.1839], img: "Halong.jpg", name: "Ha Long", country: "Vietnam" },
      { coords: [49.4521, 11.0767], img: "Nuremberg.jpg", name: "Nürnberg", country: "Germany" },
      { coords: [49.7945, 9.9294], img: "Wurzburg.jpg", name: "Würzburg", country: "Germany" },
      { coords: [40.9951, 17.2164], img: "Polignano.jpg", name: "Polignano a Mare", country: "Italy" },
      { coords: [45.6252, 9.0371], img: "Saronno.jpg", name: "Saronno", country: "Italy" },
      { coords: [45.8081, 9.0852], img: "Como.jpg", name: "Como", country: "Italy" },
      { coords: [43.8378, 10.4951], img: "Lucca.jpg", name: "Lucca", country: "Italy" },
      { coords: [49.0069, 8.4037], img: "Karlsruhe.jpg", name: "Karlsruhe", country: "Germany" },
      { coords: [41.1171, 16.8719], img: "Bari.jpg", name: "Bari", country: "Italy" },
      { coords: [31.3156, 35.3530], img: "Masada.jpg", name: "Masada", country: "Israel" },
      { coords: [47.8095, 13.0550], img: "Salzburg.jpg", name: "Salzburg", country: "Austria" },
      { coords: [40.7842, 17.2400], img: "Alberobello.jpg", name: "Alberobello", country: "Italy" },
      { coords: [48.3705, 10.8978], img: "Augsburg.jpg", name: "Augsburg", country: "Germany" },
      { coords: [43.8711, 10.2430], img: "Viareggio.jpg", name: "Viareggio", country: "Italy" }
    ];

    magnets.forEach(magnet => {
      const marker = L.marker(magnet.coords).addTo(map);
      marker.bindPopup(`
        <div style="text-align:center;">
          <img src="${magnet.img}" style="width:100px;height:100px;"><br>
          <strong>${magnet.name}</strong><br>
          ${magnet.country}
        </div>
      `);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

  // Show table by default
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
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  });
});
