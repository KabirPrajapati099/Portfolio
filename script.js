/* =========================================================
   KABIR PRAJAPATI — PORTFOLIO
   script.js
   ========================================================= */

/* ---------------------------------------------------------
   1. PAGE LOADER
   --------------------------------------------------------- */
(function initLoader() {
  const loader    = document.getElementById('loader');
  const fillBar   = document.getElementById('loaderFill');
  let   progress  = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fillBar.style.width = '100%';
      setTimeout(() => loader.classList.add('done'), 400);
    }
    fillBar.style.width = progress + '%';
  }, 80);
})();


/* ---------------------------------------------------------
   2. SMART CURSOR — black on light bg, white on dark bg
   --------------------------------------------------------- */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
const trailCont  = document.getElementById('trailContainer');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;
let trailPoints = [];
const TRAIL_COUNT = 8;

// Sections tagged data-bg="dark" get a white cursor
// Sections tagged data-bg="light" get a black cursor
const darkSections  = Array.from(document.querySelectorAll('[data-bg="dark"]'));
const lightSections = Array.from(document.querySelectorAll('[data-bg="light"]'));

// Build trail dots
for (let i = 0; i < TRAIL_COUNT; i++) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  const size = (5 - i * 0.42).toFixed(1);
  dot.style.width   = size + 'px';
  dot.style.height  = size + 'px';
  dot.style.opacity = (0.5 - i * 0.05).toFixed(2);
  trailCont.appendChild(dot);
  trailPoints.push({ x: 0, y: 0, el: dot });
}

/* Determine if the cursor is currently over a dark section */
function isOverDarkSection() {
  for (const sec of darkSections) {
    const r = sec.getBoundingClientRect();
    if (mouseY >= r.top && mouseY <= r.bottom && mouseX >= r.left && mouseX <= r.right) {
      return true;
    }
  }
  return false;
}

/* Apply white or black colour to cursor + ring + trail */
function updateCursorColor() {
  const isDark = isOverDarkSection();
  if (isDark) {
    cursor.classList.add('cursor-white');
    cursorRing.classList.add('cursor-white');
    trailPoints.forEach(p => p.el.classList.add('cursor-white'));
  } else {
    cursor.classList.remove('cursor-white');
    cursorRing.classList.remove('cursor-white');
    trailPoints.forEach(p => p.el.classList.remove('cursor-white'));
  }
}

// Track mouse — update position AND colour on every move
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
  updateCursorColor();
});

// Also update on scroll (user scrolls without moving mouse)
window.addEventListener('scroll', updateCursorColor, { passive: true });

// RAF loop — animate lagging ring and trail
(function animateCursor() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  for (let i = TRAIL_COUNT - 1; i >= 0; i--) {
    if (i === 0) {
      trailPoints[0].x += (mouseX - trailPoints[0].x) * 0.3;
      trailPoints[0].y += (mouseY - trailPoints[0].y) * 0.3;
    } else {
      trailPoints[i].x += (trailPoints[i-1].x - trailPoints[i].x) * 0.4;
      trailPoints[i].y += (trailPoints[i-1].y - trailPoints[i].y) * 0.4;
    }
    trailPoints[i].el.style.left = trailPoints[i].x + 'px';
    trailPoints[i].el.style.top  = trailPoints[i].y + 'px';
  }

  requestAnimationFrame(animateCursor);
})();

// Hide/show when leaving/entering viewport
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorRing.style.opacity = '0';
  trailPoints.forEach(p => { p.el.style.opacity = '0'; });
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorRing.style.opacity = '1';
  trailPoints.forEach((p, i) => { p.el.style.opacity = (0.5 - i * 0.05).toFixed(2); });
});

// Hover states on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-item, .about-card, .filter-btn, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    cursorRing.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    cursorRing.classList.remove('hovered');
  });
});

