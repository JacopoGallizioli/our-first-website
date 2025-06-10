gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".house").forEach((section, index) => {
  // Reveal house section on scroll
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => section.classList.add("visible")
  });

  // Activate corresponding pin
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activatePin(index),
    onEnterBack: () => activatePin(index),
  });
});

// Animate images on scroll (both directions)
document.querySelectorAll(".house-img").forEach((img) => {
  ScrollTrigger.create({
    trigger: img,
    start: "top 85%",
    onEnter: () => img.classList.add("visible"),
    onEnterBack: () => img.classList.add("visible"), // <--- add this
  });
});

// Added for sticking roadmap
const roadmap = document.querySelector('.roadmap');
const headerSpacer = document.getElementById('header-spacer');

const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      roadmap.classList.add('fixed');
    } else {
      roadmap.classList.remove('fixed');
    }
  },
  {
    root: null,
    threshold: 0
  }
);

observer.observe(headerSpacer);

function activatePin(index) {
  document.querySelectorAll(".pin").forEach(pin => {
    pin.classList.remove("active");
  });
  const pin = document.querySelector(`.pin[data-index="${index}"]`);
  if (pin) pin.classList.add("active");
}

const lineFill = document.getElementById("lineFill");

ScrollTrigger.create({
  trigger: ".story",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: self => {
    const progress = self.progress; // from 0 to 1
    lineFill.style.height = `${progress * 100}%`;
  }
});
