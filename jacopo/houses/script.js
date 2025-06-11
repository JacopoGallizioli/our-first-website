gsap.registerPlugin(ScrollTrigger);

// --- SETUP FILL PATH ---
const fillPath = document.getElementById("fillPath");
const totalLength = fillPath.getTotalLength();

// hide entire path initially
fillPath.style.strokeDasharray = `0 ${totalLength}`;
fillPath.style.strokeDashoffset = 0;

// grab your pins and number of segments
const pins = Array.from(document.querySelectorAll(".pin"));
const segments = pins.length; // here, 3

// --- REVEAL SECTIONS (unchanged) ---
document.querySelectorAll(".house").forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => {
      section.classList.add("visible");
      section.querySelectorAll(".house-img").forEach(img =>
        img.classList.add("visible")
      );
    }
  });
});

// --- CONTINUOUS FILL + PIN ACTIVATION ---
// We use a single scrubbed ScrollTrigger spanning the entire story
ScrollTrigger.create({
  trigger: ".story",
  start: "top top",      // when the top of .story hits the top of the viewport
  end: "bottom bottom",  // when the bottom of .story hits the bottom of the viewport
  scrub: true,           // smooth, continuous tie to scroll position
  onUpdate(self) {
    const prog = self.progress; // 0 → 1

    // 1) update fill length
    const draw = prog * totalLength;
    fillPath.style.strokeDasharray = `${draw} ${totalLength}`;

    // 2) update pins: pin i becomes active once prog ≥ (i+1)/segments
    pins.forEach((pin, i) => {
      const threshold = (i + 1) / segments;
      pin.classList.toggle("active", prog >= threshold);
    });
  }
});

// --- STICKY ROADMAP (locking left position) ---
const roadmap = document.querySelector(".roadmap");
const spacer  = document.getElementById("header-spacer");
const originalLeft = roadmap.getBoundingClientRect().left + "px";

new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) {
    roadmap.classList.add("fixed");
    roadmap.style.left = originalLeft;
  } else {
    roadmap.classList.remove("fixed");
    roadmap.style.left = "";
  }
}, { threshold: 0 })
.observe(spacer);

// initialize pins/line to zero
pins.forEach(pin => pin.classList.remove("active"));
fillPath.style.strokeDasharray = `0 ${totalLength}`;
