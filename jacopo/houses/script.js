gsap.registerPlugin(ScrollTrigger);

const roadmap = document.querySelector(".roadmap");
const lineFill = document.getElementById("lineFill");
const pins = document.querySelectorAll(".pin");
const houseSpacers = document.querySelectorAll(".house-spacer");
const houses = document.querySelectorAll(".house");

let pinOffsets = [];
let userHasScrolled = false;

lineFill.style.height = "0px";

// Sticky roadmap
const headerSpacer = document.getElementById("header-spacer");
new IntersectionObserver(([entry]) => {
  roadmap.classList.toggle("fixed", !entry.isIntersecting);
}, { threshold: 0 }).observe(headerSpacer);

// Fade in elements
[...houseSpacers, ...houses].forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible"),
  });
});
document.querySelectorAll(".house-img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"),
  });
});

// Activate pins
function activatePin(index) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= index);
  });
}

// Measure pin positions inside roadmap
function updatePinOffsets() {
  const roadmapRect = roadmap.getBoundingClientRect();
  pinOffsets = [...pins].map(pin => {
    const rect = pin.getBoundingClientRect();
    return rect.top - roadmapRect.top + rect.height / 2;
  });
}

// Fill logic
function createScrollTriggers() {
  houseSpacers.forEach((spacer, index) => {
    const house = houses[index];
    const pinOffset = pinOffsets[index];
    if (!spacer || !house || pinOffset == null) return;

    // Fill the line from 0 to this pin during spacer scroll
    ScrollTrigger.create({
      trigger: spacer,
      start: "top bottom",
      endTrigger: house,
      end: "top center",
      scrub: true,
      onUpdate: (self) => {
        if (!userHasScrolled) return;
        const fillHeight = pinOffset * self.progress;
        lineFill.style.height = `${fillHeight}px`;
      }
    });

    // Activate the pin on house entrance
    ScrollTrigger.create({
      trigger: house,
      start: "top center",
      onEnter: () => {
        if (userHasScrolled) activatePin(index);
      },
      onEnterBack: () => {
        if (userHasScrolled) activatePin(index);
      }
    });
  });
}

// Wait until user scrolls before enabling animation
window.addEventListener("scroll", () => {
  if (!userHasScrolled) {
    userHasScrolled = true;
    ScrollTrigger.refresh();
  }
}, { once: true });

// Reset on load and resize
function resetRoadmap() {
  lineFill.style.height = "0px";
  pins.forEach(pin => pin.classList.remove("active"));
}

window.addEventListener("load", () => {
  resetRoadmap();
  setTimeout(() => {
    updatePinOffsets();
    createScrollTriggers();
    ScrollTrigger.refresh();
  }, 100);
});

window.addEventListener("resize", () => {
  ScrollTrigger.getAll().forEach(t => t.kill());
  resetRoadmap();
  updatePinOffsets();
  createScrollTriggers();
  ScrollTrigger.refresh();
});
