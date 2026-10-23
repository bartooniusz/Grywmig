// Preview counterpart of the native theme navigation. WordPress keeps its own script.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-navigation');
  if (!toggle || !nav) return;
  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 820px)').matches) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();
