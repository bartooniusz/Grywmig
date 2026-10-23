(() => {
  const events = new Set(['game_start','game_complete','hint_used','solution_revealed','share_click','next_game_click']);
  document.querySelectorAll('[data-gwm-halloween-embed]').forEach(wrapper => {
    const frame = wrapper.querySelector('iframe');
    if (!frame) return;
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.source !== frame.contentWindow || !event.data || typeof event.data !== 'object') return;
      const data = event.data;
      if (data.type === 'grywmig:halloween:resize' && Number.isFinite(data.height)) {
        frame.style.height = Math.max(320, Math.min(5000, data.height + 8)) + 'px';
      }
      if (data.type !== 'grywmig:halloween:event' || !events.has(data.action)) return;
      const detail = { game_id: 'halloween_alibi', game_name: 'Halloweenowe Alibi', case_id: String(data.case_id || '').slice(0, 40), hints_used: Math.max(0, Math.min(3, Number(data.hints) || 0)), attempts: Math.max(0, Number(data.attempts) || 0), elapsed_seconds: Math.max(0, Number(data.elapsed_seconds) || 0) };
      window.dispatchEvent(new CustomEvent('gwm:halloween_event', { detail: { event: data.action, ...detail } }));
      // Reuse the site's existing Google tag and its consent configuration; never load another tag.
      if (typeof window.gtag === 'function') window.gtag('event', data.action, detail);
    });
  });
})();
