gsap.registerPlugin(ScrollTrigger);

// Reveal house sections
const sections = document.querySelectorAll(".house-spacer, .house");
const pins = document.querySelectorAll(".pin");
const lineFill = document.getElementById("lineFill");
const roadmap = document.querySelector(".roadmap");

lineFill.style.height = "0px";

// Reset line and pins on load/resize
function resetRoadmap() {
  lineFill.style.height = "0px"; // line empty
  pins.forEach(pin => pin.classList.remove("active")); // no pin active
}

// Initial scroll reset (pin0 and line)
ScrollTrigger.create({
  trigger: sections[0],
  start: "top top",
  end: "bottom top",
  onEnter: () => {
    lineFill.style.height = "0px";
    pins.forEach(pin => pin.classList.remove("active"));
  },
  onEnterBack: () => {
    lineFill.style.height = "0px";
    pins.forEach(pin => pin.classList.remove("active"));
  },
});

// Reveal house sections on scroll
sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible"),
  });
});

// Animate images
document.querySelectorAll(".house-img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"),
  });
});

// Stick roadmap
const headerSpacer = document.getElementById("header-spacer");
const observer = new IntersectionObserver(
  ([entry]) => {
    roadmap.classList.toggle("fixed", !entry.isIntersecting);
  },
  { root: null, threshold: 0 }
);
observer.observe(headerSpacer);

// Activate pins cumulatively
function activatePin(index) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= index);
  });
}

// Create ScrollTriggers for pin activation and line fill
const pinOffsets = [];
const updateOffsets = () => {
  const roadmapRect = roadmap.getBoundingClientRect();
  pinOffsets.length = 0;
  pins.forEach(pin => {
    const rect = pin.getBoundingClientRect();
    pinOffsets.push(rect.top - roadmapRect.top + rect.height / 2);
  });
};

const createLineFillTriggers = () => {
  let previousOffset = 0;
  lineFill.style.height = "0px";

  sections.forEach((section, index) => {
    const targetOffset = pinOffsets[index];
    if (targetOffset == null) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const height = Math.max(0, previousOffset + (targetOffset - previousOffset) * progress);
        lineFill.style.height = `${height}px`;
      },
      onEnter: () => {
        if (index > 0) activatePin(index - 1);
      },
      onEnterBack: () => {
        if (index > 0) activatePin(index - 1);
      },
    });

    previousOffset = targetOffset;
  });
};

// Wait for layout to settle before creating triggers
window.addEventListener("load", () => {
  resetRoadmap();

  setTimeout(() => {
    updateOffsets();
    createLineFillTriggers();
    ScrollTrigger.refresh();
  }, 100);
});

// Recreate triggers on resize
window.addEventListener("resize", () => {
  ScrollTrigger.getAll().forEach(t => t.kill());
  ScrollTrigger.refresh();
  resetRoadmap();
  updateOffsets();
  createLineFillTriggers();
});
