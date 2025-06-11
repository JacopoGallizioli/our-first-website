gsap.registerPlugin(ScrollTrigger);

// Reveal house sections
document.querySelectorAll(".house").forEach((section) => {
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
const roadmap = document.querySelector('.roadmap');
const headerSpacer = document.getElementById('header-spacer');
const observer = new IntersectionObserver(
  ([entry]) => {
    roadmap.classList.toggle('fixed', !entry.isIntersecting);
  },
  { root: null, threshold: 0 }
);
observer.observe(headerSpacer);

// Activate pins
function activatePin(index) {
  const pins = document.querySelectorAll(".pin");
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i === index);
  });
}

// ScrollTrigger for each house section to activate pins
const sections = document.querySelectorAll(".house");
sections.forEach((section, index) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});

// Fill line progressively with scroll
(() => {
  const roadmap = document.querySelector(".roadmap");
  const lineFill = document.getElementById("lineFill");
  const pins = document.querySelectorAll(".pin");
  const houses = document.querySelectorAll(".house");

  if (!roadmap || !lineFill || pins.length !== houses.length) return;

  const updateOffsetsAndCreateTriggers = () => {
    const roadmapRect = roadmap.getBoundingClientRect();
    const pinOffsets = Array.from(pins).map(pin => {
      const rect = pin.getBoundingClientRect();
      return rect.top - roadmapRect.top + rect.height / 2;
    });

    lineFill.style.height = "0px";

    // Clear existing triggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars && trigger.vars.id === "line-fill") trigger.kill();
    });

    let previousOffset = 0;
    houses.forEach((section, index) => {
      const targetOffset = pinOffsets[index];

      ScrollTrigger.create({
        id: "line-fill",
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
          lineFill.style.height = `${targetOffset}px`;
        },
        onEnterBack: () => {
          lineFill.style.height = `${previousOffset}px`;
        }
      });

      previousOffset = targetOffset;
    });
  };

  // Run on load and resize
  window.addEventListener("load", updateOffsetsAndCreateTriggers);
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
    updateOffsetsAndCreateTriggers();
  });
})();
