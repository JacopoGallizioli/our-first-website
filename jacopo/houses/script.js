gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll(".house-spacer, .house");
const pins = document.querySelectorAll(".pin");
const lineFill = document.getElementById("lineFill");
const roadmap = document.querySelector(".roadmap");

// Reset line fill and pins
function resetRoadmap() {
  lineFill.style.height = "0px";
  pins.forEach(pin => pin.classList.remove("active"));
}

// Activate pins cumulatively up to given index
function activatePin(index) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= index);
  });
}

let pinOffsets = [];

function updateOffsets() {
  pinOffsets = [];
  const roadmapRect = roadmap.getBoundingClientRect();
  pins.forEach(pin => {
    const rect = pin.getBoundingClientRect();
    // Calculate vertical center relative to roadmap top
    pinOffsets.push(rect.top - roadmapRect.top + rect.height / 2);
  });
}

function createLineFillTriggers() {
  let previousOffset = 0;
  lineFill.style.height = "0px";

  sections.forEach((section, index) => {
    // Skip the first section (house-spacer) because it's the trigger for starting fill to pin 0
    // We'll handle pin activation from house sections (index 1 and onward)
    const targetOffset = pinOffsets[index - 1]; // index - 1 because pins correspond to houses starting at index 1

    if (index === 0) {
      // For the spacer section: fill from 0 to pin 0 as we scroll through the spacer
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const height = pinOffsets[0] * self.progress; // fill grows from 0 to pin 0 offset
          lineFill.style.height = `${height}px`;
          // Activate no pins during spacer scroll, pins start activating entering first house
          activatePin(-1);
        },
        onEnter: () => {
          // Line fill might be zero here
          activatePin(-1);
        },
        onLeave: () => {
          activatePin(0);
        },
        onEnterBack: () => {
          activatePin(-1);
        }
      });
      return; // move to next iteration
    }

    if (targetOffset == null) return;

    // For house sections, fill line from previous pin to current pin
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const height = Math.max(0, previousOffset + (targetOffset - previousOffset) * progress);
        lineFill.style.height = `${height}px`;
        // Activate pins up to current index - 1 (because first house activates pin 0)
        activatePin(index - 1);
      },
      onEnter: () => {
        activatePin(index - 1);
      },
      onEnterBack: () => {
        activatePin(index - 1);
      }
    });

    previousOffset = targetOffset;
  });
}

// On load and resize, initialize/reset everything
window.addEventListener("load", () => {
  resetRoadmap();

  setTimeout(() => {
    updateOffsets();
    createLineFillTriggers();
    ScrollTrigger.refresh();
  }, 100);
});

window.addEventListener("resize", () => {
  ScrollTrigger.getAll().forEach(t => t.kill());
  resetRoadmap();
  updateOffsets();
  createLineFillTriggers();
  ScrollTrigger.refresh();
});
