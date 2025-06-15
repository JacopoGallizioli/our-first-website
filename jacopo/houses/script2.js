// script2.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const pins     = Array.from(document.querySelectorAll(".pin"));
  const sections = Array.from(document.querySelectorAll(".house"));
  const label    = document.createElement("div");
  label.classList.add("town-label");
  document.body.appendChild(label);

  const townNames = ["Saronno", "Augsburg", "Munich"];
  let currentIdx = 0;

  // initial
  showLabel(0);

  // update label on scroll: always re‐position next to the pin
  window.addEventListener("scroll", () => {
    showLabel(currentIdx, /*repositionOnly=*/true);
  });

  pins.forEach((pin, i) => {
    ScrollTrigger.create({
      trigger: sections[i],
      start:   "top bottom",
      end:     "bottom top",
      onEnter:     () => showLabel(i),
      onLeaveBack: () => showLabel(i - 1)
    });
  });

  function showLabel(idx, repositionOnly = false) {
    if (idx < 0 || idx >= pins.length) {
      label.style.opacity = 0;
      return;
    }
    currentIdx = idx;

    if (!repositionOnly) {
      label.textContent = townNames[idx];
      label.style.opacity = 1;

      if (idx === 1) {
        label.classList.add("right");
        label.classList.remove("left");
      } else {
        label.classList.add("left");
        label.classList.remove("right");
      }
    }

    const pinRect = pins[idx].getBoundingClientRect();
    label.style.top  = (pinRect.top + pinRect.height/2) + "px";
    label.style.left = pinRect.left + "px";
  }

  document.querySelectorAll('.images img').forEach((img) => {
    const offset = Math.floor(Math.random() * 80); // 0px to 80px
    img.style.transform = `translateX(${offset}px)`;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".images img");

  // Show only first image initially
  images.forEach((img, i) => {
    if (i === 0) {
      img.classList.add("visible");
    } else {
      img.classList.remove("visible");
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      root: null,          // viewport
      threshold: 0.3,      // trigger when 10% of image is visible
    }
  );

  images.forEach((img) => observer.observe(img));
});
