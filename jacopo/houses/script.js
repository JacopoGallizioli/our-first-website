gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Grab paths
  const fillMid1      = document.getElementById("fillMid1");     // Segment 3
  const fillMid2      = document.getElementById("fillMid2");     // Segment 4
  const fillPostDash  = document.getElementById("fillPostDash"); // Segment 6
  const pins          = Array.from(document.querySelectorAll(".pin"));
  const sections      = Array.from(document.querySelectorAll(".house"));

  // Measure lengths
  const lenMid1 = fillMid1.getTotalLength();
  const lenMid2 = fillMid2.getTotalLength();
  const lenPost = fillPostDash.getTotalLength();

  // Init: collapse all dynamic segments
  fillMid1.style.strokeDasharray    = `0 ${lenMid1}`;
  fillMid1.style.strokeDashoffset   = 0;
  fillMid2.style.strokeDasharray    = `0 ${lenMid2}`;
  fillMid2.style.strokeDashoffset   = 0;
  fillPostDash.style.strokeDasharray  = `5 5`;     // maintain dash pattern
  fillPostDash.style.strokeDashoffset = lenPost;   // hide by offset

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

  // Section reveal
  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 80%",
      onEnter: () => {
        sec.classList.add("visible");
        sec.querySelectorAll(".house-img").forEach(img => img.classList.add("visible"));
      }
    });
  });

  // 1) Animate Segment 3 (fillMid1) during Section 0
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
    // no onEnterBack → pin0 stays active
  });

  // 2) Animate Segment 4 (fillMid2) during Section 1
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

  // 3) Animate dashed Segment 6 (fillPostDash) during Section 2
  ScrollTrigger.create({
    trigger: sections[2],
    start: "top bottom",
    end:   "bottom top",
    scrub: true,
    onUpdate(self) {
      // Reveal dashes by moving dashoffset
      fillPostDash.style.strokeDashoffset = lenPost * (1 - self.progress);
    },
    onEnter: () => pins[2].classList.add("active"),
    onLeaveBack: () => pins[2].classList.remove("active")
  });
});
