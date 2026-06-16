/* =========================
   KITOBO SERENITY RESORT JS
   ========================= */

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  toggleBackToTop();
});

/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ---------- HERO SLIDER ---------- */
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
let currentHeroSlide = 0;
let heroInterval;

function goToHeroSlide(index) {
  heroSlides[currentHeroSlide].classList.remove('active');
  heroDots[currentHeroSlide].classList.remove('active');
  currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides[currentHeroSlide].classList.add('active');
  heroDots[currentHeroSlide].classList.add('active');
}

function startHeroSlider() {
  heroInterval = setInterval(() => {
    goToHeroSlide(currentHeroSlide + 1);
  }, 5500);
}

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(heroInterval);
    goToHeroSlide(parseInt(dot.dataset.index));
    startHeroSlider();
  });
});

startHeroSlider();

/* ---------- ROOM CAROUSELS ---------- */
document.querySelectorAll('.room-image-wrap').forEach(wrap => {
  const carousel = wrap.querySelector('.room-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.room-slide');
  const dotsContainer = wrap.querySelector('.room-dots');
  const prevBtn = wrap.querySelector('.carousel-prev');
  const nextBtn = wrap.querySelector('.carousel-next');
  let current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'room-dot-item' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dotsContainer.querySelectorAll('.room-dot-item')[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.querySelectorAll('.room-dot-item')[current].classList.add('active');
  }

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(current - 1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(current + 1);
  });

  // Touch / swipe support
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goToSlide(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
});

/* ---------- DINING TABS ---------- */
document.querySelectorAll('.dining-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dining-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dining-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

/* ---------- GALLERY THUMBNAILS ---------- */
document.querySelectorAll('.thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const targetId = thumb.dataset.target;
    const mainImg = document.getElementById(targetId);
    if (mainImg) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = thumb.src;
        mainImg.style.opacity = '1';
      }, 200);
    }
    const thumbGroup = thumb.closest('.dining-gallery-thumbs');
    thumbGroup.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

/* ---------- CONTACT FORM ---------- */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    success.classList.add('show');
    this.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1400);
});

/* ---------- SCROLL REVEAL — speed-aware staggered cascade ---------- */

// Reveal all pending elements in a section.
// instant = true  → no delays, no animation (fast scroll catch-up)
// instant = false → normal stagger
function revealSection(section, instant) {
  const els = [...section.querySelectorAll(
    '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
  )];
  if (!els.length) return;

  if (instant) {
    // Skip transition so content pops in immediately
    els.forEach(el => {
      el.style.transition = 'none';
      el.classList.add('visible');
      // Re-enable transition on next frame so hover/other effects still work
      requestAnimationFrame(() => { el.style.transition = ''; });
    });
  } else {
    let autoIdx = 0;
    els.forEach(el => {
      const delay = el.hasAttribute('data-delay')
        ? parseInt(el.dataset.delay, 10)
        : autoIdx * 65;
      autoIdx++;
      setTimeout(() => el.classList.add('visible'), delay);
    });
  }
}

const sectionRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const rect = entry.target.getBoundingClientRect();
    // If section is already 30%+ into the viewport the user scrolled fast — go instant
    const instant = rect.top < window.innerHeight * 0.3;
    revealSection(entry.target, instant);
    sectionRevealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0,
  // Fire when section is 20% into the viewport (prevents firing on page load
  // for #about which is already 16% visible due to 84vh hero height)
  rootMargin: '0px 0px -20% 0px'
});

// Exclude #home — hero uses its own CSS keyframe animations
document.querySelectorAll('section:not(#home)').forEach(s => {
  sectionRevealObserver.observe(s);
});

// Fallback sweep: after scroll stops, instantly reveal anything in or above viewport
// Catches sections the observer missed during very fast scrolling
let revealSweepTimer;
window.addEventListener('scroll', () => {
  clearTimeout(revealSweepTimer);
  revealSweepTimer = setTimeout(() => {
    document.querySelectorAll('section:not(#home)').forEach(s => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.70) {
        revealSection(s, true);
        sectionRevealObserver.unobserve(s);
      }
    });
  }, 100); // 100 ms after scroll stops
}, { passive: true });

