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

// Smooth progressive fill of lineFill
(() => {
  const roadmap = document.querySelector(".roadmap");
  const lineFill = document.getElementById("lineFill");
  const pins = document.querySelectorAll(".pin");

  if (!roadmap || !lineFill || pins.length < 2) return;

  const firstPin = pins[0];
  const lastPin = pins[pins.length - 1];

  ScrollTrigger.create({
    trigger: ".story",
    start: "top center",
    end: "bottom center",
    scrub: true,
    onUpdate: self => {
      const roadmapRect = roadmap.getBoundingClientRect();
      const firstRect = firstPin.getBoundingClientRect();
      const lastRect = lastPin.getBoundingClientRect();

      const startY = firstRect.top - roadmapRect.top + firstRect.height / 2;
      const endY = lastRect.top - roadmapRect.top + lastRect.height / 2;

      const filledHeight = startY + (endY - startY) * self.progress;
      lineFill.style.height = `${filledHeight}px`;
    }
  });
})();
