gsap.registerPlugin(ScrollTrigger);

const pins = document.querySelectorAll(".pin");
const lineFill = document.getElementById("lineFill");
const roadmap = document.querySelector(".roadmap");

// Calculate pins' vertical center positions relative to roadmap top
function getPinPositions() {
  const roadmapRect = roadmap.getBoundingClientRect();
  return Array.from(pins).map(pin => {
    const rect = pin.getBoundingClientRect();
    return rect.top - roadmapRect.top + rect.height / 2;
  });
}

// Activate pins cumulatively up to index (or none if index < 0)
function activatePins(upToIndex) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= upToIndex);
  });
}

// Clear line fill and pins
function reset() {
  lineFill.style.height = "0px";
  activatePins(-1);
}

// Main function to create ScrollTriggers
function initScrollTriggers() {
  const pinPositions = getPinPositions();

  // Reset any existing triggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  reset();

  // Spacer section: fill line from 0 to pin 0 while scrolling through spacer
  ScrollTrigger.create({
    trigger: ".house-spacer",
    start: "top top",
    end: "bottom top",
    scrub: true,
    onUpdate: self => {
      lineFill.style.height = `${pinPositions[0] * self.progress}px`;
      activatePins(-1); // no pins active during spacer scroll
    },
    onLeave: () => activatePins(0),   // pin 0 active entering first house
    onEnterBack: () => activatePins(-1), // deactivate when scrolling back up
  });

  // For each house section, fill line from previous pin to current pin and activate pins
  document.querySelectorAll(".house").forEach((section, i) => {
    const startPinPos = i === 0 ? pinPositions[0] : pinPositions[i];
    const prevPinPos = i === 0 ? 0 : pinPositions[i - 1];

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: self => {
        // Fill line grows from previous pin position to current pin position
        const fillHeight = prevPinPos + (startPinPos - prevPinPos) * self.progress;
        lineFill.style.height = `${fillHeight}px`;
        activatePins(i);
      },
      onEnter: () => activatePins(i),
      onEnterBack: () => activatePins(i),
      onLeaveBack: () => activatePins(i - 1)
    });
  });
}

// Initialize on load and refresh on resize
window.addEventListener("load", () => {
  initScrollTriggers();
  ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
  initScrollTriggers();
  ScrollTrigger.refresh();
});
