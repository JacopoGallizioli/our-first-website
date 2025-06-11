gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Grab paths
  const fillMid1      = document.getElementById("fillMid1");      // Segment 3
  const fillMid2      = document.getElementById("fillMid2");      // Segment 4
  const fillPostSolid = document.getElementById("fillPostSolid"); // Segment 5 (solid tail)
  const fillPostDash  = document.getElementById("fillPostDash");  // Segment 6 (dashed tail)
  const pins          = Array.from(document.querySelectorAll(".pin"));
  const sections      = Array.from(document.querySelectorAll(".house"));

  // Measure lengths
  const lenMid1      = fillMid1.getTotalLength();
  const lenMid2      = fillMid2.getTotalLength();
  const lenPostSolid = fillPostSolid.getTotalLength();
  const lenPostDash  = fillPostDash.getTotalLength();

  // Init: collapse dynamic segments
  fillMid1.style.strokeDasharray     = `0 ${lenMid1}`;
  fillMid1.style.strokeDashoffset    = 0;
  fillMid2.style.strokeDasharray     = `0 ${lenMid2}`;
  fillMid2.style.strokeDashoffset    = 0;

  fillPostSolid.style.strokeDasharray  = `0 ${lenPostSolid}`;
  fillPostSolid.style.strokeDashoffset = 0;

  fillPostDash.style.strokeDasharray   = `5 5`;         // keep dash pattern
  fillPostDash.style.strokeDashoffset  = lenPostDash;   // hide all dashes

  // Sticky roadmap (unchanged)
  const roadmap = document.querySelector(".roadmap");
  const spacer  = document.getElementById("header-spacer");
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

  // Section reveal (unchanged)
  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 80%",
      onEnter: () => {
        sec.classList.add("visible");
        sec.querySelectorAll(".house-img")
           .forEach(img => img.classList.add("visible"));
      }
    });
  });

  // 1) Segment 3 animation (unchanged)
  ScrollTrigger.create({
    trigger: sections[0],
    start: "top bottom",
    end:   "bottom top",
    scrub: true,
    onUpdate(self) {
      const draw = lenMid1 * self.progress;
      fillMid1.style.strokeDasharray = `${draw} ${lenMid1}`;
    },
    onEnter: () => pins[0].classList.add("active")
  });

  // 2) Segment 4 animation (unchanged)
  ScrollTrigger.create({
    trigger: sections[1],
    start: "top bottom",
    end:   "bottom top",
    scrub: true,
    onUpdate(self) {
      const draw = lenMid2 * self.progress;
      fillMid2.style.strokeDasharray = `${draw} ${lenMid2}`;
    },
    onEnter: () => pins[1].classList.add("active"),
    onLeaveBack: () => pins[1].classList.remove("active")
  });

  // 3) Segments 5 & 6 animation for Section 2
  ScrollTrigger.create({
    trigger: sections[2],      // third house
    start:   "top bottom",
    end:     "bottom top",
    scrub:   true,
    onUpdate(self) {
      const p = self.progress;    // 0 → 1 over Section 2

      // --- Segment 5 solid tail: fill over first 70% of scroll ---
      const seg5Progress = Math.min(p / 0.7, 1);
      const drawSolid = lenPostSolid * seg5Progress;
      fillPostSolid.style.strokeDasharray = `${drawSolid} ${lenPostSolid}`;

      // --- Segment 6 dashed tail: reveal dashes over last 30% ---
      if (p < 0.7) {
        // keep all grey
        fillPostDash.style.strokeDashoffset = lenPostDash;
      } else {
        // local progress 0→1 over [0.7,1]
        const localP = (p - 0.7) / 0.3;
        // offset from len→0 reveals dashes in place
        fillPostDash.style.strokeDashoffset = lenPostDash * (1 - localP);
      }
    },
    onEnter:      () => pins[2].classList.add("active"),
    onLeaveBack:  () => pins[2].classList.remove("active")
  });
});
