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
  
  // Set the fill line height to the active pin's vertical position
  const lineFill = document.getElementById("lineFill");
  if (!lineFill) return;

  // Get position of the pin relative to the roadmap container
  const roadmap = document.querySelector(".roadmap");
  const activePin = document.querySelector(`.pin[data-index="${index}"]`);
  if (!activePin || !roadmap) return;

  // Calculate vertical offset of pin center within roadmap
  const roadmapRect = roadmap.getBoundingClientRect();
  const pinRect = activePin.getBoundingClientRect();

  // Distance from top of roadmap to center of active pin
  const offset = pinRect.top - roadmapRect.top + pinRect.height / 2;

  // Set lineFill height to offset (in px)
  lineFill.style.height = `${offset}px`;
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
