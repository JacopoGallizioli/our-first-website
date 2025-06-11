gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".house").forEach((section, index) => {
  // Reveal house section on scroll
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible")
  });

  // Activate corresponding pin
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});

// Animate images on scroll (both directions)
document.querySelectorAll(".house-img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"), // <--- add this
  });
});

// Added for sticking roadmap
const roadmap = document.querySelector('.roadmap');
const headerSpacer = document.getElementById('header-spacer');

const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      roadmap.classList.add('fixed');
    } else {
      roadmap.classList.remove('fixed');
    }
  },
  {
    root: null,
    threshold: 0
  }
);

observer.observe(headerSpacer);

function activatePin(index) {
  const pins = document.querySelectorAll(".pin");
  pins.forEach((pin, i) => {
    if (i <= index) {
      pin.classList.add("active");
    } else {
      pin.classList.remove("active");
    }
  });
}

// Create ScrollTriggers for each section to activate pins and line fill
document.querySelectorAll(".house").forEach((section, index, sections) => {
  ScrollTrigger.create({
    trigger: section,
    start: index === sections.length - 1 ? "top 20%" : "top center", // last pin triggers earlier for 4/5 screen height
    end: index === sections.length - 1 ? "bottom bottom" : "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});

// Progressive lineFill synced exactly to pin activation points
(() => {
  const roadmap = document.querySelector(".roadmap");
  const lineFill = document.getElementById("lineFill");
  const pins = document.querySelectorAll(".pin");
  const sections = document.querySelectorAll(".house");

  if (!roadmap || !lineFill || pins.length !== sections.length) return;

  // Get pin center offsets relative to roadmap
  const roadmapRect = roadmap.getBoundingClientRect();
  const pinOffsets = Array.from(pins).map(pin => {
    const rect = pin.getBoundingClientRect();
    return rect.top - roadmapRect.top + rect.height / 2;
  });

  // Build sequential ScrollTriggers for smooth fill between sections
  let previousOffset = 0;
  sections.forEach((section, index) => {
    const targetOffset = pinOffsets[index];

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: self => {
        const progress = self.progress;
        const height = previousOffset + (targetOffset - previousOffset) * progress;
        lineFill.style.height = `${height}px`;
      },
      onLeave: () => {
        // Clamp to full height for this section
        lineFill.style.height = `${targetOffset}px`;
        previousOffset = targetOffset;
      },
      onEnterBack: () => {
        // Also clamp correctly when scrolling up
        lineFill.style.height = `${previousOffset}px`;
      }
    });

    previousOffset = targetOffset;
  });
})();