/* ---------- BACK TO TOP ---------- */
const backToTop = document.getElementById('backToTop');
function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ---------- GALLERY STRIP PAUSE ON HOVER already in CSS ---------- */

/* ---------- DINING IMAGE MAIN TRANSITION ---------- */
document.querySelectorAll('.dining-gallery-main img').forEach(img => {
  img.style.transition = 'opacity 0.25s ease';
});

/* ---------- PARALLAX EFFECTS ---------- */
(function () {
  'use strict';

  const isMobile = () => window.innerWidth < 768;

  const heroEl = document.querySelector('.hero');
  const heroSlideEls = document.querySelectorAll('.hero-slide');
  const aboutImagesWrap = document.querySelector('.about-images');
  const aboutMainImg = document.querySelector('.about-img-main img');
  const aboutMainWrap = document.querySelector('.about-img-main');
  const aboutSecImg = document.querySelector('.about-img-secondary img');

  let ticking = false;
  let aboutMainHovered = false;
  let aboutMainPY = 0;
  let aboutSecPY = 0;

  function applyAboutMain(hovered) {
    if (!aboutMainImg) return;
    const scale = hovered ? 1.14 : 1.1;
    aboutMainImg.style.transform = `translateY(${aboutMainPY}px) scale(${scale})`;
  }

  if (aboutMainWrap && aboutMainImg) {
    aboutMainWrap.addEventListener('mouseenter', () => {
      aboutMainHovered = true;
      aboutMainImg.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
      applyAboutMain(true);
    });
    aboutMainWrap.addEventListener('mouseleave', () => {
      aboutMainImg.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
      applyAboutMain(false);
      setTimeout(() => { aboutMainHovered = false; }, 580);
    });
  }

  function runParallax() {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    const mobile = isMobile();

    // Hero: shift background-position-y slightly slower than scroll (classic parallax)
    if (!mobile && heroEl && scrollY <= heroEl.offsetHeight + 120) {
      const posY = 50 + (scrollY / winH) * 20;
      heroSlideEls.forEach(s => { s.style.backgroundPositionY = posY + '%'; });
    }

    // About images: translate up/down relative to viewport center
    if (!mobile && aboutImagesWrap) {
      const rect = aboutImagesWrap.getBoundingClientRect();
      if (rect.bottom > -80 && rect.top < winH + 80) {
        const center = rect.top + rect.height / 2 - winH / 2;
        aboutMainPY = center * -0.05;
        aboutSecPY  = center * -0.035;

        if (!aboutMainHovered && aboutMainImg) {
          aboutMainImg.style.transition = 'none';
          aboutMainImg.style.transform = `translateY(${aboutMainPY}px) scale(1.1)`;
        }
        if (aboutSecImg) {
          aboutSecImg.style.transition = 'none';
          aboutSecImg.style.transform = `translateY(${aboutSecPY}px) scale(1.08)`;
        }
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(runParallax);
      ticking = true;
    }
  }, { passive: true });

  runParallax();
})();

/* =====================================================================
   DYNAMIC & INTERACTIVE ENHANCEMENTS
   ===================================================================== */

/* ---------- SCROLL PROGRESS BAR ---------- */
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  document.body.prepend(bar);
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min((window.scrollY / max) * 100, 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- ANIMATED STATS COUNTER ---------- */
(function () {
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const statsEl = document.querySelector('.about-stats');
  if (!statsEl) return;
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
    });
  }, { threshold: 0.6 }).observe(statsEl);
})();

/* ---------- 3D CARD TILT ON ROOM CARDS ---------- */
(function () {
  document.querySelectorAll('.room-card-inner').forEach(card => {
    let on = false;
    card.addEventListener('mouseenter', () => {
      on = true;
      card.style.transition = 'box-shadow 0.3s ease';
      card.style.willChange = 'transform';
    });
    card.addEventListener('mousemove', e => {
      if (!on) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      on = false;
      card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; card.style.willChange = ''; }, 750);
    });
  });
})();

