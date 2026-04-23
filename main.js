const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

// Background Gradient Scroll Effect
function handleScroll() {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = maxScroll > 0 ? scrollY / maxScroll : 0;

  // Calculate dynamic colors based on scroll
  // Orb 1: Magenta to Blue
  const r1 = Math.floor(217 - scrollFraction * 100);
  const g1 = Math.floor(70 + scrollFraction * 50);
  const b1 = Math.floor(239 - scrollFraction * 50);
  
  // Orb 2: Violet to Deep Purple
  const r2 = Math.floor(124 - scrollFraction * 50);
  const g2 = Math.floor(58 - scrollFraction * 30);
  const b2 = Math.floor(237 + scrollFraction * 18);

  // Update CSS variables
  document.documentElement.style.setProperty('--orb-1-rgb', `${r1}, ${g1}, ${b1}`);
  document.documentElement.style.setProperty('--orb-2-rgb', `${r2}, ${g2}, ${b2}`);

  // Move orbs slightly on scroll
  const move1X = -8 + scrollFraction * 10;
  const move1Y = -12 + scrollFraction * 20;
  const move2X = -10 - scrollFraction * 15;
  const move2Y = -20 + scrollFraction * 30;

  document.documentElement.style.setProperty('--orb-1-pos-x', `${move1X}rem`);
  document.documentElement.style.setProperty('--orb-1-pos-y', `${move1Y}rem`);
  document.documentElement.style.setProperty('--orb-2-pos-x', `${move2X}rem`);
  document.documentElement.style.setProperty('--orb-2-pos-y', `${move2Y}rem`);
}

window.addEventListener('scroll', handleScroll, { passive: true });
// Initial call to set initial state
handleScroll();

// Reveal on Scroll
const observerOptions = {
  threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
