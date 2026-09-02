// Sahel Rooftop — script commun à toutes les pages

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- NAV ---------- */
const nav = document.getElementById('siteNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ---------- REVEAL ON SCROLL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

/* ---------- PARALLAX HERO ---------- */
const heroMedia = document.querySelector('.hero-media, .page-hero-media');
if (heroMedia && !reduceMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroMedia.style.transform = `translateY(${y * 0.25}px) scale(${1 + y*0.0003})`;
    }
  });
}

/* ---------- 3D TILT ---------- */
function attachTilt(el, intensity = 9) {
  if (reduceMotion || !el || window.matchMedia('(hover: none)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(0)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}
document.querySelectorAll('.tilt, #tiltCard').forEach(t => attachTilt(t));

/* =========================================================
   MODALE DE RÉSERVATION (accessible depuis toutes les pages)
   ========================================================= */
(function initBookingModal(){
  const overlay = document.getElementById('bookingModalOverlay');
  const openBtn = document.getElementById('openBookingModal');
  const closeBtn = document.getElementById('bookingModalClose');
  const form = document.getElementById('modalBookingForm');
  if (!overlay || !form) return;

  function openModal(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mBkName').value.trim();
    const phone = document.getElementById('mBkPhone').value.trim();
    const date = document.getElementById('mBkDate').value;
    const time = document.getElementById('mBkTime').value;
    const guests = document.getElementById('mBkGuests').value;

    const lines = [
      "Bonjour Sahel Rooftop, je souhaite réserver une table :",
      "• Nom : " + name,
      "• Téléphone : " + phone,
      "• Date : " + date,
      "• Heure : " + time,
      "• Nombre de personnes : " + guests
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open("https://wa.me/237688106688?text=" + text, "_blank");
    closeModal();
    form.reset();
  });
})();

/* ---------- SIMPLE DISH CAROUSEL ---------- */
function initCarousel(root) {
  if (!root) return;
  const slides = root.querySelectorAll('.dish-slide');
  const prev = root.querySelector('.carousel-arrow.prev');
  const next = root.querySelector('.carousel-arrow.next');
  let i = 0;
  function show(n) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === n));
  }
  show(0);
  if (prev) prev.addEventListener('click', () => { i = (i - 1 + slides.length) % slides.length; show(i); });
  if (next) next.addEventListener('click', () => { i = (i + 1) % slides.length; show(i); });
  if (!reduceMotion) {
    setInterval(() => { i = (i + 1) % slides.length; show(i); }, 5000);
  }
}
document.querySelectorAll('.dish-carousel').forEach(initCarousel);

/* =========================================================
   I18N — sélection de langue et application des traductions
   ========================================================= */
function applyLanguage(lang, dict) {
  if (!dict || !dict[lang]) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[lang][key] !== undefined) el.innerHTML = dict[lang][key];
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-switch button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  localStorage.setItem('sahel_lang', lang);
}

function initLanguage(dict) {
  const stored = localStorage.getItem('sahel_lang');
  const splash = document.getElementById('splash');

  if (stored) {
    document.documentElement.classList.add('lang-set');
    applyLanguage(stored, dict);
  } else if (splash) {
    document.body.classList.add('splash-active');
    splash.querySelectorAll('.lang-card').forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.dataset.lang;
        applyLanguage(lang, dict);
        document.documentElement.classList.add('lang-set');
        splash.classList.add('sweeping');
        setTimeout(() => splash.classList.add('closing'), 550);
        setTimeout(() => {
          splash.style.display = 'none';
          document.body.classList.remove('splash-active');
        }, 1200);
      });
    });
  } else {
    applyLanguage('fr', dict);
  }

  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang, dict));
  });
}
