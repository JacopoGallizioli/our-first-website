// script2.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const pins     = Array.from(document.querySelectorAll(".pin"));
  const sections = Array.from(document.querySelectorAll(".house"));
  const label    = document.createElement("div");
  label.classList.add("town-label");
  document.body.appendChild(label);

  const townNames = ["Saronno", "Augsburg", "Munich"];

  // Show “Saronno” immediately
  showLabel(0);

  pins.forEach((pin, i) => {
    ScrollTrigger.create({
      trigger: sections[i],
      start:   "top bottom",
      end:     "bottom top",
      onEnter:     () => showLabel(i),
      onLeaveBack: () => showLabel(i - 1)
    });
  });

  function showLabel(idx) {
    if (idx < 0 || idx >= pins.length) {
      label.style.opacity = 0;
      return;
    }
    const pinRect = pins[idx].getBoundingClientRect();

    label.textContent = townNames[idx];

    // fixed positioning: viewport coords
    label.style.top  = (pinRect.top + pinRect.height/2) + "px";
    label.style.left = pinRect.left + "px";

    // choose left/right offset
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
