// script2.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const pins     = Array.from(document.querySelectorAll(".pin"));
  const sections = Array.from(document.querySelectorAll(".house"));
  const label    = document.createElement("div");
  
  label.classList.add("town-label");
  document.body.appendChild(label);

  const townNames = ["Saronno", "Augsburg", "Munich"];

  pins.forEach((pin, i) => {
    // Make sure label hides when scrolling back above first section
    ScrollTrigger.create({
      trigger: sections[i],
      start: "top bottom",
      end:   "bottom top",
      onEnter:    () => showLabel(i),
      onLeaveBack:() => showLabel(i - 1)
    });
  });

  // Helper to position & show/hide
  function showLabel(idx) {
    if (idx < 0 || idx >= pins.length) {
      label.style.opacity = 0;
      return;
    }
    const pin   = pins[idx];
    const rect  = pin.getBoundingClientRect();
    const name  = townNames[idx] || "";

    // Set text
    label.textContent = name;

    // Position vertically centered on pin
    label.style.top = window.scrollY + rect.top + "px";

    // Attach left/right class
    if (idx === 1) {
      label.classList.remove("left");
      label.classList.add("right");
    } else {
      label.classList.remove("right");
      label.classList.add("left");
    }

    // Show it
    label.style.opacity = 1;
  }
});
