// script2.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const pins     = Array.from(document.querySelectorAll(".pin"));
  const sections = Array.from(document.querySelectorAll(".house"));
  const label    = document.createElement("div");
  label.classList.add("town-label");
  document.body.appendChild(label);

  const townNames = ["Saronno", "Augsburg", "Munich"];
  let currentIdx = 0;

  // initial
  showLabel(0);

  // update label on scroll: always re‐position next to the pin
  window.addEventListener("scroll", () => {
    showLabel(currentIdx, /*repositionOnly=*/true);
  });

  pins.forEach((pin, i) => {
    ScrollTrigger.create({
      trigger: sections[i],
      start:   "top bottom",
      end:     "bottom top",
      onEnter:     () => showLabel(i),
      onLeaveBack: () => showLabel(i - 1)
    });
  });

  function showLabel(idx, repositionOnly = false) {
    if (idx < 0 || idx >= pins.length) {
      label.style.opacity = 0;
      return;
    }
    currentIdx = idx;

    if (!repositionOnly) {
      label.textContent = townNames[idx];
      label.style.opacity = 1;

      if (idx === 1) {
        label.classList.add("right");
        label.classList.remove("left");
      } else {
        label.classList.add("left");
        label.classList.remove("right");
      }
    }

    const pinRect = pins[idx].getBoundingClientRect();
    label.style.top  = (pinRect.top + pinRect.height/2) + "px";
    label.style.left = pinRect.left + "px";
  }

  document.querySelectorAll('.images img').forEach((img) => {
    const offset = Math.floor(Math.random() * 101) - 50; // -10px to +10px
    img.style.transform = `translateX(${offset}px)`;
  });
});
