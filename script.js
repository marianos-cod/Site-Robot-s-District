/*
  Interações pequenas do site.
  Todo o conteúdo e a estrutura continuam editáveis diretamente em index.html.
*/
(() => {
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

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    mobileNav.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
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
