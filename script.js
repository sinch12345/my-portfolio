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

    // grow + turn lime over interactive things
   const interactiveSelector = "a, button, .btn, .skill-card, .project-row";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add("cursor-hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove("cursor-hover");
    }
  });

    // click burst
  window.addEventListener("mousedown", (e) => {
    document.body.classList.add("cursor-down");

    if (prefersReducedMotion) return;

    const count = 10;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = "click-spark";
      const angle = (Math.PI * 2 * i) / count;
      const distance = 40 + Math.random() * 30;
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      spark.style.background = i % 2 === 0 ? "var(--lime)" : "var(--cobalt)";
      document.body.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove());
    }
  });

  window.addEventListener("mouseup", () => {
    document.body.classList.remove("cursor-down");
  });

    // spark trail
  let lastTrail = 0;
  let trailToggle = false;

  window.addEventListener("mousemove", (e) => {
    if (prefersReducedMotion) return;

    const now = performance.now();
    if (now - lastTrail < 35) return; // throttle so it stays smooth
    lastTrail = now;

    const dot = document.createElement("span");
    dot.className = "trail-dot";
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    dot.style.background = trailToggle ? "var(--lime)" : "var(--cobalt)";
    trailToggle = !trailToggle;
    document.body.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  });
}

// ===== Page Router =====
const pages = document.querySelectorAll(".page");
const navLinkEls = document.querySelectorAll(".nav-links a");

function showPage(id) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains("page")) return false;

  pages.forEach((p) => p.classList.toggle("active", p === target));
  navLinkEls.forEach((link) =>
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
  );

  window.scrollTo({ top: 0, behavior: "instant" });
  return true;
}

// any link that points to #something switches the page
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();

  const id = link.getAttribute("href").slice(1);
  if (showPage(id)) history.pushState(null, "", `#${id}`);
});

// back / forward buttons
window.addEventListener("popstate", () => {
  showPage(location.hash.slice(1) || "home");
});

// on first load, open the page from the URL (or Home)
showPage(location.hash.slice(1)) || showPage("home");
// ===== Project Row Spotlight =====
document.querySelectorAll(".project-row").forEach((row) => {
  row.addEventListener("mousemove", (e) => {
    const rect = row.getBoundingClientRect();
    row.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  });
});

// ===== Project Detail Panel =====
const panel = document.getElementById("project-panel");
const panelContent = document.getElementById("panel-content");
const panelClose = document.getElementById("panel-close");
const panelOverlay = document.getElementById("panel-overlay");
let lastFocused = null;

function renderProject(p) {
  const list = (items) => items.map((i) => `<li>${i}</li>`).join("");

  const impact = p.impact.length
    ? `<div class="panel-block">
         <h4>Impact</h4>
         <div class="stat-grid">
           ${p.impact.map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join("")}
         </div>
       </div>`
    : "";

  const links = p.links
    .map((l) => `<a class="btn ${l.primary ? "" : "btn-outline"}" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)
    .join("");

  return `
    <p class="panel-label">${p.label}</p>
    <h3 class="panel-title">${p.title}</h3>
    <p class="panel-tagline">${p.tagline}</p>
    <div class="panel-links">${links}</div>
    <div class="panel-block"><h4>The Problem</h4><p>${p.problem}</p></div>
    <div class="panel-block"><h4>The Solution</h4><p>${p.solution}</p></div>
    <div class="panel-block"><h4>Key Features</h4><ul class="panel-features">${list(p.features)}</ul></div>
    ${impact}
    <div class="panel-block"><h4>Tech Stack</h4><div class="panel-stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div></div>
  `;
}

function openProject(key) {
  const project = PROJECTS[key];
  if (!project) return;
  lastFocused = document.activeElement;
  panelContent.innerHTML = renderProject(project);
  panel.scrollTop = 0;
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("panel-open");
  panelClose.focus();
}

function closeProject() {
  document.body.classList.remove("panel-open");
  panel.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".project-row").forEach((row) => {
  row.addEventListener("click", () => openProject(row.dataset.project));
});

panelClose.addEventListener("click", closeProject);
panelOverlay.addEventListener("click", closeProject);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("panel-open")) closeProject();
});