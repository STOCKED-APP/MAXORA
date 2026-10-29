/* Maxora — account facoltativo: l'utente anonimo diventa un account con email (stesso utente, stessi dati)
   e preferiti / livello / impostazioni si salvano nel database e tornano su un altro telefono. */
(function () {
  'use strict';
  const M = window.MAXORA;
  if (!M) return;
  const { sb, el, toast } = M;
  const $ = (id) => document.getElementById(id);

  const TX = {
    it: {
      title: 'Account', anon: 'Preferiti, livello e impostazioni sono salvati solo su questo telefono.',
      save: 'Salva i miei dati con l\'email', restore: 'Ho già un account: recupera i dati', email: 'La tua email', send: 'Invia codice',
      code: 'Codice inviato a {e}. Controlla anche lo spam.', codePh: 'Codice', confirm: 'Conferma', cancel: 'Annulla',
      linked: 'Dati salvati con {e}', linkedSub: 'Preferiti, livello e impostazioni si sincronizzano su ogni telefono dove entri con questa email.',
      logout: 'Esci da questo telefono', saved: 'Dati salvati', restored: 'Dati recuperati', errEmail: 'Email non valida',
      errExists: 'Questa email ha già un account: usa «recupera i dati».', errCode: 'Codice errato o scaduto', errSend: 'Invio non riuscito, riprova tra qualche minuto',
      errNone: 'Nessun account con questa email', privacy: 'L\'email serve solo a salvare e recuperare i tuoi dati.', wait: 'Attendi…'
    },
    es: {
      title: 'Cuenta', anon: 'Favoritos, nivel y ajustes se guardan solo en este teléfono.',
      save: 'Guardar mis datos con el email', restore: 'Ya tengo cuenta: recuperar datos', email: 'Tu email', send: 'Enviar código',
      code: 'Código enviado a {e}. Revisa también el spam.', codePh: 'Código', confirm: 'Confirmar', cancel: 'Cancelar',
      linked: 'Datos guardados con {e}', linkedSub: 'Favoritos, nivel y ajustes se sincronizan en cada teléfono donde entres con este email.',
      logout: 'Salir en este teléfono', saved: 'Datos guardados', restored: 'Datos recuperados', errEmail: 'Email no válido',
      errExists: 'Este email ya tiene cuenta: usa «recuperar datos».', errCode: 'Código incorrecto o caducado', errSend: 'No se pudo enviar, inténtalo en unos minutos',
      errNone: 'No hay ninguna cuenta con este email', privacy: 'El email solo sirve para guardar y recuperar tus datos.', wait: 'Espera…'
    },
    en: {
      title: 'Account', anon: 'Favourites, level and settings are stored only on this phone.',
      save: 'Save my data with email', restore: 'I have an account: restore data', email: 'Your email', send: 'Send code',
      code: 'Code sent to {e}. Check spam too.', codePh: 'Code', confirm: 'Confirm', cancel: 'Cancel',
      linked: 'Data saved with {e}', linkedSub: 'Favourites, level and settings sync on every phone where you sign in with this email.',
      logout: 'Sign out on this phone', saved: 'Data saved', restored: 'Data restored', errEmail: 'Invalid email',
      errExists: 'This email already has an account: use “restore data”.', errCode: 'Wrong or expired code', errSend: 'Could not send, try again in a few minutes',
      errNone: 'No account with this email', privacy: 'Your email is used only to save and restore your data.', wait: 'Please wait…'
    },
    de: {
      title: 'Konto', anon: 'Favoriten, Level und Einstellungen sind nur auf diesem Telefon gespeichert.',
      save: 'Meine Daten per E-Mail sichern', restore: 'Ich habe ein Konto: Daten wiederherstellen', email: 'Deine E-Mail', send: 'Code senden',
      code: 'Code an {e} gesendet. Auch im Spam nachsehen.', codePh: 'Code', confirm: 'Bestätigen', cancel: 'Abbrechen',
      linked: 'Daten gesichert mit {e}', linkedSub: 'Favoriten, Level und Einstellungen werden auf jedem Telefon synchronisiert, auf dem du dich mit dieser E-Mail anmeldest.',
      logout: 'Auf diesem Telefon abmelden', saved: 'Daten gesichert', restored: 'Daten wiederhergestellt', errEmail: 'Ungültige E-Mail',
      errExists: 'Diese E-Mail hat schon ein Konto: «Daten wiederherstellen» verwenden.', errCode: 'Falscher oder abgelaufener Code', errSend: 'Senden fehlgeschlagen, in ein paar Minuten erneut versuchen',
      errNone: 'Kein Konto mit dieser E-Mail', privacy: 'Die E-Mail dient nur zum Sichern und Wiederherstellen deiner Daten.', wait: 'Bitte warten…'
    }
  };
  const tr = (k, v) => {
    const L = TX[M.lang()] || TX.es;
    let s = L[k] || TX.es[k] || k;
    if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); });
    return s;
  };

  // ------------------------------------------------------------------
  // Cosa si sincronizza: solo preferenze personali (niente cache, niente stati temporanei)
  // ------------------------------------------------------------------
  const KEYS = ['lang', 'theme', 'voice', 'sound', 'mapMode', 'recent', 'surfFavs', 'surfLevel', 'sportMode', 'tourDone'];
  const synced = (k) => KEYS.includes(k) || k.indexOf('tips2_') === 0;
  const raw = {
    get(k) { try { const v = localStorage.getItem('maxora_' + k); return v === null ? undefined : JSON.parse(v); } catch (e) { return undefined; } },
    set(k, v) { try { localStorage.setItem('maxora_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function collect() {
    const out = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.indexOf('maxora_') === 0) { const k = key.slice(7); if (synced(k)) out[k] = raw.get(k); }
      }
    } catch (e) {}
    return out;
  }
  function apply(data) {
    Object.keys(data || {}).forEach((k) => {
      if (!synced(k)) return;
      let v = data[k];
      if (k === 'surfFavs') v = Array.from(new Set([].concat(raw.get('surfFavs') || [], v || [])));  // preferiti: unione
      raw.set(k, v);
    });
  }

  const A = { user: null, step: null, mode: null, email: '', busy: false, timer: null };
  const linked = () => !!(A.user && !A.user.is_anonymous && A.user.email);

  async function push() {
    if (!linked()) return;
    const at = new Date().toISOString();
    const { error } = await sb.from('user_prefs').upsert({ user_id: A.user.id, data: collect(), updated_at: at });
    if (!error) raw.set('prefsAt', at);
  }
  async function pull(force) {
    if (!linked()) return false;
    const { data, error } = await sb.from('user_prefs').select('data,updated_at').eq('user_id', A.user.id).maybeSingle();
    if (error) return false;
    if (!data) { await push(); return false; }
    const local = raw.get('prefsAt');
    if (force || !local || data.updated_at > local) {
      apply(data.data);
      raw.set('prefsAt', data.updated_at);
      if (force) await push();   // unisce i preferiti del telefono nuovo
      return true;
    }
    return false;
  }
  function changed(k) {
    if (!linked() || !synced(k)) return;
    clearTimeout(A.timer);
    A.timer = setTimeout(push, 1500);
  }

  // ------------------------------------------------------------------
  // Riquadro nelle Impostazioni
  // ------------------------------------------------------------------
  const errMsg = (e) => {
    const m = ((e && (e.code || '')) + ' ' + (e && e.message || '')).toLowerCase();
    if (/email_exists|already been registered|already registered/.test(m)) return tr('errExists');
    if (/otp_expired|invalid|expired|token/.test(m)) return tr('errCode');
    if (/signups not allowed|user not found|otp_disabled/.test(m)) return tr('errNone');
    if (/email_address_invalid|validate email|invalid email/.test(m)) return tr('errEmail');
    return tr('errSend');
  };
  // visibile solo quando l'admin lo attiva (accounts_enabled) o in prova con ?account=1
  try { if (/[?&]account=1/.test(location.search)) localStorage.setItem('maxora_acctBeta', 'true'); } catch (e) {}
  A.on = raw.get('acctBeta') === true;
  sb.from('app_settings').select('value').eq('key', 'accounts_enabled').maybeSingle()
    .then((r) => { if (r && r.data && r.data.value === true) { A.on = true; draw(); } }, () => {});
  function draw() {
    const box = $('acctBox');
    if (!box) return;
    box.innerHTML = '';
    if (!A.on && !linked()) return;
    box.appendChild(el('div', { class: 'acct-k', text: tr('title') }));
    if (linked()) {
      box.append(
        el('div', { class: 'acct-t', text: '✓ ' + tr('linked', { e: A.user.email }) }),
        el('div', { class: 'acct-s', text: tr('linkedSub') }),
        el('button', { class: 'acct-b ghost', onclick: logout, text: tr('logout') })
      );
      return;
    }
    if (!A.step) {
      box.append(
        el('div', { class: 'acct-s', text: tr('anon') }),
        el('button', { class: 'acct-b', onclick: () => { A.mode = 'link'; A.step = 'email'; draw(); }, text: tr('save') }),
        el('button', { class: 'acct-b ghost', onclick: () => { A.mode = 'restore'; A.step = 'email'; draw(); }, text: tr('restore') })
      );
      return;
    }
    const msg = el('div', { class: 'acct-err' });
    if (A.step === 'email') {
      const inp = el('input', { class: 'acct-in', type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: tr('email'), value: A.email });
      const go = el('button', { class: 'acct-b', text: tr('send'), onclick: () => sendCode(inp.value.trim(), msg, go) });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go.click(); });
      box.append(el('div', { class: 'acct-s', text: A.mode === 'link' ? tr('save') : tr('restore') }), inp, msg, go,
        el('button', { class: 'acct-b ghost', onclick: reset, text: tr('cancel') }), el('div', { class: 'acct-p', text: tr('privacy') }));
      setTimeout(() => inp.focus(), 50);
    } else {
      const inp = el('input', { class: 'acct-in code', type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '10', placeholder: tr('codePh') });
      const go = el('button', { class: 'acct-b', text: tr('confirm'), onclick: () => verify(inp.value.replace(/\D/g, ''), msg, go) });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go.click(); });
      box.append(el('div', { class: 'acct-s', text: tr('code', { e: A.email }) }), inp, msg, go, el('button', { class: 'acct-b ghost', onclick: reset, text: tr('cancel') }));
      setTimeout(() => inp.focus(), 50);
    }
  }
  function reset() { A.step = null; A.mode = null; draw(); }
  function busy(btn, on) { A.busy = on; btn.disabled = on; if (on) { btn.dataset.t = btn.textContent; btn.textContent = tr('wait'); } else if (btn.dataset.t) btn.textContent = btn.dataset.t; }

  async function sendCode(email, msg, btn) {
    if (A.busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = tr('errEmail'); return; }
    busy(btn, true);
    const res = A.mode === 'link'
      ? await sb.auth.updateUser({ email })
      : await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    busy(btn, false);
    if (res.error) {
      msg.textContent = errMsg(res.error);
      return;
    }
    A.email = email; A.step = 'code'; draw();
  }
  async function verify(token, msg, btn) {
    if (A.busy) return;
    if (token.length < 6) { msg.textContent = tr('errCode'); return; }
    busy(btn, true);
    const res = await sb.auth.verifyOtp({ email: A.email, token, type: A.mode === 'link' ? 'email_change' : 'email' });
    if (res.error) { busy(btn, false); msg.textContent = errMsg(res.error); return; }
    const u = (await sb.auth.getUser()).data.user;
    A.user = u || A.user;
    if (A.mode === 'link') {
      await push();
      busy(btn, false); A.step = null; A.mode = null; draw();
      toast(tr('saved'));
    } else {
      await pull(true);
      toast(tr('restored'));
      setTimeout(() => location.reload(), 700);   // i moduli rileggono preferiti e impostazioni
    }
  }
  async function logout() {
    await sb.auth.signOut();
    raw.set('prefsAt', null);
    location.reload();   // l'app crea di nuovo un utente anonimo; i dati restano anche su questo telefono
  }

  sb.auth.onAuthStateChange((ev, session) => {
    const was = linked();
    A.user = session ? session.user : null;
    if (linked() && (ev === 'INITIAL_SESSION' || (ev === 'SIGNED_IN' && !was))) setTimeout(() => pull(false), 0);
    if (!A.step) draw();
  });
  M.onTexts(() => { if (!A.step) draw(); });
  draw();
  window.MAXORA_ACCOUNT = { changed, push, pull, linked };
})();