// Click press effect
document.addEventListener('mousedown', () => {
  cursor.style.transform = 'translate(-50%,-50%) scale(0.65)';
});
document.addEventListener('mouseup', () => {
  cursor.style.transform = 'translate(-50%,-50%) scale(1)';
});


/* ---------------------------------------------------------
   3. NAVIGATION — scroll effect
   --------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  scrollTop.classList.toggle('show',  window.scrollY > 500);
});


/* ---------------------------------------------------------
   4. HAMBURGER / MOBILE MENU
   --------------------------------------------------------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  const isOpen = hamburger.classList.contains('active');
  if (isOpen) {
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => {
      mobileMenu.style.opacity = '1';
      mobileMenu.style.pointerEvents = 'all';
    });
  } else {
    mobileMenu.style.opacity = '0';
    mobileMenu.style.pointerEvents = 'none';
    setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
  }
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.style.opacity = '0';
    mobileMenu.style.pointerEvents = 'none';
    setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  });
});


/* ---------------------------------------------------------
   5. SMOOTH SCROLL
   --------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ---------------------------------------------------------
   6. SCROLL REVEAL — IntersectionObserver
   --------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---------------------------------------------------------
   7. PROJECT FILTER
   --------------------------------------------------------- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      // Animate out then hide, or show then animate in
      if (show) {
        card.style.display = 'block';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

// Set transition for filter animation
document.querySelectorAll('.project-card').forEach(card => {
  card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.5s, border-color 0.3s';
});


/* ---------------------------------------------------------
   8. PROJECT MODAL
   --------------------------------------------------------- */
const projectData = {
  bhojankart: {
    title:    'Bhojankart Mobile Screens',
    tag:      'UI/UX Design',
    desc:     'A fully designed mobile app UI for Bhojankart — a food ordering platform. The design focuses on appetite-triggering visuals, frictionless navigation, and a streamlined checkout experience. Key screens include home feed, restaurant pages, cart, and order tracking.',
    tool:     'Figma',
    cat:      'Mobile App UI/UX',
    platform: 'Mobile (iOS/Android)',
    bg:       'linear-gradient(135deg,#fde8d8,#f5c6a0)',
    label:    'Bhojankart'
  },
  gearsnepala: {
    title:    'Gears Nepal',
    tag:      'UI/UX Design',
    desc:     'An e-commerce interface designed for an automotive parts marketplace. The design emphasizes clear product categorization, trust signals, and a smooth buyer journey from search to purchase. Built with a clean, structured grid to handle dense product data elegantly.',
    tool:     'Figma',
    cat:      'E-commerce UI/UX',
    platform: 'Mobile App',
    bg:       'linear-gradient(135deg,#d9e8f0,#a8cfe0)',
    label:    'GearsNepal'
  },
  dashboard: {
    title:    'Financial Planning Dashboard',
    tag:      'UI/UX Design',
    desc:     'A minimal black-and-white dashboard designed to present complex financial data with clarity and elegance. Charts, KPIs, and projections are organized in a way that reduces cognitive load and guides the user toward actionable insights without visual noise.',
    tool:     'Figma',
    cat:      'Dashboard Design',
    platform: 'Web / Desktop',
    bg:       'linear-gradient(135deg,#e8e8e4,#c8c8c2)',
    label:    'Dashboard'
  }
};

const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose    = document.getElementById('modalClose');

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const p = projectData[btn.dataset.project];
    if (!p) return;
    document.getElementById('modalImgLabel').textContent = p.label;
    document.getElementById('modalImg').style.background = p.bg;
    document.getElementById('modalTag').textContent      = p.tag;
    document.getElementById('modalTitle').textContent    = p.title;
    document.getElementById('modalDesc').textContent     = p.desc;
    document.getElementById('modalTool').textContent     = p.tool;
    document.getElementById('modalCat').textContent      = p.cat;
    document.getElementById('modalPlatform').textContent = p.platform;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ---------------------------------------------------------
   9. PROFILE BLOB MORPH
   --------------------------------------------------------- */