/* ---------- HERO CONTENT MOUSE PARALLAX ---------- */
(function () {
  const hero = document.querySelector('.hero');
  const content = document.querySelector('.hero-content');
  if (!hero || !content) return;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    content.style.transition = 'none';
    content.style.transform = `translate(${x * 22}px, ${y * 14}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    content.style.transition = 'transform 1.2s cubic-bezier(0.22,1,0.36,1)';
    content.style.transform = '';
    setTimeout(() => content.style.transition = '', 1250);
  });
})();

/* ---------- SECTION NAVIGATION DOTS ---------- */
(function () {
  const sections = [
    { id: 'home',            label: 'Home' },
    { id: 'about',           label: 'About' },
    { id: 'accommodations',  label: 'Rooms' },
    { id: 'bar-restaurant',  label: 'Dining' },
    { id: 'contact',         label: 'Contact' },
  ];
  const wrap = document.createElement('nav');
  wrap.className = 'section-dots';
  wrap.setAttribute('aria-label', 'Section navigation');
  sections.forEach(({ id, label }) => {
    const dot = document.createElement('button');
    dot.className = 'section-dot';
    dot.setAttribute('aria-label', label);
    dot.setAttribute('title', label);
    dot.dataset.id = id;
    dot.addEventListener('click', () => {
      const t = document.getElementById(id);
      if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
    wrap.appendChild(dot);
  });
  document.body.appendChild(wrap);

  function updateDots() {
    const mid = window.scrollY + window.innerHeight * 0.42;
    sections.forEach(({ id }) => {
      const sec = document.getElementById(id);
      const dot = wrap.querySelector(`[data-id="${id}"]`);
      if (!sec || !dot) return;
      dot.classList.toggle('active', mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight);
    });
  }
  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
})();

/* ---------- BUTTON RIPPLE ---------- */
(function () {
  document.querySelectorAll('.btn').forEach(btn => {
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = (e.clientX - r.left) + 'px';
      ripple.style.top  = (e.clientY - r.top)  + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
})();

/* ---------- GALLERY LIGHTBOX ---------- */
(function () {
  const allImgs = [...document.querySelectorAll('.gallery-item img')];
  const seen = new Set();
  const images = allImgs.reduce((acc, img) => {
    if (!seen.has(img.src)) { seen.add(img.src); acc.push({ src: img.src, alt: img.alt }); }
    return acc;
  }, []);
  if (!images.length) return;

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-overlay"></div>
    <div class="lb-box">
      <button class="lb-prev">&#8249;</button>
      <img class="lb-img" src="" alt="" />
      <button class="lb-next">&#8250;</button>
    </div>
    <button class="lb-close">&#10005;</button>
    <div class="lb-counter"></div>`;
  document.body.appendChild(lb);

  let cur = 0;

  function show(i) {
    cur = (i + images.length) % images.length;
    const img = lb.querySelector('.lb-img');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = images[cur].src;
      img.alt = images[cur].alt;
      img.onload = () => { img.style.opacity = '1'; };
      if (img.complete) img.style.opacity = '1';
    }, 160);
    lb.querySelector('.lb-counter').textContent = `${cur + 1} / ${images.length}`;
  }

  function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close()  { lb.classList.remove('open'); document.body.style.overflow = ''; }

  allImgs.forEach(img => {
    img.addEventListener('click', () => {
      const idx = images.findIndex(im => im.src === img.src);
      open(idx >= 0 ? idx : 0);
    });
  });

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-overlay').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   show(cur - 1);
    if (e.key === 'ArrowRight')  show(cur + 1);
  });

  // Touch swipe on lightbox
  let lbTouchX = 0;
  lb.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) show(diff > 0 ? cur + 1 : cur - 1);
  }, { passive: true });
})();
