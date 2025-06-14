// script2.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const pins     = Array.from(document.querySelectorAll(".pin"));
  const sections = Array.from(document.querySelectorAll(".house"));
  const label    = document.createElement("div");
  
  label.classList.add("town-label");
  document.body.appendChild(label);

  const townNames = ["Saronno", "Augsburg", "Munich"];

  // Show the first label immediately
  positionLabel(0);

  pins.forEach((pin, i) => {
    ScrollTrigger.create({
      trigger: sections[i],
      start: "top bottom",
      end:   "bottom top",
      onEnter:     () => positionLabel(i),
      onLeaveBack: () => positionLabel(i - 1)
    });
  });

  function positionLabel(idx) {
    if (idx < 0 || idx >= pins.length) {
      label.style.opacity = 0;
      return;
    }
    const pin  = pins[idx];
    const rect = pin.getBoundingClientRect();

    // set text
    label.textContent = townNames[idx];

    // absolute position so it's beside the pin
    label.style.top  = window.scrollY + rect.top + "px";
    label.style.left = window.scrollX + rect.left + "px";

    // choose left/right offset class
    if (idx === 1) {
      label.classList.add("right");
      label.classList.remove("left");
    } else {
      label.classList.add("left");
      label.classList.remove("right");
    }

    label.style.opacity = 1;
  }
});

