gsap.registerPlugin(ScrollTrigger);

// Reveal houses and activate pins
document.querySelectorAll(".house").forEach((section, index, sections) => {
  // Reveal house on scroll
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible"),
  });

  // Activate corresponding pin & fill line
  ScrollTrigger.create({
    trigger: section,
    start: index === sections.length - 1 ? "top 20%" : "top center",
    end: index === sections.length - 1 ? "bottom bottom" : "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});

// Animate images on scroll
document.querySelectorAll(".house img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"),
  });
});

// Sticky roadmap when scrolling past header spacer
const roadmap = document.querySelector(".roadmap");
const headerSpacer = document.getElementById("header-spacer");

const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) {
    roadmap.classList.add("fixed");
  } else {
    roadmap.classList.remove("fixed");
  }
}, { root: null, threshold: 0 });

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

  const lineFill = document.getElementById("lineFill");
  if (!lineFill) return;

  const roadmap = document.querySelector(".roadmap");
  const activePin = document.querySelector(`.pin[data-index="${index}"]`);
  if (!activePin || !roadmap) return;

  // Calculate offset from top of roadmap to center of active pin
  const roadmapRect = roadmap.getBoundingClientRect();
  const pinRect = activePin.getBoundingClientRect();

  // + scrollY to convert viewport coords to page coords
  const offset = pinRect.top - roadmapRect.top + pinRect.height / 2;

  // Set height of fill line to offset in px
  lineFill.style.height = `${offset}px`;
}
