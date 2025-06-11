gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Grab the two post‐segments and all pins/sections
  const fillPostSolid = document.getElementById("fillPostSolid");  // segment 5
  const fillPostDash  = document.getElementById("fillPostDash");   // segment 6
  const pins          = Array.from(document.querySelectorAll(".pin"));
  const sections      = Array.from(document.querySelectorAll(".house"));

  // Measure their lengths
  const lenPostSolid = fillPostSolid.getTotalLength();
  const lenPostDash  = fillPostDash.getTotalLength();

  // Initialize both to “empty”
  fillPostSolid.style.strokeDasharray  = `0 ${lenPostSolid}`;
  fillPostSolid.style.strokeDashoffset = 0;

  // For the dashed one, keep the dash pattern but offset it entirely off
  fillPostDash.style.strokeDasharray   = `5 5`;
  fillPostDash.style.strokeDashoffset  = lenPostDash;

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

  // … your existing ScrollTriggers for segments 3 & 4 and pins 0 & 1 …

  // 4) Animate segment 5 (fillPostSolid) AND segment 6 (fillPostDash) during Section 2
  ScrollTrigger.create({
    trigger: sections[2],     // third house
    start:   "top bottom",    // when it enters
    end:     "bottom top",    // until it leaves
    scrub:   true,
    onUpdate(self) {
      // 5) Solid segment: dasharray from 0→full length
      const drawSolid = lenPostSolid * self.progress;
      fillPostSolid.style.strokeDasharray = `${drawSolid} ${lenPostSolid}`;

      // 6) Dash segment: reveal dashes by moving dashoffset from len→0
      const offsetDash = lenPostDash * (1 - self.progress);
      fillPostDash.style.strokeDashoffset = offsetDash;
    },
    onEnter: () => pins[2].classList.add("active"),
    onLeaveBack: () => pins[2].classList.remove("active")
  });
});
