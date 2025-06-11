gsap.registerPlugin(ScrollTrigger);

// --- SETUP FILL PATH ---
const fillPath = document.getElementById("fillPath");
const totalLength = fillPath.getTotalLength();
fillPath.style.strokeDasharray = `0 ${totalLength}`;
fillPath.style.strokeDashoffset = 0;

// grab your pins
const pins = Array.from(document.querySelectorAll(".pin"));
const segments = pins.length; // 3

// helper to set fill length
function setFill(progress) {
  const draw = progress * totalLength;
  fillPath.style.strokeDasharray = `${draw} ${totalLength}`;
}

// pin activation (no fill here)
function activatePin(idx) {
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= idx);
  });
}

// --- SECTION-BASED PIN TRIGGERS ---
document.querySelectorAll(".house").forEach((section, idx) => {
  // when top of section enters bottom of viewport → pin on
  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    onEnter: () => activatePin(idx),
    onEnterBack: () => activatePin(idx),
  });
});

// --- SMOOTH FILL SCRUB ---
ScrollTrigger.create({
  trigger: ".story",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate(self) {
    setFill(self.progress);
  }
});

// --- STICKY ROADMAP (lock left pos) ---
const roadmap = document.querySelector(".roadmap");
const spacer  = document.getElementById("header-spacer");
const originalLeft = roadmap.getBoundingClientRect().left + "px";

new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) {
    roadmap.classList.add("fixed");
    roadmap.style.left = originalLeft;
  } else {
    roadmap.classList.remove("fixed");
    roadmap.style.left = "";
  }
}, { threshold: 0 })
.observe(spacer);

// initialize
activatePin(-1);
setFill(0);
