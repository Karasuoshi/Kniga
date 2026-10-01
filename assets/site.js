/* Собирает страницу из assets/content.js. Тексты и картинки правятся в content.js, не здесь. */
(function () {
  var S = window.SITE;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function src(p) { return esc(p) + '?v=' + S.imgV; }
  function $(id) { return document.getElementById(id); }

  /* значки фактов о городе — часть оформления, не картинки */
  var ICON = {
    brick: '<path d="M8 56V22h48v34"/><path d="M5 22h54"/><path d="M14 33v-4a3 3 0 0 1 6 0v4zM29 33v-4a3 3 0 0 1 6 0v4zM44 33v-4a3 3 0 0 1 6 0v4zM14 46v-4a3 3 0 0 1 6 0v4zM44 46v-4a3 3 0 0 1 6 0v4z"/><path d="M27 56V45a5 5 0 0 1 10 0v11"/><path d="M3 56h58"/>',
    tree: '<circle cx="32" cy="22" r="13"/><circle cx="19" cy="30" r="9"/><circle cx="45" cy="30" r="9"/><path d="M32 36v20M25 56h14M32 44l-6-5M32 42l6-6"/>',
    bridge: '<path d="M4 40q28-26 56 0"/><path d="M4 32q28-26 56 0"/><path d="M12 34v-6M22 28v-8M32 26v-8M42 28v-8M52 34v-6"/><path d="M4 50q5-4 10 0t10 0 10 0 10 0 10 0 10 0"/><path d="M10 58q5-3 10 0t10 0 10 0 10 0"/>',
    village: '<path d="M6 54V38l11-10 11 10v16z"/><path d="M32 54V34l13-12 13 12v20z"/><path d="M14 54v-8h6v8M41 54v-9h8v9M15 38h4M42 33h6"/><path d="M2 54h60"/><path d="M50 12l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/>'
  };

  /* ---------- шапка ---------- */
  $('nav').innerHTML = S.nav.map(function (n) { return '<a href="#' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('');

  /* ---------- главный экран ---------- */
  var H = S.hero, hero = $('top');
  $('hero-eyebrow').textContent = H.eyebrow;
  $('hero-title').textContent = H.title;
  $('hero-text').textContent = H.text;
  $('hero-academy').textContent = H.btnAcademy;
  $('hero-note').textContent = H.note;
  var eyes = $('eyes'), city = $('city-art');
  eyes.textContent = H.btnOrdinary;
  eyes.hidden = true;
  /* картинку города вставляем прямо в страницу, чтобы работала кнопка «Глазами обычного человека» */
  fetch(src(H.img)).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) {
    city.innerHTML = t;
    var svg = city.querySelector('svg');
    if (!svg) throw 0;
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    svg.removeAttribute('width'); svg.removeAttribute('height');
    if (svg.querySelector('#mirage')) eyes.hidden = false;
  }).catch(function () {
    city.innerHTML = '<img src="' + src(H.img) + '" alt="' + esc(H.alt) + '">';
  });
  eyes.addEventListener('click', function () {
    var on = hero.classList.toggle('ordinary');
    eyes.setAttribute('aria-pressed', on);
    eyes.textContent = on ? H.btnWizard : H.btnOrdinary;
  });

  /* ---------- город ---------- */
  var C = S.city;
  $('city-head').innerHTML = '<span class="kicker">' + esc(C.kicker) + '</span><h2>' + esc(C.title) + '</h2>';
  $('facts').innerHTML = C.facts.map(function (f) {
    return '<div class="fact" style="color:var(--' + esc(f.color) + ')"><svg viewBox="0 0 64 64" aria-hidden="true">' + (ICON[f.icon] || '') + '</svg>' +
      '<h3>' + esc(f.title) + '</h3><p>' + esc(f.text) + '</p></div>';
  }).join('');

  /* ---------- академия ---------- */
  var A = S.academy;
  $('academy-head').innerHTML = '<span class="kicker">' + esc(A.kicker) + '</span><h2>' + esc(A.title) + '</h2>' +
    '<p class="lead">' + esc(A.lead1) + '</p><p class="sign">' + esc(A.sign) + '</p><p class="lead">' + esc(A.lead2) + '</p>';
  $('ledger').innerHTML = A.numbers.map(function (n) { return '<div><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'; }).join('');
  $('places').innerHTML = A.places.map(function (p) {
    return '<article class="place"><div class="pic">' + (p.img ? '<img src="' + src(p.img) + '" alt="' + esc(p.title) + '" loading="lazy">' : '') + '</div>' +
      '<h3>' + esc(p.title) + '</h3>' + (p.rule ? '<span class="rule">' + esc(p.rule) + '</span>' : '') + '<p>' + esc(p.text) + '</p></article>';
  }).join('');

  /* ---------- факультеты ---------- */
  var F = S.faculties;
  $('fac-head').innerHTML = '<span class="kicker">' + esc(F.kicker) + '</span><h2>' + esc(F.title) + '</h2><p class="lead">' + esc(F.lead) + '</p>';
  $('fac-list').innerHTML = F.list.map(function (f) {
    return '<article class="fac"><div class="art">' + (f.img ? '<img src="' + src(f.img) + '" alt="' + esc(f.title) + '" loading="lazy">' : '') + '</div>' +
      '<div class="txt"><span class="kicker">' + esc(f.kicker) + '</span><h3>' + esc(f.title) + '</h3>' +
      '<div class="chips">' + f.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
      f.text.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></article>';
  }).join('') + (F.blank ? '<div class="blank"><span class="kicker">' + esc(F.blank.kicker) + '</span><h3>' + esc(F.blank.title) + '</h3><p>' + esc(F.blank.intro) + '</p><ul>' +
    F.blank.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>' : '');

  /* ---------- персонажи ---------- */
  var K = S.characters;
  $('kids-head').innerHTML = '<span class="kicker">' + esc(K.kicker) + '</span><h2>' + esc(K.title) + '</h2><p class="lead">' + esc(K.lead) + '</p>';
  function wins(k) {
    return '<div class="wins">' + k.img.map(function (p) {
      var isSym = /(^|\/)symbol-[^\/]+\.svg$/.test(p);
      return '<div class="win" style="--c:' + esc(k.c) + '">' + (isSym
        ? '<i class="sym" style="--src:url(\'' + esc(new URL(p + '?v=' + S.imgV, document.baseURI).href) + '\')" aria-hidden="true"></i>'
        : '<img class="portrait" src="' + src(p) + '" alt="' + esc(k.name) + '" loading="lazy">') + '</div>';
    }).join('') + '</div>';
  }
  $('kids').innerHTML = K.list.map(function (k) {
    return '<button class="kid' + (k.wide ? ' wide' : '') + '" data-open="' + esc(k.id) + '" aria-label="Открыть: ' + esc(k.name) + '">' + wins(k) +
      '<div class="meta"><h3>' + esc(k.name) + '</h3><p class="tag">' + esc(k.tag) + '</p><span class="from">' + esc(K.from) + '</span></div></button>';
  }).join('');
  $('kids-note').textContent = K.note;

  /* ---------- словарь ---------- */
  var G = S.glossary;
  $('gloss-head').innerHTML = '<span class="kicker">' + esc(G.kicker) + '</span><h2>' + esc(G.title) + '</h2>';
  $('gloss').innerHTML = G.list.map(function (g) {
    var dd = esc(g[1]).replace(/\[\[герой:([a-z]+)\|([^\]]+)\]\]/g, '<a href="#$1" data-open="$1">$2</a>');
    return '<div><dt>' + esc(g[0]) + '</dt><dd>' + dd + '</dd></div>';
  }).join('');

  $('footer').textContent = S.footer;

  /* ---------- окно героя ---------- */
  var dlg = $('dlg'), body = $('dlg-body');
  function openKid(id) {
    var k = K.list.filter(function (x) { return x.id === id; })[0]; if (!k) return;
    body.innerHTML = '<div class="dlg' + (k.wide ? ' wide' : '') + '">' + wins(k) + '<div class="info">' +
      '<h2 id="dlg-name">' + esc(k.name) + '</h2><p class="tag">' + esc(k.tag) + '</p>' +
      '<div class="chips">' + k.traits.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<div><h4>Характер</h4><p>' + esc(k.about) + '</p></div>' +
      '<div class="pm"><div><h4>Сильная сторона</h4><p>' + esc(k.plus) + '</p></div><div><h4>Слабое место</h4><p>' + esc(k.minus) + '</p></div></div>' +
      '<div><h4>Уточнить у автора</h4><ul class="ask">' + k.ask.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>' +
      '</div></div>';
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); openKid(t.getAttribute('data-open')); }
  });
  $('dlg-close').onclick = function () { dlg.close(); };
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  var h = location.hash.slice(1);
  if (h && K.list.some(function (k) { return k.id === h; })) openKid(h);
})();
