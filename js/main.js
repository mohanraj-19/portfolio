/* =============================================
   Portfolio – Main JavaScript
   ============================================= */
(function () {
  'use strict';

  /* ----- DOM References ----- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeModal = document.getElementById('closeResumeModal');
  const currentYearEl = document.getElementById('currentYear');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  /* =============================================
     Theme Toggle
     ============================================= */
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* =============================================
     Mobile Navigation
     ============================================= */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =============================================
     Sticky Navbar & Active Link
     ============================================= */
  var sections = document.querySelectorAll('section[id]');

  function onScroll() {
    var scrollY = window.scrollY;

    // Sticky navbar shadow
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }

    // Back to top
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    // Active nav link
    sections.forEach(function (section) {
      var top = section.offsetTop - 100;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     Scroll Reveal
     ============================================= */
  function setupReveal() {
    var elements = document.querySelectorAll('.glass-card, .section-title, .timeline-heading');
    elements.forEach(function (el) {
      el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  setupReveal();

  /* =============================================
     Skill Bars Animation
     ============================================= */
  var skillFills = document.querySelectorAll('.skill-fill');
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillFills.forEach(function (fill) {
    skillObserver.observe(fill);
  });

  /* =============================================
     Counter Animation
     ============================================= */
  var statNumbers = document.querySelectorAll('.stat-number');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (num) {
    counterObserver.observe(num);
  });

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* =============================================
     Project Filters
     ============================================= */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');

      projectCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* =============================================
     Testimonials Slider
     ============================================= */
  var testimonialTrack = document.getElementById('testimonialTrack');
  var testimonialCards = testimonialTrack ? testimonialTrack.children : [];
  var prevBtn = document.getElementById('prevTestimonial');
  var nextBtn = document.getElementById('nextTestimonial');
  var dotsContainer = document.getElementById('testimonialDots');
  var currentSlide = 0;
  var totalSlides = testimonialCards.length;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.setAttribute('data-index', String(i));
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.getAttribute('data-index'), 10));
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentSlide = index;
    if (testimonialTrack) {
      testimonialTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    }
    if (dotsContainer) {
      var dots = dotsContainer.children;
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === currentSlide);
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide((currentSlide + 1) % totalSlides);
    });
  }

  buildDots();

  // Auto-play
  var autoPlay = setInterval(function () {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);

  // Pause on hover
  if (testimonialTrack) {
    testimonialTrack.parentElement.addEventListener('mouseenter', function () {
      clearInterval(autoPlay);
    });
    testimonialTrack.parentElement.addEventListener('mouseleave', function () {
      autoPlay = setInterval(function () {
        goToSlide((currentSlide + 1) % totalSlides);
      }, 5000);
    });
  }

  /* =============================================
     Resume Modal
     ============================================= */
  function openModal() {
    if (resumeModal) {
      resumeModal.removeAttribute('hidden');
      // Force reflow before adding active class
      void resumeModal.offsetHeight;
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      var closeBtn = resumeModal.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function () {
        resumeModal.setAttribute('hidden', '');
      }, 300);
    }
  }

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', openModal);
  }

  if (closeResumeModal) {
    closeResumeModal.addEventListener('click', closeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', function (e) {
      if (e.target === resumeModal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* =============================================
     Contact Form Validation
     ============================================= */
  function validateField(input, errorEl, message) {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
      return false;
    }
    input.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  function validateEmail(input, errorEl) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim()) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = 'Email is required.';
      return false;
    }
    if (!emailRegex.test(input.value.trim())) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = 'Please enter a valid email.';
      return false;
    }
    input.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  if (contactForm) {
    // Real-time validation
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var subjectInput = document.getElementById('subject');
    var messageInput = document.getElementById('message');

    if (nameInput) {
      nameInput.addEventListener('blur', function () {
        validateField(nameInput, document.getElementById('nameError'), 'Name is required.');
      });
    }
    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        validateEmail(emailInput, document.getElementById('emailError'));
      });
    }
    if (subjectInput) {
      subjectInput.addEventListener('blur', function () {
        validateField(subjectInput, document.getElementById('subjectError'), 'Subject is required.');
      });
    }
    if (messageInput) {
      messageInput.addEventListener('blur', function () {
        validateField(messageInput, document.getElementById('messageError'), 'Message is required.');
      });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      valid = validateField(nameInput, document.getElementById('nameError'), 'Name is required.') && valid;
      valid = validateEmail(emailInput, document.getElementById('emailError')) && valid;
      valid = validateField(subjectInput, document.getElementById('subjectError'), 'Subject is required.') && valid;
      valid = validateField(messageInput, document.getElementById('messageError'), 'Message is required.') && valid;

      var formStatus = document.getElementById('formStatus');

      if (valid) {
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        }
        contactForm.reset();
        setTimeout(function () {
          if (formStatus) formStatus.textContent = '';
        }, 5000);
      } else {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fill in all required fields correctly.';
        }
      }
    });
  }

  /* =============================================
     Footer Year
     ============================================= */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* =============================================
     Initial Scroll Check
     ============================================= */
  onScroll();

})();
