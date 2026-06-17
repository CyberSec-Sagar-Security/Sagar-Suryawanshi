/**
 * main.js — Sagar B. Suryawanshi Portfolio
 * Security-first JavaScript: no innerHTML with user data,
 * no inline event handlers, addEventListener only.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     DEV BANNER
  ───────────────────────────────────────────────────────── */
  const banner = document.getElementById('dev-banner');
  const dismissBtn = document.getElementById('dismiss-banner');
  const navbar = document.getElementById('navbar');

  function updateNavbarOffset() {
    if (banner && !banner.classList.contains('hidden')) {
      const bannerH = banner.offsetHeight;
      navbar.style.top = bannerH + 'px';
      document.documentElement.style.setProperty('--nav-offset', bannerH + 'px');
    } else {
      navbar.style.top = '0px';
      document.documentElement.style.setProperty('--nav-offset', '0px');
    }
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      banner.classList.add('hidden');
      updateNavbarOffset();
    });
  }

  updateNavbarOffset();
  window.addEventListener('resize', updateNavbarOffset);

  /* ─────────────────────────────────────────────────────────
     MOBILE NAV TOGGLE
  ───────────────────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     NAVBAR SCROLL ACTIVE LINK HIGHLIGHT
  ───────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('#nav-links a[href^="#"]');

  function setActiveLink() {
    let currentId = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        currentId = section.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + currentId) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ─────────────────────────────────────────────────────────
     CV DOWNLOAD — Blob URL method; no raw file path exposed
  ───────────────────────────────────────────────────────── */
  function triggerCvDownload() {
    // window.RESUME_B64 is set by resume.js (loaded separately)
    if (!window.RESUME_B64) {
      showToast('CV file is loading — please try again in a moment.', 'info');
      return;
    }
    try {
      const binary = atob(window.RESUME_B64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sagar_Suryawanshi_Cybersecurity_CV.pdf';
      a.setAttribute('aria-label', 'Downloading CV');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke object URL after short delay to allow download to start
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      showToast('CV download started!', 'success');
    } catch (err) {
      showToast('Download failed. Please try again.', 'error');
    }
  }

  // Attach to all CV download buttons
  ['hero-cv-btn', 'nav-cv-btn', 'contact-cv-btn'].forEach(function (id) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', triggerCvDownload);
    }
  });

  /* ─────────────────────────────────────────────────────────
     TOAST NOTIFICATION
  ───────────────────────────────────────────────────────── */
  function showToast(message, type) {
    const existing = document.getElementById('portfolio-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const colours = {
      success: { bg: '#052e16', border: '#166534', text: '#4ade80' },
      error:   { bg: '#2d0f0f', border: '#7f1d1d', text: '#f87171' },
      info:    { bg: '#0c1a3a', border: '#1e40af', text: '#93c5fd' },
    };
    const c = colours[type] || colours.info;

    toast.style.cssText = [
      'position:fixed', 'bottom:2rem', 'right:2rem', 'z-index:9999',
      'background:' + c.bg, 'border:1px solid ' + c.border,
      'color:' + c.text, 'padding:0.9rem 1.4rem',
      'border-radius:8px', 'font-size:0.88rem', 'font-weight:600',
      'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
      'max-width:320px', 'line-height:1.5',
      'transition:opacity 0.3s ease',
      'opacity:1',
    ].join(';');

    // Use textContent — never innerHTML — to prevent XSS
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 3500);
  }

  /* ─────────────────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────────────────── */
  function initReveal() {
    const revealTargets = [
      '.project-card', '.cert-card', '.timeline-card',
      '.stat-card', '.skills-pills-col', '.achievement-item',
      '.contact-card', '.research-card', '.highlight-item',
    ];
    const elements = document.querySelectorAll(revealTargets.join(','));

    elements.forEach(function (el) {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  if ('IntersectionObserver' in window) {
    initReveal();
  } else {
    // Fallback: show everything for older browsers
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ─────────────────────────────────────────────────────────
     SKILLS TABS
  ───────────────────────────────────────────────────────── */
  function initSkillsTabs() {
    const tabNav = document.querySelector('.tab-nav');
    if (!tabNav) return;

    const buttons = tabNav.querySelectorAll('.tab-btn');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Deactivate all
        buttons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(function (p) {
          p.classList.remove('active');
          p.hidden = true;
        });

        // Activate clicked
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = document.getElementById(btn.getAttribute('aria-controls'));
        if (target) {
          target.classList.add('active');
          target.hidden = false;
        }
      });
    });
  }

  initSkillsTabs();

  /* ─────────────────────────────────────────────────────────
     PHOTO — right-click protection (defensive UX only)
     Note: this is not a security control; determined users
     can always access Base64 data from DevTools. This
     discourages casual right-click saving.
  ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const photo = document.getElementById('hero-photo');
    if (photo) {
      photo.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
      photo.setAttribute('draggable', 'false');
    }
  });

  /* ─────────────────────────────────────────────────────────
     TYPED HERO SUBTITLE EFFECT (subtle, non-intrusive)
  ───────────────────────────────────────────────────────── */
  function initHeroTyped() {
    const el = document.querySelector('.hero-title');
    if (!el) return;

    const text = el.textContent.trim();
    el.textContent = '';
    el.style.opacity = '1';

    let i = 0;
    const interval = setInterval(function () {
      if (i < text.length) {
        // Use createTextNode to avoid any injection risk
        el.appendChild(document.createTextNode(text[i]));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35);
  }

  // Only run after fonts/content are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTyped);
  } else {
    initHeroTyped();
  }

  /* ─────────────────────────────────────────────────────────
     THEME TOGGLE
  ───────────────────────────────────────────────────────── */
  function updateToggleLabel() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isLight = document.documentElement.classList.contains('light');
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var html = document.documentElement;
      // Add transition class for smooth animation
      html.classList.add('theme-transitioning');
      // Toggle light/dark
      var goingDark = html.classList.contains('light');
      html.classList.toggle('light', !goingDark);
      html.classList.toggle('dark', goingDark);
      // Save preference
      localStorage.setItem('portfolio-theme', goingDark ? 'dark' : 'light');
      updateToggleLabel();
      // Remove transition class after animation completes
      setTimeout(function () {
        html.classList.remove('theme-transitioning');
      }, 320);
    });
    // Set initial aria-label based on current theme
    updateToggleLabel();
  }

})();
