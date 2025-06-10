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

function activatePin(index) {
  document.querySelectorAll(".pin").forEach(pin => {
    pin.classList.remove("active");
  });
  const pin = document.querySelector(`.pin[data-index="${index}"]`);
  if (pin) pin.classList.add("active");
}

