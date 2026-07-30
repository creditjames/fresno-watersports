/* ============================================================
   FRESNO WATERSPORTS — Liquid Glass runtime
   - Injects the SVG displacement filters used by liquid-glass.css
   - Adds cursor-reactive specular glint + subtle 3D tilt to cards
   - Adds hero light caustics, god-rays, and floating price pills
   Fully self-contained & reversible: remove the <script>/<link>
   tags and the site returns to its previous state.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  /* ---- 1. Inject SVG displacement filters -------------------- */
  function injectFilters() {
    if (document.getElementById('lg-filters')) return;
    var svg =
      '<svg id="lg-filters" class="lg-svg" aria-hidden="true" focusable="false">' +
      '<filter id="lg-strong" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.011 0.013" numOctaves="2" seed="12" result="n"/>' +
      '<feGaussianBlur in="n" stdDeviation="1.3" result="nb"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="nb" scale="46" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>' +
      '<filter id="lg-subtle" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.014 0.016" numOctaves="2" seed="7" result="n"/>' +
      '<feGaussianBlur in="n" stdDeviation="1" result="nb"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="nb" scale="16" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>' +
      '</svg>';
    document.body.insertAdjacentHTML('afterbegin', svg);
  }

  /* ---- 2. Hero enhancements ---------------------------------- */
  function enhanceHero() {
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (hero && !hero.querySelector('.hero-caustics')) {
      var caustics = document.createElement('div');
      caustics.className = 'hero-caustics';
      var rays = document.createElement('div');
      rays.className = 'hero-rays';
      // place just above the video overlay, below the content
      var overlay = hero.querySelector('.hero-video-overlay');
      if (overlay && overlay.nextSibling) {
        hero.insertBefore(caustics, overlay.nextSibling);
        hero.insertBefore(rays, overlay.nextSibling);
      } else {
        hero.appendChild(caustics);
        hero.appendChild(rays);
      }
    }

    // Floating liquid-glass price pills under the hero actions
    if (content && !content.querySelector('.hero-pills')) {
      var actions = content.querySelector('.hero-actions');
      var pills = document.createElement('div');
      pills.className = 'hero-pills';
      pills.innerHTML =
        pill('$600', '2 Jet Skis / Day') +
        pill('$800', 'Boat / Day') +
        pill('4 Lakes', 'Delivery Available');
      if (actions && actions.nextSibling) {
        content.insertBefore(pills, actions.nextSibling);
      } else {
        content.appendChild(pills);
      }
    }

    // Pointer parallax on the soft glow orbs
    if (hero && canHover && !reduceMotion) {
      var orbs = hero.querySelectorAll('.hero-glow');
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        for (var i = 0; i < orbs.length; i++) {
          var depth = (i + 1) * 14;
          orbs[i].style.transform =
            'translate3d(' + (dx * depth).toFixed(1) + 'px,' +
            (dy * depth).toFixed(1) + 'px,0)';
        }
      });
    }
  }

  function pill(value, label) {
    return '<div class="hero-pill"><span class="pill-value">' + value +
      '</span><span class="pill-label">' + label + '</span></div>';
  }

  /* ---- 3. Cursor glint + 3D tilt on glass cards -------------- */
  function enhanceCards() {
    if (!canHover) return; // touch devices keep it simple
    var selectors = [
      '.delivery-card', '.testimonial-card', '.faq-item',
      '.stat-item', '.promo-banner', '.countdown-banner', '.lake-card'
    ];
    var cards = document.querySelectorAll(selectors.join(','));

    cards.forEach(function (card) {
      if (card.querySelector(':scope > .lg-glint')) return;
      var cs = window.getComputedStyle(card);
      if (cs.position === 'static') card.style.position = 'relative';
      card.classList.add('lg-tilt');

      var glint = document.createElement('span');
      glint.className = 'lg-glint';
      card.appendChild(glint);

      var maxTilt = card.classList.contains('lake-card') ? 4 : 6;

      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        glint.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        glint.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        if (!reduceMotion) {
          var rx = (0.5 - py) * maxTilt;
          var ry = (px - 0.5) * maxTilt;
          card.style.transform =
            'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' +
            ry.toFixed(2) + 'deg) translateY(-4px)';
        }
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  function init() {
    injectFilters();
    enhanceHero();
    enhanceCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
