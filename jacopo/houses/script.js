gsap.registerPlugin(ScrollTrigger);

// Reveal house section on scroll
document.querySelectorAll(".house").forEach((section, index) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible")
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});

// Animate images on scroll
document.querySelectorAll(".house-img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible")
  });
});

// Stick the roadmap
const roadmap = document.querySelector('.roadmap');
const headerSpacer = document.getElementById('header-spacer');

const observer = new IntersectionObserver(
  ([entry]) => {
    roadmap.classList.toggle('fixed', !entry.isIntersecting);
  },
  { threshold: 0 }
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

// Line fill synced to scroll & pin activation
(() => {
  const lineFill = document.getElementById("lineFill");
  const roadmap = document.querySelector(".roadmap");
  const pins = document.querySelectorAll(".pin");
  const sections = document.querySelectorAll(".house");

  if (!roadmap || !lineFill || pins.length !== sections.length) return;

  let previousOffset = 0;

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: self => {
        const progress = self.progress;

        // Dynamically calculate pin center offset
        const roadmapRect = roadmap.getBoundingClientRect();
        const pinRect = pins[index].getBoundingClientRect();
        const targetOffset = pinRect.top - roadmapRect.top + pinRect.height / 2;

        const height = previousOffset + (targetOffset - previousOffset) * progress;
        lineFill.style.height = `${height}px`;
      },
      onLeave: () => {
        const roadmapRect = roadmap.getBoundingClientRect();
        const pinRect = pins[index].getBoundingClientRect();
        previousOffset = pinRect.top - roadmapRect.top + pinRect.height / 2;
        lineFill.style.height = `${previousOffset}px`;
      },
      onEnterBack: () => {
        const roadmapRect = roadmap.getBoundingClientRect();
        const pinRect = pins[index].getBoundingClientRect();
        previousOffset = pinRect.top - roadmapRect.top + pinRect.height / 2;
        lineFill.style.height = `${previousOffset}px`;
      }
    });
  });
})();
