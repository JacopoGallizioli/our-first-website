document.addEventListener("DOMContentLoaded", () => {
  const modal = document.createElement("div");
  modal.classList.add("image-modal");
  modal.innerHTML = `
    <div class="image-modal-content">
      <span class="image-modal-close">&times;</span>
      <img src="" alt="Zoomed Magnet">
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector(".image-modal-close");

  // Attach click listener to each image in the first column
  document.querySelectorAll("tbody tr").forEach(row => {
    const img = row.querySelector("td img");
    if (img) {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modal.style.display = "flex";
      });
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalImg.src = "";
  });

  // Optional: click outside the image to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
    }
  });
});
