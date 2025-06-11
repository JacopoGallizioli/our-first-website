gsap.registerPlugin(ScrollTrigger);

// prepare the fill path
const fillPath = document.getElementById("fillPath");
const totalLength = fillPath.getTotalLength();
// hide entire path initially
fillPath.style.strokeDasharray = `0 ${totalLength}`;
fillPath.style.strokeDashoffset = 0;

// get all pins
const pins = Array.from(document.querySelectorAll(".pin"));
const segments = pins.length; // 3 segments

function activatePin(idx) {
  // highlight pins up to idx
  pins.forEach((pin, i) => {
    pin.classList.toggle("active", i <= idx);
  });
  // compute how much of the path to draw
  const draw = ((idx + 1) / segments) * totalLength;
  fillPath.style.strokeDasharray = `${draw} ${totalLength}`;
}

// reveal houses & hook ScrollTrigger
document.querySelectorAll(".house").forEach((section, idx) => {
  // reveal section
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
  // activate pin when reached
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    onEnter: () => activatePin(idx),
    onEnterBack: () => activatePin(idx)
  });
});

// sticky roadmap with locked horizontal position
const roadmap = document.querySelector(".roadmap");
const spacer = document.getElementById("header-spacer");

// capture its original left offset (px) relative to viewport
const originalLeft = roadmap.getBoundingClientRect().left + "px";

new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      roadmap.classList.add("fixed");
      // lock horizontal position
      roadmap.style.left = originalLeft;
    } else {
      roadmap.classList.remove("fixed");
      // clear inline left so it flows back in flex
      roadmap.style.left = "";
    }
  },
  { threshold: 0 }
).observe(spacer);

// initialize first pin (none filled until first section)
activatePin(-1);
