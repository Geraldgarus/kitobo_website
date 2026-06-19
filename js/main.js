/* =============================================
   KITOBO SERENITY RESORT — main.js
   Multi-page: preloader · nav · reveals · carousel
   menu tabs · counter · form · lightbox · utils
   ============================================= */

'use strict';

/* ─── PRELOADER ─────────────────────────────── */
const preloader = document.getElementById('preloader');
if (preloader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      initRevealObserver();
    }, 1400);
  });
}

/* ─── SCROLL PROGRESS BAR ───────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0';
}

/* ─── NAVBAR ────────────────────────────────── */
const navbar = document.getElementById('navbar');
const isTransparentNav = navbar && navbar.classList.contains('transparent');

function updateNavbar() {
  if (!navbar) return;
  if (isTransparentNav) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
}

/* ─── HAMBURGER / MOBILE NAV ────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

/* Inject mobile panel header (logo + close button) */
if (navLinks && !navLinks.querySelector('.nav-mobile-header')) {
  const header = document.createElement('div');
  header.className = 'nav-mobile-header';
  header.innerHTML = '<img src="images/logo.png" alt="Kitobo" class="nav-mobile-logo" />' +
    '<button class="nav-mobile-close" aria-label="Close menu">✕</button>';
  navLinks.insertBefore(header, navLinks.firstChild);
}

/* Backdrop */
let backdrop = document.getElementById('navBackdrop');
if (!backdrop) {
  backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.id = 'navBackdrop';
  document.body.appendChild(backdrop);
}

function openNav() {
  navLinks.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeNav() : openNav();
  });

  /* Close button inside panel */
  navLinks.addEventListener('click', e => {
    if (e.target.classList.contains('nav-mobile-close')) closeNav();
  });

  /* Close on link click */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  /* Close on backdrop click */
  backdrop.addEventListener('click', closeNav);

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ─── SCROLL HANDLER ────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateNavbar();
      updateScrollProgress();
      updateBackToTop();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ─── REVEAL ANIMATIONS ─────────────────────── */
function initRevealObserver() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      const rect  = el.getBoundingClientRect();
      const instant = rect.top < window.innerHeight * 0.25;

      if (instant) {
        el.classList.add('visible');
      } else {
        setTimeout(() => el.classList.add('visible'), delay);
      }
      observer.unobserve(el);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  /* fallback: elements already in view when observer runs */
  setTimeout(() => {
    revealEls.forEach(el => {
      if (el.classList.contains('visible')) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 120);
}

/* ─── HERO SLIDER ───────────────────────────── */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() { timer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(timer); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  startAuto();
})();

/* ─── ROOM CAROUSELS ────────────────────────── */
(function initRoomCarousels() {
  document.querySelectorAll('.room-carousel-wrap').forEach(wrap => {
    const slides = wrap.querySelectorAll('.room-carousel-slide');
    const dotsEl = wrap.querySelector('.carousel-dots');
    if (!slides.length) return;

    let cur = 0;

    if (dotsEl) {
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      });
    }

    function goTo(idx) {
      slides[cur].classList.remove('active');
      if (dotsEl) dotsEl.children[cur].classList.remove('active');
      cur = (idx + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dotsEl) dotsEl.children[cur].classList.add('active');
    }

    const prevBtn = wrap.querySelector('.carousel-btn.prev');
    const nextBtn = wrap.querySelector('.carousel-btn.next');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));

    /* touch / swipe */
    let startX = 0;
    wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? cur + 1 : cur - 1);
    });
  });
})();

/* ─── ANIMATED STAT COUNTERS ────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;

      const interval = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = Math.floor(current) + suffix;
      }, step);

      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObs.observe(el));
})();

/* ─── MENU TABS (bar-restaurant page) ───────── */
(function initMenuTabs() {
  const tabBtns   = document.querySelectorAll('.menu-tab');
  const tabPanels = document.querySelectorAll('.menu-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ─── CONTACT FORM (Web3Forms → info@kitoboserenityresort.com) ── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');
  if (!form) return;

  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    /* Build payload using FormData — picks up hidden inputs automatically */
    const formData = new FormData(form);
    formData.set('name', (form.fname.value + ' ' + form.lname.value).trim());

    try {
      const res  = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body:   formData
      });
      const json = await res.json();

      if (json.success) {
        form.reset();
        if (successMsg) {
          successMsg.style.display    = 'block';
          successMsg.style.background = '';
          successMsg.style.color      = '';
          successMsg.textContent      = 'Your message has been sent! We\'ll be in touch within 24 hours.';
          setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
        }
      } else {
        if (successMsg) {
          successMsg.style.display    = 'block';
          successMsg.style.background = '#fde8e8';
          successMsg.style.color      = '#c0392b';
          successMsg.textContent      = 'Sorry, something went wrong. Please email us directly at info@kitoboserenityresort.com';
        }
      }
    } catch {
      if (successMsg) {
        successMsg.style.display    = 'block';
        successMsg.style.background = '#fde8e8';
        successMsg.style.color      = '#c0392b';
        successMsg.textContent      = 'Network error. Please email us at info@kitoboserenityresort.com';
      }
    } finally {
      submitBtn.disabled  = false;
      btnText.textContent = 'Send Message';
    }
  });

  /* Real-time validation */
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.required && !input.value.trim()) {
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }
    });
    input.addEventListener('input', () => {
      if (input.value.trim()) input.classList.remove('invalid');
    });
  });
})();

/* ─── LIGHTBOX ──────────────────────────────── */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxItems = [];
let lightboxIdx   = 0;

function openLightbox(el) {
  if (!lightbox) return;
  const img = el.querySelector('img');
  if (!img) return;

  lightboxItems = Array.from(document.querySelectorAll('.gallery-item img, .gallery-grid img'));
  lightboxIdx   = lightboxItems.indexOf(img);

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxPrev() {
  lightboxIdx = (lightboxIdx - 1 + lightboxItems.length) % lightboxItems.length;
  lightboxImg.src = lightboxItems[lightboxIdx].src;
}

function lightboxNext() {
  lightboxIdx = (lightboxIdx + 1) % lightboxItems.length;
  lightboxImg.src = lightboxItems[lightboxIdx].src;
}

if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });
}

/* make lightbox functions accessible for inline onclick */
window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxPrev  = lightboxPrev;
window.lightboxNext  = lightboxNext;

/* ─── BACK TO TOP ───────────────────────────── */
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── BUTTON RIPPLE ─────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple   = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect     = this.getBoundingClientRect();
    const size     = Math.max(rect.width, rect.height);
    ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ─── INIT ON DOM READY ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  updateScrollProgress();
  updateBackToTop();
});
