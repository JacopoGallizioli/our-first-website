document.addEventListener("DOMContentLoaded", () => {
  const pins = document.querySelectorAll(".pin");

  const labels = {
    0: "Saronno",
    1: "Augsburg",
    2: "Munich"
  };

  const roadmap = document.querySelector(".roadmap");

  // Create label element
  const townLabel = document.createElement("div");
  townLabel.className = "town-label";
  roadmap.appendChild(townLabel);

  // Style and position the label based on the pin
  const updateLabel = (pin, text) => {
    const pinRect = pin.getBoundingClientRect();
    const roadmapRect = roadmap.getBoundingClientRect();

    const top = pinRect.top - roadmapRect.top - 30;
    const left = pinRect.left - roadmapRect.left + pinRect.width / 2;

    townLabel.style.top = `${top}px`;
    townLabel.style.left = `${left}px`;
    townLabel.textContent = text;
    townLabel.classList.add("visible");
  };

  // Set initial label for first pin
  const pin0 = pins[0];
  updateLabel(pin0, labels[0]);

  // Listen to scroll to update labels
  pins.forEach((pin, index) => {
    if (index === 0) return; // Already shown

    ScrollTrigger.create({
      trigger: document.querySelector(`.house[data-index="${index}"]`),
      start: "top center",
      onEnter: () => updateLabel(pin, labels[index]),
      onEnterBack: () => updateLabel(pin, labels[index])
    });
  });
});
