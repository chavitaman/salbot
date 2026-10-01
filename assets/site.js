(function () {
  var NUMBER = '+13127667508';
  var NUMBER_PRETTY = '(312) 766-7508';
  var BODY = "hi salbot";

  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  var isAndroid = /Android/i.test(ua);
  var isPhone = isIOS || isAndroid;

  // iOS uses "&body=", Android uses "?body="
  var smsHref = 'sms:' + NUMBER + (isIOS ? '&' : '?') + 'body=' + encodeURIComponent(BODY).replace(/'/g, '%27');


  // Mobile menu (hamburger + side drawer)
  (function () {
    var nav = document.querySelector('header.nav nav');
    if (!nav) return;
    var page = (location.pathname.split('/').pop() || 'index.html');
    var home = page === 'index.html' || page === '';
    var links = [
      ['How it works', (home ? '' : 'index.html') + '#how'],
      ['Instacart', (home ? '' : 'index.html') + '#instacart'],
      ["Why we're different", 'why.html'],
      ['About Sal', 'about.html']
    ];
    var arrow = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    var btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'site-menu');
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    nav.appendChild(btn);

    var scrim = document.createElement('div');
    scrim.className = 'drawer-scrim';
    var drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.id = 'site-menu';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Menu');
    drawer.setAttribute('hidden', '');
    drawer.innerHTML =
      '<div class="drawer-top"><a class="brand" href="index.html"><img src="assets/img/logo.jpg" alt=""><span>salbot</span></a>' +
      '<button class="drawer-close" type="button" aria-label="Close menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<nav class="drawer-links" aria-label="Menu">' +
      links.map(function (l) { return '<a href="' + l[1] + '"' + (l[1] === page ? ' aria-current="page"' : '') + '>' + l[0] + arrow + '</a>'; }).join('') +
      '</nav>' +
      '<div class="drawer-small"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div>' +
      '<div class="drawer-foot"><a class="cta" data-text-salbot href="' + smsHref + '">Text salbot ' + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '<p class="fineprint">Msg &amp; data rates may apply. Reply STOP anytime.</p></div>';
    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    function open() {
      drawer.removeAttribute('hidden');
      requestAnimationFrame(function () { document.documentElement.classList.add('menu-open'); });
      btn.setAttribute('aria-expanded', 'true');
      drawer.querySelector('.drawer-close').focus();
    }
    function close(returnFocus) {
      document.documentElement.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
      setTimeout(function () { if (!document.documentElement.classList.contains('menu-open')) drawer.setAttribute('hidden', ''); }, 300);
      if (returnFocus !== false) btn.focus();
    }
    btn.addEventListener('click', open);
    scrim.addEventListener('click', function () { close(); });
    drawer.querySelector('.drawer-close').addEventListener('click', function () { close(); });
    drawer.querySelectorAll('.drawer-links a').forEach(function (a) { a.addEventListener('click', function () { close(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!document.documentElement.classList.contains('menu-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = drawer.querySelectorAll('a,button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  document.querySelectorAll('[data-text-salbot]').forEach(function (el) {
    el.setAttribute('href', smsHref);
    if (!isPhone) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openDialog();
      });
    }
  });

  // Desktop: show a QR code + number instead of trying to open Messages
  var dialog;
  function openDialog() {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'textus';
      dialog.setAttribute('aria-labelledby', 'textus-title');
      dialog.innerHTML =
        '<div style="position:relative">' +
        '<button class="textus-close" type="button" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="textus-in">' +
        '<img src="assets/img/logo.jpg" alt="" width="72" height="72" style="border-radius:50%">' +
        '<h2 id="textus-title" class="display" style="font-size:38px">Grab your phone.</h2>' +
        '<p class="body" style="font-size:17px;color:var(--muted)">Scan to text salbot from your phone. One text and your first week starts taking shape.</p>' +
        '<img class="qr" src="assets/img/text-salbot-qr.svg" alt="QR code that opens a text to salbot">' +
        '<span class="textus-num">' + NUMBER_PRETTY + '</span>' +
        '<p class="fineprint">By texting salbot you agree to receive recurring automated messages. Msg frequency varies. Msg &amp; data rates may apply. Reply STOP to cancel, HELP for help. <a href="terms.html">Terms</a> · <a href="privacy.html">Privacy</a></p>' +
        '</div></div>';
      document.body.appendChild(dialog);
      dialog.querySelector('.textus-close').addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    }
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.location.href = smsHref;
  }

  // Build iPhone chrome around each .thread
  var LOGO = 'assets/img/logo.jpg';
  var sig = '<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>';
  function bat(level) {
    return '<svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="#000" stroke-opacity="0.4"/><rect x="2" y="2" width="' + level + '" height="9" rx="2"/><rect x="25" y="4.5" width="1.5" height="4" rx="0.75" fill-opacity="0.4"/></svg>';
  }
  var back = '<svg class="back" width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2L2 10l8 8" stroke="#0A7AFF" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var chev = '<svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true"><path d="M1 1l4 4-4 4" stroke="#8E8E93" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
  var input = '<div class="inputbar"><div class="plus"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="#6E6E73" stroke-width="2" stroke-linecap="round"/></svg></div><div class="field">Text Message<svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="#6E6E73" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="3" y="1" width="6" height="9" rx="3"/><path d="M1 8a5 5 0 0 0 10 0M6 13v2"/></svg></div></div><div class="homebar"><span></span></div>';

  document.querySelectorAll('.iphone').forEach(function (phone) {
    var thread = phone.querySelector('.thread');
    if (!thread) return;
    var time = phone.getAttribute('data-time') || '9:41';
    var level = phone.getAttribute('data-battery') || '17';
    var group = phone.getAttribute('data-group');
    var head = group
      ? '<div class="gavs"><span class="gav" style="background:#C8431A;margin-right:-8px">J</span><img class="gav logo" src="' + LOGO + '" alt=""><span class="gav" style="background:#2F6B45;margin-left:-8px">A</span></div><div class="mname">' + group + ' ' + chev + '</div>'
      : '<img class="mav" src="' + LOGO + '" alt=""><div class="mname">salbot ' + chev + '</div>';
    var screen = document.createElement('div');
    screen.className = 'screen';
    screen.innerHTML = '<div class="island"></div><div class="status"><span>' + time + '</span><span class="sicons">' + sig + bat(level) + '</span></div><div class="mhead">' + back + head + '</div>';
    screen.appendChild(thread);
    screen.insertAdjacentHTML('beforeend', input);
    phone.insertAdjacentHTML('afterbegin', '<span class="hw" style="left:-6px;top:124px;height:30px"></span><span class="hw" style="left:-6px;top:178px;height:58px"></span><span class="hw" style="left:-6px;top:248px;height:58px"></span><span class="hw" style="right:-6px;top:200px;height:92px"></span>');
    phone.appendChild(screen);
  });

  // Looping demo: reveal messages one by one
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.demo').forEach(function (thread) {
    if (reduce) return;
    var items = Array.prototype.slice.call(thread.children).slice(1); // keep the timestamp
    var i = 0;
    function reset() { items.forEach(function (el) { el.classList.add('pending'); }); i = 0; }
    function step() {
      if (i < items.length) {
        var el = items[i++];
        el.style.display = '';
        el.classList.remove('pending');
        var isBot = el.classList.contains('bot') || el.querySelector('.og');
        setTimeout(step, isBot ? 1100 : 900);
      } else {
        setTimeout(function () { reset(); setTimeout(step, 600); }, 3500);
      }
    }
    reset();
    var started = false;
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) { started = true; step(); }
    }, { threshold: 0.3 }) : null;
    if (io) io.observe(thread); else step();
  });
})();
