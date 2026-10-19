(function () {
  'use strict';
  var NUMBER = '918755122929'; // change here if the business confirms a different number
  var DEFAULT_MSG = 'Hello TRONIFY, I am interested in your lithium batteries. Please share product details and pricing.';

  function waLink(text) {
    return 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(text);
  }

  // WhatsApp buttons (product-specific when data-msg is set)
  document.querySelectorAll('.wa').forEach(function (a) {
    var p = a.getAttribute('data-msg');
    var msg = p ? 'Hello TRONIFY, I am interested in ' + p + '. Please share details and pricing.' : DEFAULT_MSG;
    a.href = waLink(msg);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  // Footer year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Sticky nav background
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('on', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Enquiry form -> WhatsApp
  var form = document.getElementById('form');
  var err = document.getElementById('err');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var cat = document.getElementById('f-cat').value;
    var name = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.replace(/[\s\-]/g, '').replace(/^(\+91|91|0)/, '');
    var note = document.getElementById('f-msg').value.trim();
    if (!cat) return (err.textContent = 'Please select a product category.');
    if (name.length < 2) return (err.textContent = 'Please enter your name.');
    if (!/^[6-9]\d{9}$/.test(phone)) return (err.textContent = 'Please enter a valid 10-digit mobile number.');
    err.textContent = '';
    var text = 'Hello TRONIFY, I would like to enquire.\n\nProduct: ' + cat + '\nName: ' + name + '\nPhone: ' + phone +
      (note ? '\nMessage: ' + note : '');
    window.open(waLink(text), '_blank', 'noopener');
  });


  // Hero slider (auto-rotating product images)
  var slides = document.querySelectorAll('#slider .sl'), dots = document.querySelectorAll('#dots i'), chip = document.getElementById('chip'), cur = 0;
  function show(n) {
    slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
    cur = n; slides[cur].classList.add('on'); dots[cur].classList.add('on');
    chip.textContent = slides[cur].getAttribute('data-chip');
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(function () { show((cur + 1) % slides.length); }, 3500);
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });

  // Scroll progress bar
  var prog = document.getElementById('prog');
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }, { passive: true });

  // Cursor spotlight on cards (desktop only)
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) document.querySelectorAll('.card,.f').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // GSAP animations
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.h-a', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 });
  gsap.from('.h-v', { x: 60, opacity: 0, scale: 0.94, duration: 1.1, ease: 'power3.out', delay: 0.3 });
  gsap.to('.frame', { y: -10, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  gsap.to('.g1', { y: 80, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-vis', { y: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  gsap.utils.toArray('.rv').forEach(function (el) {
    gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  ['.products .card', '.why .f', '.apps figure'].forEach(function (sel) {
    gsap.from(sel, { y: 50, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1, scrollTrigger: { trigger: sel, start: 'top 88%', once: true } });
  });
  if (fine) {
    // 3D tilt on hero visual
    var hv = document.querySelector('.hero-vis'), fr = document.querySelector('.frame');
    hv.addEventListener('mousemove', function (e) {
      var r = hv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(fr, { rotateY: x * 12, rotateX: -y * 10, transformPerspective: 900, duration: .5, ease: 'power2.out' });
    });
    hv.addEventListener('mouseleave', function () { gsap.to(fr, { rotateX: 0, rotateY: 0, duration: .8, ease: 'power3.out' }); });
    // Magnetic buttons
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .25, duration: .3 });
      });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' }); });
    });
  }
  // Image reveal + parallax on posters/portrait
  gsap.utils.toArray('.poster img,.portrait img').forEach(function (im) {
    gsap.fromTo(im, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.ticker', { opacity: 0, y: 20, duration: .8, scrollTrigger: { trigger: '.ticker', start: 'top 95%', once: true } });
})();
