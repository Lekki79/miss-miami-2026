(() => {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const form = document.getElementById('contact-form');
  if (toggle && menu) {
    const setMenu = (open, returnFocus = false) => {
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
      const bars = toggle.querySelectorAll('span');
      if (bars.length === 3) {
        bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
        bars[1].style.opacity = open ? '0' : '';
        bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      }
      if (!open && returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
    document.addEventListener('site-header:close-menu', () => setMenu(false));
  }

  if (!form) return;
  const nativeSubject = document.getElementById('subject');
  const subjectWidget = document.querySelector('[data-subject-select]');
  const subjectTrigger = document.getElementById('subject-trigger');
  const subjectListbox = document.getElementById('subject-listbox');
  const subjectLabel = subjectTrigger?.querySelector('[data-subject-label]');
  const subjectOptions = subjectListbox ? [...subjectListbox.querySelectorAll('[role="option"]')] : [];
  let activeSubjectIndex = 0;

  const setSubjectOpen = (open, returnFocus = false) => {
    if (!subjectTrigger || !subjectListbox) return;
    subjectTrigger.setAttribute('aria-expanded', String(open));
    subjectListbox.hidden = !open;
    subjectWidget?.classList.toggle('is-open', open);
    if (open) {
      const selectedIndex = subjectOptions.findIndex(option => option.getAttribute('aria-selected') === 'true');
      activeSubjectIndex = selectedIndex >= 0 ? selectedIndex : 0;
      subjectOptions[activeSubjectIndex]?.classList.add('is-active');
      subjectOptions[activeSubjectIndex]?.focus();
    } else {
      subjectOptions.forEach(option => option.classList.remove('is-active'));
      if (returnFocus) subjectTrigger.focus();
    }
  };
  const chooseSubject = option => {
    if (!nativeSubject || !subjectLabel) return;
    nativeSubject.value = option.dataset.value || '';
    subjectLabel.textContent = option.textContent.trim();
    subjectTrigger.classList.add('has-value');
    subjectOptions.forEach(item => item.setAttribute('aria-selected', String(item === option)));
    nativeSubject.dispatchEvent(new Event('change', { bubbles: true }));
    setSubjectOpen(false, true);
  };
  const moveSubjectFocus = index => {
    activeSubjectIndex = Math.max(0, Math.min(subjectOptions.length - 1, index));
    subjectOptions.forEach((option, optionIndex) => option.classList.toggle('is-active', optionIndex === activeSubjectIndex));
    subjectOptions[activeSubjectIndex]?.focus();
  };
  subjectTrigger?.addEventListener('click', () => setSubjectOpen(subjectTrigger.getAttribute('aria-expanded') !== 'true'));
  subjectTrigger?.addEventListener('keydown', event => {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setSubjectOpen(true);
      if (event.key === 'End' || event.key === 'ArrowUp') moveSubjectFocus(subjectOptions.length - 1);
      if (event.key === 'Home' || event.key === 'ArrowDown') moveSubjectFocus(0);
    }
  });
  subjectOptions.forEach((option, index) => {
    option.addEventListener('click', () => chooseSubject(option));
    option.addEventListener('pointermove', () => { activeSubjectIndex = index; subjectOptions.forEach((item, i) => item.classList.toggle('is-active', i === index)); });
    option.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); moveSubjectFocus((index + 1) % subjectOptions.length); }
      if (event.key === 'ArrowUp') { event.preventDefault(); moveSubjectFocus((index - 1 + subjectOptions.length) % subjectOptions.length); }
      if (event.key === 'Home') { event.preventDefault(); moveSubjectFocus(0); }
      if (event.key === 'End') { event.preventDefault(); moveSubjectFocus(subjectOptions.length - 1); }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseSubject(option); }
      if (event.key === 'Escape') { event.preventDefault(); setSubjectOpen(false, true); }
      if (event.key === 'Tab') setSubjectOpen(false);
    });
  });
  document.addEventListener('pointerdown', event => {
    if (subjectTrigger?.getAttribute('aria-expanded') === 'true' && !subjectWidget?.contains(event.target)) setSubjectOpen(false);
  });

  const controls = [...form.querySelectorAll('input, select, textarea')];
  const status = document.getElementById('form-status');
  const messages = {
    'first-name': 'Please enter your first name.',
    'last-name': 'Please enter your last name.',
    email: 'Please enter a valid email address.',
    subject: 'Please select a subject.',
    message: 'Please enter your message.'
  };
  const validate = control => {
    const value = control.value.trim();
    const valid = value !== '' && (control.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    control.setAttribute('aria-invalid', String(!valid));
    if (control === nativeSubject) subjectTrigger?.setAttribute('aria-invalid', String(!valid));
    const error = document.getElementById(`${control.id}-error`);
    if (error) error.textContent = valid ? '' : messages[control.id];
    return valid;
  };
  controls.forEach(control => {
    control.addEventListener('blur', () => validate(control));
    control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', () => {
      if (control.getAttribute('aria-invalid') === 'true') validate(control);
      if (status) status.textContent = '';
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = controls.filter(control => !validate(control));
    if (invalid.length) {
      if (status) status.textContent = 'Please review the highlighted fields.';
      invalid[0].focus();
      return;
    }
    if (status) status.textContent = 'Online submission is not connected yet. Please email info@missmiamiofficial.com to send this message.';
  });
})();
