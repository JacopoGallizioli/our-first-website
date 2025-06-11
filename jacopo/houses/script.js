gsap.registerPlugin(ScrollTrigger);

// -- Setup fill path --
const fillPath    = document.getElementById("fillPath");
const totalLength = fillPath.getTotalLength();
fillPath.style.strokeDasharray  = `0 ${totalLength}`;
fillPath.style.strokeDashoffset = 0;

// grab pins & sections
const pins     = Array.from(document.querySelectorAll(".pin"));
const sections = Array.from(document.querySelectorAll(".house"));
const segCount = pins.length + 1; // now 4 segments

// compute scroll triggers for each section
let triggers = [];
function calcTriggers() {
  triggers = sections.map(sec =>
    sec.getBoundingClientRect().top + window.scrollY - window.innerHeight
  );
}
calcTriggers();
window.addEventListener("resize", calcTriggers);

// sticky roadmap (lock left)
const roadmap  = document.querySelector(".roadmap");
const spacer   = document.getElementById("header-spacer");
const origLeft = roadmap.getBoundingClientRect().left + "px";
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) {
    roadmap.classList.add("fixed");
    roadmap.style.left = origLeft;
  } else {
    roadmap.classList.remove("fixed");
    roadmap.style.left = "";
  }
}, { threshold: 0 }).observe(spacer);

// GSAP reveal sections/images
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

// -- Scroll handler for fill & pins --
function updateOnScroll() {
  const y = window.scrollY;
  // compute overall progress (0→1) across the entire story scroll
  const topY    = sections[0].getBoundingClientRect().top + y;
  const bottomY = sections[sections.length-1].getBoundingClientRect().bottom + y - window.innerHeight;
  let prog = (y - topY) / (bottomY - topY);
  prog = Math.min(Math.max(prog, 0), 1);

  // update fillPath length
  const draw = prog * totalLength;
  fillPath.style.strokeDasharray = `${draw} ${totalLength}`;

  // activate pins when entering each section
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", y >= triggers[i]);
  });
}

// attach scroll listener
window.addEventListener("scroll", updateOnScroll);
updateOnScroll();

// 1) grab & measure the final dash path
const postDash = document.getElementById("fillPostDash");
const postLen  = postDash.getTotalLength();

// initialize hidden
postDash.style.strokeDasharray  = `0 ${postLen}`;
postDash.style.strokeDashoffset = 0;

// 2) create a ScrollTrigger scrub for Section 2
ScrollTrigger.create({
  trigger: ".house[data-index='2']",
  start: "top bottom",   // when Section 2 enters viewport
  end:   "bottom top",   // until Section 2 leaves
  scrub: true,
  onUpdate(self) {
    // gradually reveal the 30% dash
    const draw = postLen * self.progress;
    postDash.style.strokeDasharray = `${draw} ${postLen}`;
  }
});

