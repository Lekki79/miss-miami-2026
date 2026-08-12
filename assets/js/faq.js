(() => {
  const header = document.getElementById('site-header');
  const hero = document.querySelector('.faq-hero');
  const logo = header?.querySelector('.logo-img');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const setMenuState = open => {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);

    const bars = menuToggle.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      bars.forEach(bar => {
        bar.style.transform = '';
        bar.style.opacity = '';
      });
    }
  };

  menuToggle?.addEventListener('click', () => {
    setMenuState(!mobileMenu.classList.contains('open'));
  });
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  const updateHeaderState = () => {
    if (!header || !hero) return;
    const onHero = window.scrollY < Math.max(0, hero.offsetHeight - header.offsetHeight);
    header.classList.toggle('on-hero', onHero);
    const nextLogo = onHero ? logo?.dataset.heroLogo : logo?.dataset.lightLogo;
    if (nextLogo && logo.getAttribute('src') !== nextLogo) logo.setAttribute('src', nextLogo);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);

  const categoryTriggers = [...document.querySelectorAll('.faq-category-trigger')];
  const questionTriggers = [...document.querySelectorAll('.faq-question')];
  if (!categoryTriggers.length || !questionTriggers.length) return;

  const wrapDisclosureContent = (panel, innerClass) => {
    const inner = document.createElement('div');
    inner.className = innerClass;
    while (panel.firstChild) inner.appendChild(panel.firstChild);
    panel.appendChild(inner);
  };

  document.querySelectorAll('.faq-category-panel').forEach(panel => wrapDisclosureContent(panel, 'faq-category-panel-inner'));
  document.querySelectorAll('.faq-answer').forEach(answer => wrapDisclosureContent(answer, 'faq-answer-inner'));
  document.documentElement.classList.add('faq-enhanced');

  const disclosureTransitions = new WeakMap();
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDuration = 340;
  const transitionEasing = 'cubic-bezier(0.22, 1, 0.36, 1)';

  const clearPanelStyles = panel => {
    panel.style.removeProperty('height');
    panel.style.removeProperty('opacity');
    panel.style.removeProperty('overflow');
    panel.style.removeProperty('transition');
  };

  const setPanelState = (panel, open, { immediate = false } = {}) => {
    if (!panel) return Promise.resolve();

    const running = disclosureTransitions.get(panel);
    if (!running && open === !panel.hidden) return Promise.resolve();
    const currentHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    const currentOpacity = panel.hidden ? 0 : Number.parseFloat(getComputedStyle(panel).opacity) || 1;

    if (running) running.cancel(currentHeight, currentOpacity);

    if (immediate || reducedMotion()) {
      panel.hidden = !open;
      clearPanelStyles(panel);
      return Promise.resolve();
    }

    if (open) panel.hidden = false;
    panel.style.transition = 'none';
    panel.style.height = `${running ? currentHeight : (open ? 0 : currentHeight)}px`;
    panel.style.opacity = String(running ? currentOpacity : (open ? 0 : currentOpacity));
    panel.style.overflow = 'hidden';

    return new Promise(resolve => {
      let frameOne;
      let frameTwo;
      let fallbackTimer;
      let settled = false;

      const finish = () => {
        if (settled) return;
        settled = true;
        cancelAnimationFrame(frameOne);
        cancelAnimationFrame(frameTwo);
        clearTimeout(fallbackTimer);
        panel.removeEventListener('transitionend', onTransitionEnd);
        if (disclosureTransitions.get(panel)?.finish === finish) disclosureTransitions.delete(panel);
        if (!open) panel.hidden = true;
        clearPanelStyles(panel);
        resolve();
      };

      const cancel = (height, opacity) => {
        if (settled) return;
        settled = true;
        cancelAnimationFrame(frameOne);
        cancelAnimationFrame(frameTwo);
        clearTimeout(fallbackTimer);
        panel.removeEventListener('transitionend', onTransitionEnd);
        panel.style.transition = 'none';
        panel.style.height = `${height}px`;
        panel.style.opacity = String(opacity);
        panel.style.overflow = 'hidden';
        resolve();
      };

      const onTransitionEnd = event => {
        if (event.target === panel && event.propertyName === 'height') finish();
      };

      disclosureTransitions.set(panel, { cancel, finish });
      panel.addEventListener('transitionend', onTransitionEnd);

      frameOne = requestAnimationFrame(() => {
        frameTwo = requestAnimationFrame(() => {
          if (settled) return;
          const targetHeight = open ? panel.scrollHeight : 0;
          panel.style.transition = `height ${transitionDuration}ms ${transitionEasing}, opacity ${transitionDuration}ms ${transitionEasing}`;
          panel.style.height = `${targetHeight}px`;
          panel.style.opacity = open ? '1' : '0';
          fallbackTimer = window.setTimeout(finish, transitionDuration + 80);
        });
      });
    });
  };

  const closeQuestion = (question, options) => {
    const answer = document.getElementById(question.getAttribute('aria-controls'));
    question.setAttribute('aria-expanded', 'false');
    return setPanelState(answer, false, options);
  };

  const closeCategory = (categoryTrigger, options) => {
    const panel = document.getElementById(categoryTrigger.getAttribute('aria-controls'));
    categoryTrigger.setAttribute('aria-expanded', 'false');
    return setPanelState(panel, false, options);
  };

  let categoryRequest = 0;
  let questionRequest = 0;
  let pendingQuestion = null;

  categoryTriggers.forEach(trigger => {
    closeCategory(trigger, { immediate: true });
    trigger.addEventListener('click', async () => {
      const opening = trigger.getAttribute('aria-expanded') !== 'true';
      const request = ++categoryRequest;
      questionRequest += 1;
      pendingQuestion = null;

      if (!opening) {
        await closeCategory(trigger);
        return;
      }

      trigger.setAttribute('aria-expanded', 'true');
      const categoryClosures = categoryTriggers.filter(other => other !== trigger).map(async other => {
        await closeCategory(other);
        const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
        await Promise.all([...otherPanel?.querySelectorAll('.faq-question') || []].map(question => closeQuestion(question, { immediate: true })));
      });
      await Promise.all(categoryClosures);
      if (request !== categoryRequest || trigger.getAttribute('aria-expanded') !== 'true') return;
      await setPanelState(document.getElementById(trigger.getAttribute('aria-controls')), true);
    });
  });

  questionTriggers.forEach(question => {
    closeQuestion(question, { immediate: true });
    question.addEventListener('click', async () => {
      const request = ++questionRequest;
      const closingCurrent = question.getAttribute('aria-expanded') === 'true' || pendingQuestion === question;

      if (closingCurrent) {
        pendingQuestion = null;
        await closeQuestion(question);
        return;
      }

      pendingQuestion = question;
      await Promise.all(questionTriggers.filter(other => other !== question).map(closeQuestion));
      if (request !== questionRequest || pendingQuestion !== question) return;

      pendingQuestion = null;
      question.setAttribute('aria-expanded', 'true');
      await setPanelState(document.getElementById(question.getAttribute('aria-controls')), true);
    });
  });

  document.querySelectorAll('.close-category').forEach(closeButton => {
    closeButton.addEventListener('click', async () => {
      const category = closeButton.closest('.faq-category');
      const trigger = category?.querySelector('.faq-category-trigger');
      if (!trigger) return;
      await closeCategory(trigger);
      trigger.focus({ preventScroll: true });
      trigger.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center'
      });
    });
  });
})();
