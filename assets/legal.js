/* Maxora — pagine pubbliche: lingua (ES/EN/IT/DE) ed email di contatto da config.js */
(function () {
  'use strict';
  const LANGS = ['es', 'en', 'it', 'de'];
  let l = new URLSearchParams(location.search).get('lang');
  if (!LANGS.includes(l)) { try { l = JSON.parse(localStorage.getItem('maxora_lang')); } catch (e) { l = null; } }
  if (!LANGS.includes(l)) l = (navigator.language || 'es').slice(0, 2);
  if (!LANGS.includes(l)) l = 'es';
  function show(k) {
    document.documentElement.lang = k;
    document.querySelectorAll('article[data-l]').forEach((a) => a.classList.toggle('on', a.dataset.l === k));
    document.querySelectorAll('.lg-lang button').forEach((b) => b.classList.toggle('on', b.dataset.l === k));
  }
  document.querySelectorAll('.lg-lang button').forEach((b) => b.addEventListener('click', () => show(b.dataset.l)));
  show(l);
  const mail = (window.MAXORA_CONFIG && window.MAXORA_CONFIG.contactEmail) || '';
  document.querySelectorAll('.lg-mail').forEach((a) => { if (mail) { a.href = 'mailto:' + mail; a.textContent = mail; } });
})();
