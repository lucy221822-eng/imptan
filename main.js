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
  
  // Умное расписание: выделение текущего дня
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];
  
  // Если сегодня воскресенье (Вс), в расписании его обычно нет, но логику сохраняем
  const scheduleCards = document.querySelectorAll('#scheduleGrid > div');
  scheduleCards.forEach(card => {
    const dayLabel = card.querySelector('p')?.textContent;
    if (dayLabel && dayLabel.includes(todayName)) {
      card.classList.add('is-today');
    }
  });

  // Gallery dynamic population
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryImages = [
    'https://imperiatanca.by/d/imperia-stars-06-24_390.jpg',
    'https://imperiatanca.by/d/11-12-2024-imperiatanca-by_119.jpg',
    'https://imperiatanca.by/d/22-12-2024-imperiatanca-43.jpg',
    'https://imperiatanca.by/d/imperiatanca-party-06-2025-71.jpg',
    'https://imperiatanca.by/d/imperiatanca-party-2025-exotic-pole-dance_49.jpg',
    'https://imperiatanca.by/d/studiya-imperiya-tanca-053092024.jpg',
    'https://imperiatanca.by/d/417-pole-dance-166.jpg',
    'https://imperiatanca.by/d/425-imperia-tanca-429.jpg'
  ];

  if (galleryGrid) {
    // На главной показываем только первые 4 фото
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    const displayImages = isHomePage ? galleryImages.slice(0, 4) : galleryImages;
    
    galleryGrid.innerHTML = displayImages.map((src, idx) => `
      <div class="reveal block group overflow-hidden rounded-xl bg-card border border-white/5 aspect-square relative cursor-pointer" onclick="openLightbox(${idx}, ${JSON.stringify(displayImages).replace(/"/g, '&quot;')})">
        <img 
          src="${src}" 
          alt="Галерея ${idx + 1}" 
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-base/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span class="text-[10px] uppercase tracking-widest text-neon">Увеличить</span>
        </div>
      </div>
    `).join('');

    // Re-observe new elements
    galleryGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }


});

// Lightbox Logic
let currentLightboxIndex = 0;
let currentLightboxImages = [];

function initLightbox() {
  if (document.getElementById('lightbox')) return;
  
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-close" onclick="closeLightbox()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </div>
    <div class="lightbox-nav lightbox-prev" onclick="prevLightbox()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </div>
    <div class="lightbox-content">
      <img src="" alt="" class="lightbox-img" id="lightboxImg">
    </div>
    <div class="lightbox-nav lightbox-next" onclick="nextLightbox()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </div>
    <div class="lightbox-counter" id="lightboxCounter">1 / 1</div>
  `;
  document.body.appendChild(lightbox);
  
  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
  });
}

function openLightbox(index, images) {
  initLightbox();
  currentLightboxIndex = index;
  currentLightboxImages = images;
  updateLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  img.src = currentLightboxImages[currentLightboxIndex];
  counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
}

function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightbox();
}

function prevLightbox() {
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightbox();
}

// Логика раскрывающихся блоков (аккордеонов)
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const isActive = content.classList.contains('active');
  
  if (isActive) {
    content.classList.remove('active');
    header.classList.remove('active');
  } else {
    content.classList.add('active');
    header.classList.add('active');
    // Небольшая задержка для плавного появления внутренних элементов reveal
    setTimeout(() => {
      content.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }, 100);
  }
}



// Callback Modal Logic
document.addEventListener('DOMContentLoaded', () => {
  const callbackModal = document.getElementById('callbackModal');
  const modalContainer = document.getElementById('modalContainer');
  const openModalBtns = document.querySelectorAll('.open-callback-modal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');

  if (callbackModal && modalContainer) {
    const openModal = (e) => {
      if (e) e.preventDefault();
      callbackModal.classList.remove('hidden');
      callbackModal.classList.add('flex');
      setTimeout(() => {
        modalContainer.classList.remove('scale-95', 'opacity-0');
        modalContainer.classList.add('scale-100', 'opacity-100');
      }, 10);
    };

    const closeModal = () => {
      modalContainer.classList.remove('scale-100', 'opacity-100');
      modalContainer.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        callbackModal.classList.add('hidden');
        callbackModal.classList.remove('flex');
      }, 300);
    };

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Form submission
    const form = document.getElementById('callbackForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Simulate API call
        setTimeout(() => {
          submitBtn.textContent = 'Спасибо! Мы перезвоним';
          submitBtn.classList.remove('bg-neon');
          submitBtn.classList.add('bg-green-500');
          
          setTimeout(() => {
            closeModal();
            setTimeout(() => {
              form.reset();
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              submitBtn.classList.remove('bg-green-500');
              submitBtn.classList.add('bg-neon');
            }, 500);
          }, 2000);
        }, 1000);
      });
    }
  }
});