gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll(".house-spacer, .house");
const houses = document.querySelectorAll(".house");
const pins = document.querySelectorAll(".pin");
const lineFill = document.getElementById("lineFill");
const roadmap = document.querySelector(".roadmap");

let userHasScrolled = false;
lineFill.style.height = "0px";

// Reset state
function resetRoadmap() {
  lineFill.style.height = "0px";
  pins.forEach(pin => pin.classList.remove("active"));
}

// Roadmap sticky behavior
const headerSpacer = document.getElementById("header-spacer");
new IntersectionObserver(([entry]) => {
  roadmap.classList.toggle("fixed", !entry.isIntersecting);
}, { threshold: 0 }).observe(headerSpacer);

// Fade-in animation
sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible"),
  });
});
document.querySelectorAll(".house-img").forEach(img => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"),
  });
});

// Pin logic
function activatePin(index) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= index);
  });
}

// Measure pin offsets
const pinOffsets = [];
function updateOffsets() {
  const roadmapRect = roadmap.getBoundingClientRect();
  pinOffsets.length = 0;
  pins.forEach(pin => {
    const rect = pin.getBoundingClientRect();
    pinOffsets.push(rect.top - roadmapRect.top + rect.height / 2);
  });
}

// Core scroll logic
function createLineFillTriggers() {
  for (let i = 0; i < houses.length; i++) {
    const spacer = sections[i * 2];
    const house = sections[i * 2 + 1];
    const pinOffset = pinOffsets[i];

    if (!spacer || !house || pinOffset == null) continue;

    ScrollTrigger.create({
      trigger: spacer,
      start: "top center",
      endTrigger: house,
      end: "top center",
      scrub: true,
      onUpdate: (self) => {
        if (!userHasScrolled) return; // 🚫 Don't animate yet
        const height = pinOffset * self.progress;
        lineFill.style.height = `${height}px`;
      },
      onEnter: () => {
        if (!userHasScrolled) return;
        activatePin(i);
      },
      onEnterBack: () => {
        if (!userHasScrolled) return;
        activatePin(i);
      }
    });
  }
}

// Detect first user scroll
window.addEventListener("scroll", () => {
  if (!userHasScrolled) {
    userHasScrolled = true;
    ScrollTrigger.refresh();
  }
}, { once: true });

// On load
window.addEventListener("load", () => {
  resetRoadmap();
  setTimeout(() => {
    updateOffsets();
    createLineFillTriggers();
    ScrollTrigger.refresh();
  }, 100);
});

// On resize
window.addEventListener("resize", () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  resetRoadmap();
  updateOffsets();
  createLineFillTriggers();
  ScrollTrigger.refresh();
});
