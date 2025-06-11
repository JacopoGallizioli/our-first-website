gsap.registerPlugin(ScrollTrigger);

// prepare the SVG fill path
const fillPath = document.getElementById("fillPath");
const totalLength = fillPath.getTotalLength();
fillPath.style.strokeDasharray = `0 ${totalLength}`;
fillPath.style.strokeDashoffset = 0;

// pins & sections
const pins = Array.from(document.querySelectorAll(".pin"));
const sections = Array.from(document.querySelectorAll(".house"));
const segmentCount = pins.length; // 3 segments

// compute the scroll-trigger point for each section:
// the Y at which its top hits the bottom of the viewport
let triggers = [];
function calcTriggers() {
  triggers = sections.map(sec => 
    sec.getBoundingClientRect().top + window.scrollY - window.innerHeight
  );
}
calcTriggers();
window.addEventListener('resize', calcTriggers);

// update fill and pins based on current scroll
function updateOnScroll() {
  const y = window.scrollY;
  let fillLen = 0;

  // Loop over segments
  for (let i = 0; i < segmentCount; i++) {
    if (i === 0) {
      // segment 0: once past trigger[0], it’s immediately full
      if (y >= triggers[0]) fillLen = (1/segmentCount) * totalLength;
    } else {
      // if we've scrolled past trigger i, fully fill up to segment i
      if (y >= triggers[i]) {
        fillLen = ((i+1)/segmentCount) * totalLength;
      }
      // if we're between trigger[i-1] and trigger[i], partially fill segment i
      else if (y > triggers[i-1]) {
        const prog = (y - triggers[i-1]) / (triggers[i] - triggers[i-1]);
        fillLen = ((i) + prog) / segmentCount * totalLength;
        break;
      }
    }
  }
  // clamp
  fillLen = Math.max(0, Math.min(fillLen, totalLength));
  fillPath.style.strokeDasharray = `${fillLen} ${totalLength}`;

  // activate pins once you hit each section
  pins.forEach((pin, idx) => {
    pin.classList.toggle('active', y >= triggers[idx]);
  });
}

// GSAP reveals still run as before
sections.forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: "top 80%",
    onEnter: () => {
      sec.classList.add("visible");
      sec.querySelectorAll(".house-img").forEach(img =>
        img.classList.add("visible")
      );
    }
  });
});

// sticky roadmap (unchanged)
const roadmap   = document.querySelector(".roadmap");
const spacer    = document.getElementById("header-spacer");
const origLeft  = roadmap.getBoundingClientRect().left + "px";
new IntersectionObserver(
  ([e]) => {
    if (!e.isIntersecting) {
      roadmap.classList.add("fixed");
      roadmap.style.left = origLeft;
    } else {
      roadmap.classList.remove("fixed");
      roadmap.style.left = "";
    }
  },
  { threshold: 0 }
).observe(spacer);

// kick off
window.addEventListener('scroll', updateOnScroll);
updateOnScroll();
