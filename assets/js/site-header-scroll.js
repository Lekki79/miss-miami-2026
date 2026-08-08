(() => {
  const header = document.getElementById('site-header');
  if (!header) return;

  const mobileViewport = window.matchMedia('(max-width: 1180px)');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  let lastScrollY = Math.max(window.scrollY, 0);
  let ticking = false;

  const menuIsOpen = () =>
    mobileMenu?.classList.contains('open') ||
    document.body.classList.contains('menu-open') ||
    header.querySelector('nav')?.classList.contains('open');

  const updateHeaderVisibility = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const onHero = header.classList.contains('on-hero');

    if (!mobileViewport.matches || onHero || menuIsOpen()) {
      header.classList.remove('mobile-header-hidden');
    } else if (currentScrollY > lastScrollY + 2) {
      header.classList.add('mobile-header-hidden');
    } else if (currentScrollY < lastScrollY - 2) {
      header.classList.remove('mobile-header-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeaderVisibility);
  };

  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  window.addEventListener('resize', requestHeaderUpdate);
  menuToggle?.addEventListener('click', () => {
    header.classList.remove('mobile-header-hidden');
    window.requestAnimationFrame(updateHeaderVisibility);
  });

  updateHeaderVisibility();
})();
