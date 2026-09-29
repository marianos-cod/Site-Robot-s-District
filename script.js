/*
  Interações e animações leves do site estático.
  Sem dependências: HTML, CSS e JavaScript nativo.
*/
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const toast = document.querySelector('.toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };

  // Entradas suaves no viewport, equivalentes aos reveal da versão original.
  const revealGroups = [
    ['.hero-content > .eyebrow, .hero-content > h1, .hero-content > .hero-subtitle, .hero-content > .hero-tagline, .hero-content > .hero-buttons', 45],
    ['.stat', 55],
    ['.section-heading > .eyebrow, .section-heading > h2, .section-heading > p', 65],
    ['.first-intro, .frc-card, .value-grid article, .first-timeline article', 75],
    ['.team-top > .eyebrow, .team-top > h2, .team-copy, .season-note', 70],
    ['.season, .award-feature, .award-list article, .achievement-grid article', 70],
    ['.project-card, .identity-grid article, .robot-card', 75],
    ['.partners-heading, .partners-grid > div, .contact-copy > *, .contact-form', 60],
    ['.sources-section .source-list a, .pending-fields', 45],
  ];
  let revealElements = [];
  revealGroups.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.dataset.reveal) return;
      element.dataset.reveal = '';
      element.style.setProperty('--reveal-delay', `${index * Number(stagger)}ms`);
      revealElements.push(element);
    });
  });

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (revealElements.length && !motionPreference.matches && 'IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -24px 0px' });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuLinks = mobileNav ? Array.from(mobileNav.querySelectorAll('a')) : [];
  menuLinks.forEach((link, index) => {
    link.style.setProperty('--index', index);
    link.tabIndex = -1;
  });
  const setMenuOpen = (open) => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileNav.classList.toggle('is-open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    menuLinks.forEach((link) => { link.tabIndex = open ? 0 : -1; });
  };
  menuButton?.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  menuLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  document.querySelector('[data-language]')?.addEventListener('click', () => {
    showToast('A versão em inglês ainda está em preparação.');
  });

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const hex = button.getAttribute('data-copy');
      if (!hex) return;
      try {
        await navigator.clipboard.writeText(hex);
        showToast(`${hex} copiado para a área de transferência.`);
      } catch {
        showToast(`Código da cor: ${hex}`);
      }
    });
  });

  const dialog = document.querySelector('#project-dialog');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogCopy = document.querySelector('#dialog-copy');
  const projectCopy = {
    StarTeens: 'Um projeto para levar a experiência da FIRST para outras escolas, ampliar o acesso à robótica e despertar o interesse de estudantes por ciência e tecnologia.',
    'Automação Industrial': 'Desenvolvido em parceria com a Rockwell Automation. O projeto busca inovar a tecnologia, ampliar a educação STEAM e incentivar a participação de mulheres e jovens.',
    'Jane e a Sustentabilidade': 'Literatura, tecnologia, educação e sustentabilidade se encontram para aproximar crianças e estudantes das discussões sobre o meio ambiente.',
  };
  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-project') || '';
      if (!dialog || !dialogTitle || !dialogCopy) return;
      dialogTitle.textContent = name;
      dialogCopy.textContent = projectCopy[name] || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Formulário de demonstração: conecte um serviço para enviar a mensagem.');
  });
})();
