document.addEventListener("DOMContentLoaded", () => {
  const modal = document.createElement("div");
  modal.classList.add("image-modal");
  modal.innerHTML = `
    <div class="image-modal-overlay">
      <div class="image-modal-content">
        <span class="image-modal-close">&times;</span>
        <img src="" alt="Zoomed Magnet">
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalOverlay = modal.querySelector(".image-modal-overlay");
  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector(".image-modal-close");

  document.querySelectorAll("tbody tr").forEach(row => {
    const img = row.querySelector("td img");
    if (img) {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modal.classList.add("show");
      });
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modalImg.src = "";
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modal.classList.remove("show");
      modalImg.src = "";
    }
  });
});
