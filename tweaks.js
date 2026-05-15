/* Squigs — Tweaks panel
   Three expressive controls: Stimmung (palette), Knetfaktor (wobble),
   Bewegung (calm/lively). Reshapes the feel of the whole page. */

(() => {
  const panel = document.getElementById('tweaksPanel');
  const closeBtn = document.getElementById('tweaksClose');
  const moodGrid = document.getElementById('moodGrid');
  const wobbleEl = document.getElementById('wobble');
  const livelySeg = document.getElementById('livelySeg');

  const state = Object.assign(
    { mood: 'fruehling', wobble: 2, lively: true },
    window.__SQUIGS_TWEAKS__ || {}
  );

  // ---- apply ----
  function apply() {
    document.documentElement.dataset.mood   = state.mood;
    document.documentElement.dataset.lively = String(state.lively);
    document.documentElement.style.setProperty('--wobble', String(state.wobble));

    // sync UI
    moodGrid.querySelectorAll('.mood').forEach(b => {
      b.classList.toggle('is-active', b.dataset.mood === state.mood);
    });
    wobbleEl.value = state.wobble;
    livelySeg.querySelectorAll('button').forEach(b => {
      b.classList.toggle('is-active', String(state.lively) === b.dataset.lively);
    });
  }

  function persist(patch) {
    Object.assign(state, patch);
    apply();
    try {
      window.parent.postMessage(
        { type: '__edit_mode_set_keys', edits: patch },
        '*'
      );
    } catch (_) { /* not in host */ }
  }

  // ---- listeners ----
  moodGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.mood');
    if (!btn) return;
    persist({ mood: btn.dataset.mood });
  });

  wobbleEl.addEventListener('input', () => {
    persist({ wobble: parseFloat(wobbleEl.value) });
  });

  livelySeg.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lively]');
    if (!btn) return;
    persist({ lively: btn.dataset.lively === 'true' });
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('is-open');
    try {
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    } catch (_) {}
  });

  // ---- host edit-mode protocol ----
  window.addEventListener('message', (ev) => {
    const t = ev.data && ev.data.type;
    if (t === '__activate_edit_mode')   panel.classList.add('is-open');
    if (t === '__deactivate_edit_mode') panel.classList.remove('is-open');
  });

  // Apply state immediately so look matches persisted values on load
  apply();

  // Announce after listener is live
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (_) {}
})();
