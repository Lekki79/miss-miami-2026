(() => {
  const header = document.getElementById('site-header');
  if (!header) {
    document.documentElement.classList.remove('site-header-booting');
    return;
  }

  const threshold = 4;
  const directionDelta = 2;
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  let ticking = false;
  let initialized = false;
  let lastScrollY = Math.max(window.scrollY, 0);

  if (menuToggle && !menuToggle.dataset.closedLabel) {
    menuToggle.dataset.closedLabel = menuToggle.getAttribute('aria-label') || 'Open menu';
  }

  const menuIsOpen = () =>
    mobileMenu?.classList.contains('open') ||
    document.body.classList.contains('menu-open') ||
    header.querySelector('nav')?.classList.contains('open');

  const updateHeaderVisibility = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const atTop = currentScrollY <= threshold;
    const menuOpen = menuIsOpen();

    if (!initialized) {
      header.classList.toggle('site-header-hidden', !atTop && !menuOpen);
      initialized = true;
    } else if (atTop || menuOpen) {
      header.classList.remove('site-header-hidden');
    } else if (currentScrollY > lastScrollY + directionDelta) {
      header.classList.add('site-header-hidden');
    } else if (currentScrollY < lastScrollY - directionDelta) {
      header.classList.remove('site-header-hidden');
    }

    if (atTop || Math.abs(currentScrollY - lastScrollY) > directionDelta) {
      lastScrollY = currentScrollY;
    }
    document.documentElement.classList.remove('site-header-booting');
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeaderVisibility);
  };

  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  window.addEventListener('resize', requestHeaderUpdate);
  window.addEventListener('pageshow', requestHeaderUpdate);
  menuToggle?.addEventListener('click', requestHeaderUpdate);
  menuToggle?.addEventListener('pointerup', event => {
    if (event.pointerType !== '') menuToggle.blur();
  });

  requestHeaderUpdate();
})();
