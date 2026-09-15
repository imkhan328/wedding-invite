/* =========================================================
   VALIMA INVITATION — CLEAN SCRIPT
   ========================================================= */

const scrollArea = document.getElementById('scrollArea');
const namesHeading = document.getElementById('names-heading');
const line1 = namesHeading?.querySelector('.line1');
const line2 = namesHeading?.querySelector('.line2');

const floralBg = document.querySelector('.floral-bg-image');
const particleContainer = document.getElementById('particles');
const bokehLayer = document.getElementById('bokehLayer');
const petalLayer = document.getElementById('petalLayer');
const petalsContainer = document.getElementById('petals-container');

const sealScreen = document.getElementById('seal-screen');
const sealWrap = document.getElementById('seal-wrap');

const musicToggle = document.getElementById('musicToggle');
const bgm = document.getElementById('bgm');

const fireflyLayer = document.getElementById('fireflies');

/* ---------- names ---------- */

const name1 = 'Mohamed Mohseen Khan';
const name2 = 'Sabah Khanum';

function wrapLetters(text) {
  return text.split('').map((char) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    return span;
  });
}

if (line1 && line2) {
  wrapLetters(name1).forEach((span, i) => {
    span.style.animationDelay = `${i * 0.045}s`;
    line1.appendChild(span);
  });

  wrapLetters(name2).forEach((span, i) => {
    span.style.animationDelay =
      `${name1.length * 0.045 + 0.3 + i * 0.045}s`;
    line2.appendChild(span);
  });
}

const namesAnimTotalMs =
  (name1.length * 0.045 + 0.3 + name2.length * 0.045 + 0.6) * 1000;

/* ---------- text effects ---------- */

function spawnSparkleBurst(target, count) {
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const symbols = ['✦', '✧', '⋆'];

  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-burst';
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
    sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
    sparkle.style.fontSize = `${0.7 + Math.random() * 0.8}rem`;
    sparkle.style.animationDelay = `${Math.random() * 0.25}s`;

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1400);
  }
}

function typeText(element, speed) {
  if (!element) return;

  const text = element.getAttribute('data-text') || '';
  const customSpeed = element.getAttribute('data-speed');
  if (customSpeed) speed = parseInt(customSpeed, 10);

  element.textContent = '';
  element.classList.add('typing');

  let i = 0;

  function step() {
    element.textContent = text.slice(0, i);
    i += 1;

    if (i <= text.length) {
      setTimeout(step, speed);
    } else {
      setTimeout(() => element.classList.remove('typing'), 900);
    }
  }

  step();
}

