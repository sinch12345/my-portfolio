// ===== Typing Effect =====
const roles = [
  "Computer Science Undergraduate",
  "Aspiring Product Manager",
  "AI & GenAI Builder",
  "Full-Stack Developer"
];

const typedText = document.getElementById("typed-text");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const current = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedText.textContent = current.substring(0, charIndex);

  let delay = isDeleting ? 40 : 90;

  if (!isDeleting && charIndex === current.length) {
    delay = 1600; // pause when the word is complete
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== 3D Tilt on Skill Cards =====
const tiltCards = document.querySelectorAll(".skill-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

        card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 10;

    card.style.transition = "border-color 0.3s ease, box-shadow 0.3s ease";
    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "";
    card.style.transform = "";
  });
});

// ===== Custom Cursor =====
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (hasFinePointer) {
  document.body.classList.add("has-custom-cursor");

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let firstMove = true;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (firstMove) {
      ringX = mouseX;
      ringY = mouseY;
      firstMove = false;
      document.body.classList.add("cursor-active");
    }

    // dot sticks to the mouse instantly
    cursorDot.style.transform =
      `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // ring chases the mouse with easing (smooth lag)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform =
      `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
}