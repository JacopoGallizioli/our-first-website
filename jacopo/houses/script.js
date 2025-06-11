gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Grab all fill segments
  const fillMid1      = document.getElementById("fillMid1");
  const fillPostDash  = document.getElementById("fillPostDash");
  const pins          = Array.from(document.querySelectorAll(".pin"));
  const sections      = Array.from(document.querySelectorAll(".house"));

  // Measure lengths for the two animated segments
  const lenMid1 = fillMid1.getTotalLength();
  const lenPost = fillPostDash.getTotalLength();

  // Initialize both to zero-length dasharray
  fillMid1.style.strokeDasharray     = `0 ${lenMid1}`;
  fillMid1.style.strokeDashoffset    = 0;
  fillPostDash.style.strokeDasharray = `0 ${lenPost}`;
  fillPostDash.style.strokeDashoffset= 0;

  // Sticky roadmap (lock left)
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

  // Reveal sections + images
  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 80%",
      onEnter: () => {
        sec.classList.add("visible");
        sec.querySelectorAll(".house-img").forEach(i => i.classList.add("visible"));
      }
    });
  });

  // 1) Animate Segment 1 (dash→solid) during Section 0
  ScrollTrigger.create({
    trigger: sections[0],
    start: "top bottom",
    end:   "bottom top",
    scrub: true,
    onUpdate(self) {
      const draw = lenMid1 * self.progress;
      fillMid1.style.strokeDasharray = `${draw} ${lenMid1}`;
    },
    onEnter: () => pins[0].classList.add("active"),
    onEnterBack: () => pins[0].classList.toggle("active", false)
  });

  // 2) Activate Pin 1 on Section 1 entry
  ScrollTrigger.create({
    trigger: sections[1],
    start: "top bottom",
    onEnter: () => pins[1].classList.add("active"),
    onEnterBack: () => pins[1].classList.remove("active")
  });

  // 3) Animate last dash (Segment 3) during Section 2
  ScrollTrigger.create({
    trigger: sections[2],
    start: "top bottom",
    end:   "bottom top",
    scrub: true,
    onUpdate(self) {
      const draw = lenPost * self.progress;
      fillPostDash.style.strokeDasharray = `${draw} ${lenPost}`;
    },
    onEnter: () => pins[2].classList.add("active"),
    onEnterBack: () => pins[2].classList.remove("active")
  });
});
