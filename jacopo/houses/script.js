gsap.registerPlugin(ScrollTrigger);

// Grab DOM elements
const sections = document.querySelectorAll(".house-spacer, .house");
const pins = document.querySelectorAll(".pin");
const lineFill = document.getElementById("lineFill");
const roadmap = document.querySelector(".roadmap");

// Ensure line is empty initially
lineFill.style.height = "0px";

// Reset line and pins on load/resize
function resetRoadmap() {
  lineFill.style.height = "0px";
  pins.forEach(pin => pin.classList.remove("active"));
}

// Make the roadmap bar sticky
const headerSpacer = document.getElementById("header-spacer");
const observer = new IntersectionObserver(
  ([entry]) => {
    roadmap.classList.toggle("fixed", !entry.isIntersecting);
  },
  { threshold: 0 }
);
observer.observe(headerSpacer);

// Show sections and images
sections.forEach((section) => {
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

// Activate all pins up to index
function activatePin(index) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= index);
  });
}

// Get vertical center positions of each pin, relative to roadmap
const pinOffsets = [];
function updateOffsets() {
  const roadmapRect = roadmap.getBoundingClientRect();
  pinOffsets.length = 0;
  pins.forEach(pin => {
    const rect = pin.getBoundingClientRect();
    pinOffsets.push(rect.top - roadmapRect.top + rect.height / 2);
  });
}

// Create ScrollTriggers that fill the line progressively
function createLineFillTriggers() {
  let previousOffset = 0;
  lineFill.style.height = "0px";

  // Start from section 1 (skip first spacer)
  for (let index = 1; index < sections.length; index++) {
    const section = sections[index];
    const currentPinOffset = pinOffsets[index - 1]; // pin 0 goes with section 1
    if (currentPinOffset == null) continue;

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const height = previousOffset + (currentPinOffset - previousOffset) * progress;
        lineFill.style.height = `${height}px`;
      },
      onEnter: () => activatePin(index - 1),
      onEnterBack: () => activatePin(index - 1),
    });

    previousOffset = currentPinOffset;
  }
}

// Initial setup after page load
window.addEventListener("load", () => {
  resetRoadmap();
  setTimeout(() => {
    updateOffsets();
    createLineFillTriggers();
    ScrollTrigger.refresh();
  }, 100);
});

// Recalculate everything on resize
window.addEventListener("resize", () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  resetRoadmap();
  updateOffsets();
  createLineFillTriggers();
  ScrollTrigger.refresh();
});
