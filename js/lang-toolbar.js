/**
 * Language switcher toolbar.
 * Reads the languages to display from the script tag's data-langs attribute:
 *   <script src="js/lang-toolbar.js" data-langs="en,da,de"></script>
 * Falls back to ["en"] if the attribute is absent.
 * The current lang is read from the `lang` query param; missing param = "en".
 */
(function () {
  const script =
    document.currentScript ||
    document.querySelector('script[src*="lang-toolbar"]');
  const langs = script
    ? (script.getAttribute('data-langs') || 'en').split(',').map(s => s.trim())
    : ['en'];

  if (langs.length <= 1) return; // nothing to switch to

  const current =
    new URLSearchParams(window.location.search).get('lang') || 'en';

  const bar = document.createElement('div');
  bar.id = 'lang-toolbar';
  Object.assign(bar.style, {
    position: 'fixed',
    top: '12px',
    right: '16px',
    zIndex: '9999',
    fontFamily: 'monospace',
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#fff',
    background: 'rgba(0,0,0,0.45)',
    borderRadius: '4px',
    padding: '3px 8px',
    opacity: '0.5',
    transition: 'opacity 0.2s',
    userSelect: 'none',
    pointerEvents: 'auto',
  });

  bar.addEventListener('mouseenter', () => (bar.style.opacity = '0.85'));
  bar.addEventListener('mouseleave', () => (bar.style.opacity = '0.35'));

  langs.forEach((lang, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.textContent = ' | ';
      sep.style.opacity = '0.45';
      bar.appendChild(sep);
    }

    const el = document.createElement('span');
    el.textContent = lang;

    if (lang === current) {
      el.style.fontWeight = '700';
      el.style.opacity = '1';
    } else {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const url = new URL(window.location.href);
        if (lang === 'en') {
          url.searchParams.delete('lang');
        } else {
          url.searchParams.set('lang', lang);
        }
        window.location.href = url.toString();
      });
    }

    bar.appendChild(el);
  });

  // Use requestAnimationFrame so Reveal.js has finished its DOM setup
  requestAnimationFrame(() => document.body.appendChild(bar));
})();