const morphShapes = [
  '48% 52% 58% 42% / 44% 46% 54% 56%',
  '60% 40% 45% 55% / 50% 55% 45% 50%',
  '42% 58% 55% 45% / 56% 42% 58% 44%',
  '55% 45% 48% 52% / 48% 52% 55% 45%',
  '52% 48% 40% 60% / 54% 46% 50% 50%'
];
let morphStep = 0;
const profileFrame = document.getElementById('profileFrame');

setInterval(() => {
  morphStep = (morphStep + 1) % morphShapes.length;
  if (profileFrame) profileFrame.style.borderRadius = morphShapes[morphStep];
}, 3200);


/* ---------------------------------------------------------
   10. PARALLAX — subtle hero tilt on mouse move
   --------------------------------------------------------- */
const heroSection = document.getElementById('home');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect   = heroSection.getBoundingClientRect();
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const dx     = (e.clientX - rect.left - cx) / cx;  // -1 to 1
    const dy     = (e.clientY - rect.top  - cy) / cy;

    const frame = heroSection.querySelector('.profile-frame');
    if (frame) {
      frame.style.transform = `scale(1.01) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
    }
    const gridLines = heroSection.querySelectorAll('.hero-grid-lines span');
    gridLines.forEach((line, i) => {
      line.style.transform = `translateX(${dx * (i + 1) * 3}px)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    const frame = heroSection.querySelector('.profile-frame');
    if (frame) frame.style.transform = '';
    heroSection.querySelectorAll('.hero-grid-lines span').forEach(l => l.style.transform = '');
  });
}


/* ---------------------------------------------------------
   11. SKILLS — stagger the level-dot fill animation
   --------------------------------------------------------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const dots = entry.target.querySelectorAll('.skill-dot.active');
      dots.forEach((dot, i) => {
        dot.style.transitionDelay = (i * 80) + 'ms';
        dot.style.transform = 'scale(1.4)';
        setTimeout(() => { dot.style.transform = ''; }, 400 + i * 80);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));


/* ---------------------------------------------------------
   12. CONTACT FORM
   --------------------------------------------------------- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn      = e.target.querySelector('.contact-submit');
  const original = btn.textContent;

  btn.textContent = 'Sending…';
  btn.disabled    = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent     = 'Sent! ✓';
    btn.style.opacity   = '1';
    btn.style.background = '#d0e8c4';
    btn.style.color      = '#1a3a12';

    setTimeout(() => {
      btn.textContent      = original;
      btn.disabled         = false;
      btn.style.background = '';
      btn.style.color      = '';
      e.target.reset();
    }, 2500);
  }, 1800);
});


/* ---------------------------------------------------------
   13. TILT EFFECT on project cards
   --------------------------------------------------------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const dx    = (e.clientX - rect.left - cx) / cx;
    const dy    = (e.clientY - rect.top  - cy) / cy;
    card.style.transform = `translateY(-10px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    card.style.boxShadow = `${-dx * 14}px ${-dy * 14}px 40px rgba(10,10,10,0.12)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});


/* ---------------------------------------------------------
   14. SCROLL PROGRESS BAR (top of page)
   --------------------------------------------------------- */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; width: 0%;
  background: #0a0a0a; z-index: 9995; transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / total) * 100) + '%';
});


/* ---------------------------------------------------------
   15. ABOUT CARD — text scramble effect on hover (subtle)
   --------------------------------------------------------- */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scramble(el, original, iterations = 0) {
  if (iterations > original.length) { el.textContent = original; return; }
  el.textContent = original
    .split('')
    .map((ch, i) => i < iterations ? ch : (ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
    .join('');
  setTimeout(() => scramble(el, original, iterations + 1), 28);
}

document.querySelectorAll('.about-card h3').forEach(h3 => {
  const original = h3.textContent;
  h3.parentElement.addEventListener('mouseenter', () => scramble(h3, original));
});