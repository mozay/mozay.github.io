// Kaora web: dil seçimi (varsayılan İngilizce), görünürlük animasyonları, kart eğimi.
(function () {
  const S = window.KAORA_I18N || {};
  const DESTEK = ['en', 'tr', 'de', 'fr', 'it', 'es', 'nl', 'pt', 'pl', 'sv', 'da', 'nb', 'fi', 'cs', 'ro'];
  const ADLAR = { en: 'English', tr: 'Türkçe', de: 'Deutsch', fr: 'Français', it: 'Italiano', es: 'Español', nl: 'Nederlands', pt: 'Português', pl: 'Polski', sv: 'Svenska', da: 'Dansk', nb: 'Norsk', fi: 'Suomi', cs: 'Čeština', ro: 'Română' };

  function tahmin() {
    const p = new URLSearchParams(location.search).get('lang');
    if (p && DESTEK.includes(p)) return p;
    try { const k = localStorage.getItem('kaoraDil'); if (k && DESTEK.includes(k)) return k; } catch {}
    for (const l of navigator.languages || [navigator.language || 'en']) {
      const kod = String(l).slice(0, 2).toLowerCase();
      if (DESTEK.includes(kod)) return kod;
    }
    return 'en';
  }

  function uygula(dil) {
    const m = S[dil] || S.en || {};
    document.documentElement.lang = dil;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      const v = m[k] ?? (S.en || {})[k];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('select.lang').forEach((s) => { s.value = dil; });
    try { localStorage.setItem('kaoraDil', dil); } catch {}
  }

  document.querySelectorAll('select.lang').forEach((s) => {
    s.innerHTML = DESTEK.map((k) => `<option value="${k}">${ADLAR[k]}</option>`).join('');
    s.addEventListener('change', () => uygula(s.value));
  });
  uygula(tahmin());

  // Kaydırınca beliren bloklar.
  const io = new IntersectionObserver((girisler) => {
    girisler.forEach((g) => { if (g.isIntersecting) { g.target.classList.add('in'); io.unobserve(g.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 60}ms`; io.observe(el); });

  // Kartlarda hafif 3B eğim.
  const hareketAz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hareketAz) {
    document.querySelectorAll('.card').forEach((k) => {
      k.addEventListener('mousemove', (e) => {
        const r = k.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        k.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-4px)`;
      });
      k.addEventListener('mouseleave', () => { k.style.transform = ''; });
    });
  }

  // Ekran görüntüsü şeridi: ortadaki hafif büyük.
  const seri = document.querySelector('.shots');
  if (seri) {
    const guncelle = () => {
      const m = seri.getBoundingClientRect().left + seri.clientWidth / 2;
      seri.querySelectorAll('.shot').forEach((s) => {
        const r = s.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - m) / seri.clientWidth;
        s.style.opacity = String(Math.max(0.55, 1 - d * 0.9));
      });
    };
    seri.addEventListener('scroll', guncelle, { passive: true }); guncelle();
  }
})();
