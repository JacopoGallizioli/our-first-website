gsap.registerPlugin(ScrollTrigger);

// Reveal house sections
const sections = document.querySelectorAll(".house");
const pins = document.querySelectorAll(".pin");
const lineFill = document.getElementById("lineFill");

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
const roadmap = document.querySelector(".roadmap");
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
    if (i <= index) {
      pin.classList.add("active");
    } else {
      pin.classList.remove("active");
    }
  });
}

// Scroll-linked progressive line fill synced with pin activation
window.addEventListener("load", () => {
  const roadmapRect = roadmap.getBoundingClientRect();
  const pinOffsets = Array.from(pins).map(pin => {
    const rect = pin.getBoundingClientRect();
    return rect.top - roadmapRect.top + rect.height / 2;
  });

  lineFill.style.height = "0px";

  let previousOffset = 0;

  sections.forEach((section, index) => {
    const currentOffset = pinOffsets[index];

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: self => {
        const progress = self.progress;
        const height = previousOffset + (currentOffset - previousOffset) * progress;
        lineFill.style.height = `${height}px`;
      },
      onLeave: () => {
        lineFill.style.height = `${currentOffset}px`;
      },
      onEnter: () => activatePin(index),
      onEnterBack: () => activatePin(index),
      onLeaveBack: () => {
        lineFill.style.height = `${previousOffset}px`;
      }
    });

    previousOffset = currentOffset;
  });
});

window.addEventListener("resize", () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  ScrollTrigger.refresh();
  location.reload();
});
