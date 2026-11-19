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