(() => {
  'use strict';
  const init = () => {
    const filters = document.querySelector('.gwm-u-filters');
    const cards = [...document.querySelectorAll('.gwm-u-card[data-gwm-category]')];
    if (filters && cards.length) {
      filters.hidden = false;
      const status = document.querySelector('[data-gwm-filter-status]');
      filters.addEventListener('click', event => {
        const button = event.target.closest('[data-gwm-filter]');
        if (!button || !filters.contains(button)) return;
        const category = button.dataset.gwmFilter;
        filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        let count = 0;
        cards.forEach(card => {
          card.hidden = category !== 'all' && card.dataset.gwmCategory !== category;
          if (!card.hidden) count++;
        });
        if (status) status.textContent = `Kategoria: ${button.textContent.trim()}. Liczba gier: ${count}.`;
      });
    }

    const config = window.gwmUpgrade;
    if (!config || !Array.isArray(config.next) || !config.next.length) return;
    // Only known result containers are observed. No board/HUD mutations or guessed win text.
    document.querySelectorAll('[data-result].alibi-result, [data-haslo-result], [data-mj-result]').forEach(result => {
      const show = () => {
        if (result.hidden || result.getAttribute('aria-hidden') === 'true' || !result.getClientRects().length) return;
        if (result.querySelector('.gwm-u-result-next')) return;
        const section = document.createElement('div');
        section.className = 'gwm-u-result-next';
        const title = document.createElement('p');
        title.textContent = 'Masz ochotę na kolejną grę?';
        const links = document.createElement('div');
        config.next.slice(0, 3).forEach(game => {
          const url = new URL(game.url, window.location.href);
          if (url.origin !== window.location.origin || !['https:', 'http:'].includes(url.protocol)) return;
          const link = document.createElement('a');
          link.href = url.href;
          link.textContent = game.title + ' →';
          link.dataset.gwmTrack = 'next';
          link.dataset.fromGame = config.from;
          link.dataset.toGame = game.id;
          links.append(link);
        });
        if (links.childElementCount) { section.append(title, links); result.append(section); }
      };
      new MutationObserver(show).observe(result, { attributes: true, attributeFilter: ['hidden', 'class', 'aria-hidden'], childList: true });
      show();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
