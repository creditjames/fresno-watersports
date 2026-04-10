/* ============================================
   FRESNO WATERSPORTS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Page Loader ---
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 600);
    });
    // Fallback: remove loader after 3s even if load event is slow
    setTimeout(() => loader.classList.add('loaded'), 3000);
  }

  // --- Announcement Banner Close ---
  const annBanner = document.getElementById('announcement-banner');
  const annClose = document.getElementById('announcement-close');
  if (annBanner && annClose) {
    if (sessionStorage.getItem('banner-closed')) {
      annBanner.classList.add('hidden');
    }
    annClose.addEventListener('click', () => {
      annBanner.classList.add('hidden');
      sessionStorage.setItem('banner-closed', '1');
    });
  }

  // --- Navbar Scroll Effect ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile Menu Toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal (Intersection Observer) ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });

  // --- Testimonials Carousel ---
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;

    const getVisibleCards = () => {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    };

    const totalCards = track.children.length;

    const updateCarousel = () => {
      const visible = getVisibleCards();
      const maxIndex = Math.max(0, totalCards - visible);
      currentIndex = Math.min(currentIndex, maxIndex);
      const pct = (currentIndex / totalCards) * 100;
      track.style.transform = `translateX(-${pct}%)`;
    };

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const visible = getVisibleCards();
      const maxIndex = Math.max(0, totalCards - visible);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    window.addEventListener('resize', updateCarousel);

    // Auto-play
    let autoPlay = setInterval(() => {
      const visible = getVisibleCards();
      const maxIndex = Math.max(0, totalCards - visible);
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    }, 5000);

    // Pause on hover
    const wrapper = track.closest('.testimonials-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
      wrapper.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
          const visible = getVisibleCards();
          const maxIndex = Math.max(0, totalCards - visible);
          currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
          updateCarousel();
        }, 5000);
      });
    }
  }

  // --- Fleet Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const fleetCards = document.querySelectorAll('.fleet-card[data-category]');

  if (filterBtns.length > 0 && fleetCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        fleetCards.forEach(card => {
          const matches = filter === 'all' || card.dataset.category === filter;
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          if (matches) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  // --- Contact Form (visual only) ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'MESSAGE SENT!';
      btn.style.background = 'linear-gradient(135deg, #00d4ff, #667eea)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // --- Smooth anchor scroll offset for fixed nav ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlight ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Summer Countdown Timer ---
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  if (cdDays) {
    // Memorial Day weekend 2026: May 23
    const target = new Date('2026-05-23T08:00:00').getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      cdDays.textContent = String(d).padStart(2, '0');
      cdHours.textContent = String(h).padStart(2, '0');
      cdMins.textContent = String(m).padStart(2, '0');
      cdSecs.textContent = String(s).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // --- Live Booking Toasts ---
  const toast = document.getElementById('booking-toast');
  if (toast) {
    const bookings = [
      { name: 'Marcus T.', detail: '2 Kawasaki Jet Skis — Bass Lake' },
      { name: 'Sarah & friends', detail: 'Sea-Doo Spark Bundle — Millerton Lake' },
      { name: 'The Garcia family', detail: 'Bayliner E21 — Shaver Lake' },
      { name: 'Jake R.', detail: '2 Kawasaki Jet Skis — Millerton Lake' },
      { name: 'Amanda C.', detail: 'Sea-Doo Spark Bundle — Bass Lake' },
      { name: 'David P.', detail: 'Bayliner E21 — Millerton Lake' },
      { name: 'Lisa & crew', detail: '2 Kawasaki Jet Skis — Shaver Lake' },
    ];

    const toastTitle = document.getElementById('toast-title');
    const toastDetail = document.getElementById('toast-detail');
    const toastClose = document.getElementById('toast-close');
    let toastIdx = 0;
    let toastDismissed = false;

    toastClose.addEventListener('click', () => {
      toast.classList.remove('show');
      toastDismissed = true;
    });

    const showToast = () => {
      if (toastDismissed) return;
      const b = bookings[toastIdx % bookings.length];
      toastTitle.textContent = b.name + ' just booked';
      toastDetail.textContent = b.detail;
      toast.classList.add('show');
      toastIdx++;

      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    };

    // First toast after 8 seconds, then every 25-40 seconds
    setTimeout(() => {
      showToast();
      setInterval(() => {
        setTimeout(showToast, Math.random() * 15000);
      }, 25000);
    }, 8000);
  }

  // --- AI Chat Widget ---
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatMinimize = document.getElementById('chat-minimize');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatQuickReplies = document.getElementById('chat-quick-replies');
  const chatToggleIcon = document.getElementById('chat-toggle-icon');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      const isOpen = chatWindow.classList.toggle('open');
      chatToggleIcon.innerHTML = isOpen ? '&times;' : '&#128172;';
    });

    chatMinimize.addEventListener('click', () => {
      chatWindow.classList.remove('open');
      chatToggleIcon.innerHTML = '&#128172;';
    });

    // Knowledge base
    const kb = {
      pricing: "Here's our pricing:\n\n🏍️ Jet Ski Bundles (pair of 2): $650 / all day\n🚤 Bayliner Element E21: $999 / all day\n\nAll rentals are full-day and include fuel, life jackets, and safety equipment!",
      delivery: "Delivery options:\n\n📍 Pickup from us: FREE\n🌊 Millerton Lake: $150 (delivery & pickup)\n🏔️ Bass Lake & Shaver Lake: $300 (delivery & pickup)\n\nWe handle all the hauling — just show up and ride!",
      lakes: "We serve 4 amazing lakes:\n\n🌊 Millerton Lake — Fresno's backyard lake, warm water, big coves\n⛰️ Pine Flat Lake — Crystal-clear foothill water\n🏔️ Shaver Lake — Mountain escape at 5,370 ft\n🌅 Bass Lake — Crown jewel of the Sierra\n\nDelivery available to all locations!",
      booking: "Booking is easy!\n\n1️⃣ Visit our Book Now page\n2️⃣ Pick your dates with the date picker\n3️⃣ Choose your watercraft\n4️⃣ Complete your reservation\n\nYou'll get instant confirmation. Questions? Call us at (559) 981-0180!",
      hours: "We offer all-day rentals. Peak season hours are typically 7 AM – 7 PM. Contact us for specific availability!",
      deposit: "Yes, a refundable security deposit is required at pickup. The amount varies by watercraft. It's fully refunded upon safe return of the equipment.",
      cancel: "We offer free cancellation up to 48 hours before your reservation. Cancellations within 48 hours may be subject to a fee. Weather-related cancellations are always fully refunded.",
      license: "In California, anyone born on or after January 1, 1986 needs a California Boater Card to operate a motorized vessel. For jet skis, you must be at least 16 years old.",
      review: "Leave a 5-star Google review and get $25 off your next rental! Just send us a screenshot of your review and we'll send you a discount code. 🌟",
      kawasaki: "Our Kawasaki STX 160 bundle comes with 2 jet skis for $650 / all day. Perfect for racing your friends on the lake! 🏍️",
      seadoo: "Our Sea-Doo Spark bundle comes with 2 jet skis for $650 / all day. Fun, lightweight, and perfect for beginners and experienced riders alike!",
      bayliner: "The 2026 Bayliner Element E21 is available for $999 / all day. A premium 21ft boat perfect for families and groups. Fits up to 8 passengers!",
      bring: "Bring sunscreen, towels, water, snacks, and a valid photo ID. We provide life jackets for all passengers. Wear clothes you don't mind getting wet!",
    };

    const findAnswer = (q) => {
      q = q.toLowerCase();
      if (/pric|cost|how much|\$|rate|fee/.test(q)) return kb.pricing;
      if (/deliver|pickup|pick up|haul|transport|drop off/.test(q)) return kb.delivery;
      if (/lake|millerton|bass|shaver|pine flat|where/.test(q)) return kb.lakes;
      if (/book|reserv|order|schedule|how (do|can) i/.test(q)) return kb.booking;
      if (/hour|time|when|open|close/.test(q)) return kb.hours;
      if (/deposit|security/.test(q)) return kb.deposit;
      if (/cancel|refund/.test(q)) return kb.cancel;
      if (/license|boater card|age|requirement/.test(q)) return kb.license;
      if (/review|discount|25|\$25|google/.test(q)) return kb.review;
      if (/kawasaki|stx|160/.test(q)) return kb.kawasaki;
      if (/sea.?doo|spark/.test(q)) return kb.seadoo;
      if (/bayliner|boat|e21/.test(q)) return kb.bayliner;
      if (/bring|wear|need|pack/.test(q)) return kb.bring;
      if (/hi|hello|hey|sup|what'?s up/.test(q)) return "Hey there! 👋 How can I help you today? Ask me about pricing, lakes, delivery, or booking!";
      if (/thank|thanks|thx/.test(q)) return "You're welcome! 😊 See you on the water! If you need anything else, just ask.";
      return "Great question! For detailed help with that, give us a call at (559) 981-0180 or visit our Contact page. I can also help with pricing, delivery info, lake details, or how to book!";
    };

    const addMsg = (text, isUser) => {
      const div = document.createElement('div');
      div.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-bot');
      div.innerHTML = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChat = (q) => {
      addMsg(q, true);
      chatQuickReplies.style.display = 'none';
      setTimeout(() => addMsg(findAnswer(q), false), 600);
    };

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = chatInput.value.trim();
      if (!q) return;
      chatInput.value = '';
      handleChat(q);
    });

    chatQuickReplies.querySelectorAll('.chat-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => handleChat(btn.dataset.q));
    });
  }

});