function revealChars(element, stagger) {
  if (!element) return;

  const text = element.getAttribute('data-text') || '';
  const customStagger = element.getAttribute('data-stagger');
  if (customStagger) stagger = parseInt(customStagger, 10);

  element.innerHTML = '';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'rchar';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${i * stagger}ms`;
    element.appendChild(span);
  });

  void element.offsetWidth;
  element.classList.add('animate');
}

/* ---------- scroll / parallax ---------- */
/*
   The scroll container moves.
   The main artwork stays inside a fixed, oversized viewport.
   Only transform is animated, so there is no layout jump or white gap.
*/

let parallaxFrame = null;

function updateParallax() {
  if (!scrollArea || !floralBg) return;

  const y = scrollArea.scrollTop;

  /* Cap movement to the built-in image overscan. */
  const maxShift = window.innerHeight * 0.035;
  const shift = Math.min(y * 0.025, maxShift);

  floralBg.style.transform = `translate3d(0, ${-shift}px, 0)`;
  parallaxFrame = null;
}

if (scrollArea && floralBg) {
  scrollArea.addEventListener('scroll', () => {
    if (!parallaxFrame) {
      parallaxFrame = requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
}

/* ---------- reveal-on-scroll ---------- */

if (scrollArea) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealChars(entry.target, 22);
      revealObserver.unobserve(entry.target);
    });
  }, {
    root: scrollArea,
    threshold: 0.4
  });

  document
    .querySelectorAll('.reveal-target')
    .forEach((element) => revealObserver.observe(element));

  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      typeText(entry.target, 26);
      typeObserver.unobserve(entry.target);
    });
  }, {
    root: scrollArea,
    threshold: 0.4
  });

  document
    .querySelectorAll('.type-target')
    .forEach((element) => typeObserver.observe(element));

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const delay = entry.target.classList.contains('medallion')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 90
        : 0;

      setTimeout(() => entry.target.classList.add('in-view'), delay);
      scrollObserver.unobserve(entry.target);
    });
  }, {
    root: scrollArea,
    threshold: 0.18
  });

  document
    .querySelectorAll('.anim, .event-card')
    .forEach((element) => scrollObserver.observe(element));
}

/* ---------- countdown ---------- */

const targetDate = new Date('2026-10-31T20:30:00+05:30').getTime();

function updateCountdown() {
  const distance = targetDate - Date.now();

  const elements = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs')
  };

  if (distance <= 0) {
    Object.values(elements).forEach((element) => {
      if (element) element.textContent = '0';
    });
    return;
  }

  if (elements.days) elements.days.textContent = Math.floor(distance / 86400000);
  if (elements.hours) elements.hours.textContent = Math.floor((distance % 86400000) / 3600000);
  if (elements.mins) elements.mins.textContent = Math.floor((distance % 3600000) / 60000);
  if (elements.secs) elements.secs.textContent = Math.floor((distance % 60000) / 1000);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- floating particles ---------- */

if (particleContainer) {
  const particleCount = window.innerWidth < 640 ? 14 : 24;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = 3 + Math.random() * 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.bottom = '-10px';
    particle.style.animationDuration = `${14 + Math.random() * 16}s`;
    particle.style.animationDelay = `${Math.random() * 20}s`;

    particleContainer.appendChild(particle);
  }
}

/* ---------- bokeh ---------- */

if (bokehLayer) {
  const bokehPositions = [
    { top: '12%', left: '8%', size: 120 },
    { top: '70%', left: '88%', size: 150 },
    { top: '40%', left: '92%', size: 90 },
    { top: '85%', left: '12%', size: 110 },
    { top: '55%', left: '50%', size: 70 }
  ];

  bokehPositions.forEach((item, i) => {
    const bokeh = document.createElement('div');
    bokeh.className = 'bokeh';
    bokeh.style.top = item.top;
    bokeh.style.left = item.left;
    bokeh.style.width = `${item.size}px`;
    bokeh.style.height = `${item.size}px`;
    bokeh.style.animationDuration = `${5 + i}s`;
    bokeh.style.animationDelay = `${i * 0.7}s`;

    bokehLayer.appendChild(bokeh);
  });
}

/* ---------- petals ---------- */

function createPetals() {
  if (!petalsContainer) return;

  const count = 16;

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}vw`;

    const size = 11 + Math.random() * 6;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animation =
      `petalFallShower ${3 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`;

    petalsContainer.appendChild(petal);
  }

  setTimeout(() => {
    petalsContainer.innerHTML = '';
  }, 6000);
}

/* ---------- opening seal ---------- */

if (sealWrap && sealScreen) {
  sealWrap.addEventListener('click', () => {
    sealWrap.classList.add('opening');

    createPetals();

    if (bgm) {
      bgm.play().then(() => {
        musicToggle?.classList.add('playing');
      }).catch(() => {
        /* Autoplay may be blocked; manual music button remains available. */
      });
    }

    setTimeout(() => {
      sealScreen.classList.add('hidden');

      if (namesHeading) {
        namesHeading.classList.add('animate');
        setTimeout(() => spawnSparkleBurst(namesHeading, 7), namesAnimTotalMs);
      }

      document.querySelectorAll('.anim').forEach((element, i) => {
        if (
          element.closest('.countdown') ||
          element.classList.contains('medallion')
        ) return;

        setTimeout(() => element.classList.add('in-view'), 80 + i * 60);
      });

      setTimeout(() => {
        typeText(document.querySelector('.subtitle'), 32);
      }, 900);
    }, 550);
  });
}

/* ---------- music ---------- */

if (bgm) {
  bgm.volume = 0.35;
}

if (musicToggle && bgm) {
  musicToggle.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play().then(() => {
        musicToggle.classList.add('playing');
      }).catch(() => {
        alert('Add music/music.mp3 to enable background music.');
      });
    } else {
      bgm.pause();
      musicToggle.classList.remove('playing');
    }
  });
}

/* ---------- fireflies ---------- */

if (fireflyLayer) {
  const count = window.innerWidth <= 640 ? 18 : 32;

  for (let i = 0; i < count; i += 1) {
    const firefly = document.createElement('span');
    firefly.className = 'firefly';

    const size = 2 + Math.random() * 4;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * -12;
    const drift = -90 + Math.random() * 180;
    const opacity = 0.3 + Math.random() * 0.5;

    firefly.style.width = `${size}px`;
    firefly.style.height = `${size}px`;
    firefly.style.left = `${Math.random() * 100}%`;
    firefly.style.top = `${50 + Math.random() * 50}%`;

    firefly.style.setProperty('--fly-time', `${duration}s`);
    firefly.style.setProperty('--fly-delay', `${delay}s`);
    firefly.style.setProperty('--fly-x', `${drift}px`);
    firefly.style.setProperty('--fly-opacity', opacity);

    fireflyLayer.appendChild(firefly);
  }
}
