const hero = document.getElementById('hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

document.body.classList.add('motion-ready');
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

if (hero && finePointer && !reducedMotion) {
  let heroFrame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (heroFrame) cancelAnimationFrame(heroFrame);
    heroFrame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      hero.style.setProperty('--hero-x', `${x * 9}px`);
      hero.style.setProperty('--hero-y', `${y * 7}px`);
      hero.style.setProperty('--hero-copy-x', `${x * -3}px`);
      hero.style.setProperty('--hero-copy-y', `${y * -2}px`);
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--hero-x', '0px');
    hero.style.setProperty('--hero-y', '0px');
    hero.style.setProperty('--hero-copy-x', '0px');
    hero.style.setProperty('--hero-copy-y', '0px');
  });
}

/* Shared interaction layer */
if (finePointer && !reducedMotion) {
  document.querySelectorAll('.pstack-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--glow-x', `${x * 100}%`);
      card.style.setProperty('--glow-y', `${y * 100}%`);
      card.style.setProperty('--rx', `${(0.5 - y) * 1.25}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 1.25}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  document.querySelectorAll('.pill').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mag-x', `${(event.clientX - rect.left - rect.width / 2) * 0.08}px`);
      button.style.setProperty('--mag-y', `${(event.clientY - rect.top - rect.height / 2) * 0.12}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--mag-x', '0px');
      button.style.setProperty('--mag-y', '0px');
    });
  });
}

const navTargets = [...document.querySelectorAll('.nlinks a[href^="#"], .mobile-menu a[href^="#"]')];
const observedSections = [...new Set(navTargets.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean))];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navTargets.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-42% 0px -48%', threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('formStatus');
contactForm?.addEventListener('submit', () => {
  contactForm.classList.remove('sent');
  contactForm.classList.add('transmitting');
});
if (contactStatus && contactForm) {
  new MutationObserver(() => {
    if (!contactStatus.textContent.trim()) return;
    contactForm.classList.remove('transmitting');
    if (contactStatus.classList.contains('ok')) contactForm.classList.add('sent');
  }).observe(contactStatus, { childList: true, characterData: true, subtree: true });
}

const experienceEntries = document.querySelectorAll('#experiencia .ent');
if ('IntersectionObserver' in window && !reducedMotion) {
  const logObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('log-active', entry.isIntersecting));
  }, { threshold: .22, rootMargin: '-4% 0px -8%' });
  experienceEntries.forEach((entry) => logObserver.observe(entry));
} else {
  experienceEntries.forEach((entry) => entry.classList.add('log-active'));
}

const experienceTimeline = document.querySelector('#experiencia .timeline-flow');
if (experienceTimeline) {
  let timelineTicking = false;
  const updateTimeline = () => {
    const rect = experienceTimeline.getBoundingClientRect();
    const start = window.innerHeight * .58;
    const distance = Math.max(1, rect.height - window.innerHeight * .22);
    const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
    document.getElementById('experiencia')?.style.setProperty('--timeline-progress', progress);
    timelineTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!timelineTicking) {
      requestAnimationFrame(updateTimeline);
      timelineTicking = true;
    }
  }, { passive: true });
  updateTimeline();
}

