/* squigs homepage — interactions */

// ============ GALLERY FILTER ============
(() => {
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('#galleryGrid .card');
  const counts = document.querySelectorAll('.chip__count');

  // compute counts
  const tally = { all: cards.length };
  cards.forEach(c => {
    const col = c.dataset.color;
    tally[col] = (tally[col] || 0) + 1;
  });
  counts.forEach(el => {
    const k = el.dataset.count;
    el.textContent = tally[k] || 0;
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset.filter;
      cards.forEach(card => {
        const match = f === 'all' || card.dataset.color === f;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
})();

// ============ VIDEO CARDS ============
(() => {
  document.querySelectorAll('.vcard__play').forEach(btn => {
    const v = btn.parentElement.querySelector('video');
    if (!v) return;
    btn.addEventListener('click', () => {
      if (v.paused) {
        v.play();
        btn.classList.add('is-playing');
      } else {
        v.pause();
        btn.classList.remove('is-playing');
      }
    });
    // pause on visibility leave
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (!e.isIntersecting && !v.paused) {
          v.pause();
          btn.classList.remove('is-playing');
        }
      });
    }, { threshold: 0.25 });
    io.observe(v);
  });
})();

// ============ FORM ============
(() => {
  const form = document.getElementById('commissionForm');
  if (!form) return;
  const sizeInputs = form.querySelectorAll('input[name="size"]');
  const priceEl = document.getElementById('priceAmt');
  const okEl = document.getElementById('formOk');

  const PRICE = { small: '€38', medium: '€58', large: '€85' };
  sizeInputs.forEach(i => i.addEventListener('change', () => {
    priceEl.textContent = PRICE[i.value] || '€38';
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !email) {
      form.querySelector('input[required]:invalid')?.focus();
      return;
    }
    okEl.hidden = false;
    const r = okEl.getBoundingClientRect();
    if (r.bottom > window.innerHeight) {
      window.scrollTo({ top: window.scrollY + r.bottom - window.innerHeight + 24, behavior: 'smooth' });
    }
    form.querySelector('button[type=submit]').disabled = true;
    form.querySelector('button[type=submit]').textContent = 'gesendet ♡';
  });
})();

// ============ NAV smooth scroll for in-page links ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 12, behavior: 'smooth' });
  });
});
