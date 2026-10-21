const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reducedMotion = false;
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const hero = document.getElementById('hero');

document.documentElement.classList.add('motion-enabled');
document.documentElement.toggleAttribute('data-system-reduced-motion', systemReducedMotion);

document.body.classList.add('motion-ready');
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
scrollProgress.innerHTML = '<span></span>';
document.body.appendChild(scrollProgress);

/* A restrained inertial scroll: desktop wheel only, keyboard and touch stay native. */
if (!reducedMotion) {
  document.documentElement.classList.add('inertial-scroll');
  let targetScroll = window.scrollY;
  let renderedScroll = window.scrollY;
  let smoothFrame = 0;
  let smoothing = false;

  const renderSmoothScroll = () => {
    renderedScroll += (targetScroll - renderedScroll) * .075;
    window.scrollTo(0, renderedScroll);
    if (Math.abs(targetScroll - renderedScroll) > .45) {
      smoothFrame = requestAnimationFrame(renderSmoothScroll);
    } else {
      renderedScroll = targetScroll;
      window.scrollTo(0, targetScroll);
      smoothing = false;
      smoothFrame = 0;
    }
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const multiplier = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? window.innerHeight : 1;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + event.deltaY * multiplier * .56));
    if (!smoothing) {
      renderedScroll = window.scrollY;
      smoothing = true;
      smoothFrame = requestAnimationFrame(renderSmoothScroll);
    }
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (!smoothing) {
      targetScroll = window.scrollY;
      renderedScroll = window.scrollY;
    }
  }, { passive: true });

  window.addEventListener('pagehide', () => {
    if (smoothFrame) cancelAnimationFrame(smoothFrame);
  });
}

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

const revealItems = document.querySelectorAll('.shead, .pstack-card, #stack .cat, .cert-feature, .cert-row, #contacto .contact > div');
revealItems.forEach((item) => item.classList.add('reveal-item'));

document.querySelectorAll('.pstack-card').forEach((card) => {
  card.querySelector('.ctext')?.classList.add('project-copy');
  card.querySelector('.output')?.classList.add('project-visual');
});

if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -8%' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
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
  const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('log-active');
      entryObserver.unobserve(entry.target);
    });
  }, { threshold: .2, rootMargin: '-4% 0px -8%' });
  experienceEntries.forEach((entry) => entryObserver.observe(entry));
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
    if (timelineTicking) return;
    requestAnimationFrame(updateTimeline);
    timelineTicking = true;
  }, { passive: true });
  updateTimeline();
}

const projectCards = [...document.querySelectorAll('.pstack-card')];
let visualTicking = false;
const updateScrollVisuals = () => {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pageProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
  scrollProgress.style.setProperty('--page-progress', pageProgress);

  if (!reducedMotion) {
    let activeProject = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    projectCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const distance = Math.abs(centerOffset);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeProject = card;
      }
      card.style.setProperty('--project-shift', `${Math.max(-18, Math.min(18, centerOffset * -24))}px`);
      card.style.setProperty('--project-progress', Math.min(1, Math.max(0, 1 - Math.abs(centerOffset))));
    });
    projectCards.forEach((card) => card.classList.toggle('case-active', card === activeProject));
  }
  visualTicking = false;
};

window.addEventListener('scroll', () => {
  if (visualTicking) return;
  requestAnimationFrame(updateScrollVisuals);
  visualTicking = true;
}, { passive: true });
window.addEventListener('resize', updateScrollVisuals, { passive: true });
updateScrollVisuals();

if (finePointer && !reducedMotion) {
  document.querySelectorAll('#proyectos, #stack').forEach((section) => {
    section.addEventListener('pointermove', (event) => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      section.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  });
}
