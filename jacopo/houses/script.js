gsap.registerPlugin(ScrollTrigger);

// Reveal house sections on scroll
document.querySelectorAll(".house").forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible")
  });
});

// Animate images on scroll (both directions)
document.querySelectorAll(".house-img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"),
  });
});

// Fix the roadmap after the header scrolls out of view
const roadmap = document.querySelector(".roadmap");
const container = document.querySelector("main.container");

ScrollTrigger.create({
  trigger: "header",
  start: "bottom top", // when header leaves view
  endTrigger: ".story",
  end: "bottom bottom",
  onEnter: () => {
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    roadmap.classList.add("fixed");
    roadmap.style.top = `${containerTop}px`; // Align with top of container
  },
  onLeaveBack: () => {
    roadmap.classList.remove("fixed");
    roadmap.style.top = ""; // Reset
  }
});

// Function to activate pin and adjust line fill height
function activatePin(index) {
  const pins = document.querySelectorAll(".pin");
  pins.forEach((pin, i) => {
    if (i <= index) {
      pin.classList.add("active");
    } else {
      pin.classList.remove("active");
    }
  });

  const lineFill = document.getElementById("lineFill");
  if (!lineFill) return;

  const activePin = document.querySelector(`.pin[data-index="${index}"]`);
  if (!activePin) return;

  const roadmapRect = roadmap.getBoundingClientRect();
  const pinRect = activePin.getBoundingClientRect();
  const offset = pinRect.top - roadmapRect.top + pinRect.height / 2;

  lineFill.style.height = `${offset}px`;
}

// ScrollTriggers to activate pins
document.querySelectorAll(".house").forEach((section, index, sections) => {
  const isLast = index === sections.length - 1;
  ScrollTrigger.create({
    trigger: section,
    start: isLast ? "top 80%" : "top center",
    end: isLast ? "bottom bottom" : "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});
