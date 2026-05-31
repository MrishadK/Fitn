// FITNICE - Complete Interactive JavaScript

(function () {
  'use strict';

  // Theme Management
  const themeManager = {
    key: 'fitnice-theme',
    themes: ['dark', 'teal', 'light'],

    init() {
      const saved = localStorage.getItem(this.key) || 'dark';
      this.setTheme(saved);
      this.bindToggle();
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.key, theme);
      this.updateToggleButtons();
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const idx = this.themes.indexOf(current);
      const next = this.themes[(idx + 1) % this.themes.length];
      this.setTheme(next);
    },

    updateToggleButtons() {
      const theme = document.documentElement.getAttribute('data-theme');

      // Update desktop theme switcher pills
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
      });

      // Update mobile theme options
      document.querySelectorAll('.mobile-theme-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
      });
    },

    bindToggle() {
      // Desktop theme pills
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.setTheme(btn.dataset.theme);
        });
      });

      // Mobile theme options
      document.querySelectorAll('.mobile-theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
          this.setTheme(btn.dataset.theme);
        });
      });

      // Legacy single toggle buttons (fallback)
      const legacyBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
      legacyBtns.forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => this.toggle());
        }
      });
    }
  };

  // Mobile Navigation
  const mobileNav = {
    init() {
      this.toggle = document.getElementById('menuToggle');
      this.panel = document.getElementById('mobilePanel');
      this.overlay = this.createOverlay();

      if (!this.toggle || !this.panel) return;

      this.bindEvents();
    },

    createOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        z-index: 98; opacity: 0; visibility: hidden;
        transition: all 0.3s ease; backdrop-filter: blur(2px);
      `;
      document.body.appendChild(overlay);
      return overlay;
    },

    open() {
      this.panel.classList.add('open');
      this.panel.setAttribute('aria-hidden', 'false');
      this.toggle.setAttribute('aria-expanded', 'true');
      this.toggle.textContent = '✕';

      this.overlay.style.opacity = '1';
      this.overlay.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.panel.classList.remove('open');
      this.panel.setAttribute('aria-hidden', 'true');
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.textContent = '☰';

      this.overlay.style.opacity = '0';
      this.overlay.style.visibility = 'hidden';
      document.body.style.overflow = '';
    },

    bindEvents() {
      this.toggle.addEventListener('click', () => {
        this.panel.classList.contains('open') ? this.close() : this.open();
      });

      this.overlay.addEventListener('click', () => this.close());

      this.panel.addEventListener('click', (e) => {
        if (e.target.matches('a')) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }
  };

  // Scroll Animations
  const scrollAnimations = {
    init() {
      this.elements = document.querySelectorAll('.reveal, .fade-in-up, .feature-card');

      if (!window.IntersectionObserver) {
        this.elements.forEach(el => el.classList.add('show'));
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  // Button Ripple Effect
  const rippleEffect = {
    init() {
      document.addEventListener('click', this.createRipple);
    },

    createRipple(e) {
      const button = e.target.closest('.cta-button, .submit-button, .download-button');
      if (!button) return;

      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.className = 'btn-ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
      `;

      button.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }
  };

  // Form Enhancements
  const formEnhancements = {
    init() {
      this.forms = document.querySelectorAll('form');
      this.forms.forEach(form => this.enhanceForm(form));
    },

    enhanceForm(form) {
      const inputs = form.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        input.addEventListener('focus', this.onFocus);
        input.addEventListener('blur', this.onBlur);
        input.addEventListener('input', this.onInput);
      });

      form.addEventListener('submit', this.onSubmit);
    },

    onFocus(e) {
      e.target.parentElement?.classList.add('focused');
    },

    onBlur(e) {
      e.target.parentElement?.classList.remove('focused');
    },

    onInput(e) {
      const input = e.target;
      const isValid = input.checkValidity();

      input.classList.toggle('error', !isValid);
      input.classList.toggle('success', isValid && input.value.length > 0);
    },

    onSubmit(e) {
      const form = e.target;
      const submitButton = form.querySelector('.submit-button');

      if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Reset after 2 seconds (replace with actual form handling)
        setTimeout(() => {
          submitButton.classList.remove('loading');
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }, 2000);
      }
    }
  };

  // Smooth scrolling for anchor links
  const smoothScroll = {
    init() {
      document.addEventListener('click', this.handleClick);
    },

    handleClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Navbar scroll behavior — Dynamic Island compact state
  const navbarScroll = {
    init() {
      this.navbar = document.querySelector('.navbar');
      if (!this.navbar) return;

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 60) {
              this.navbar.classList.add('scrolled');
            } else {
              this.navbar.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  };

  // Showcase Interactive Mockup
  const showcaseInteraction = {
    init() {
      this.items = document.querySelectorAll('.showcase-item');
      this.screens = document.querySelectorAll('.showcase-screen');
      this.dots = document.querySelectorAll('.showcase-dot');
      this.featuresContainer = document.querySelector('.showcase-features');
      this.phoneMockup = document.querySelector('.phone-mockup');
      if (this.screens.length === 0) return;

      this.currentIndex = 0;
      this.totalSlides = this.screens.length;
      this.timer = null;

      this.bindEvents();
      this.startAutoplay();
    },

    bindEvents() {
      // Desktop: click showcase items
      this.items.forEach(item => {
        item.addEventListener('click', () => {
          const index = parseInt(item.getAttribute('data-index'), 10);
          this.goToIndex(index);
          this.stopAutoplay();
        });
      });

      // Mobile: click dots
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-index'), 10);
          this.goToIndex(index);
          this.stopAutoplay();
        });
      });

      // Mobile: swipe gestures on phone mockup
      if (this.phoneMockup) {
        let startX = 0;
        let startY = 0;

        this.phoneMockup.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }, { passive: true });

        this.phoneMockup.addEventListener('touchend', (e) => {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const diffX = endX - startX;
          const diffY = endY - startY;

          // Only trigger if horizontal swipe is dominant
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              // Swipe left → next
              const next = (this.currentIndex + 1) % this.totalSlides;
              this.goToIndex(next);
            } else {
              // Swipe right → prev
              const prev = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
              this.goToIndex(prev);
            }
            this.stopAutoplay();
          }
        }, { passive: true });
      }
    },

    goToIndex(index) {
      if (index === this.currentIndex) return;

      // Update items active state
      this.items.forEach(item => {
        const itemIdx = parseInt(item.getAttribute('data-index'), 10);
        item.classList.toggle('active', itemIdx === index);
      });

      // Update screens active state
      this.screens.forEach(screen => {
        const screenIdx = parseInt(screen.getAttribute('data-index'), 10);
        screen.classList.toggle('active', screenIdx === index);
      });

      // Update dots active state
      this.dots.forEach(dot => {
        const dotIdx = parseInt(dot.getAttribute('data-index'), 10);
        dot.classList.toggle('active', dotIdx === index);
      });

      this.currentIndex = index;
    },

    startAutoplay() {
      this.timer = setInterval(() => {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToIndex(nextIndex);
      }, 5000);
    },

    stopAutoplay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.featuresContainer?.classList.add('autoplay-disabled');
    }
  };

  // App Store Modal Interaction
  const appStoreModalInteraction = {
    init() {
      const btn = document.getElementById('appStoreBtn');
      const modal = document.getElementById('appStoreModal');
      
      if (!btn || !modal) return;
      
      const closeBtn = modal.querySelector('.app-store-close');

      btn.addEventListener('click', () => {
        modal.classList.add('show');
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('show');
        });
      }

      // Close modal when clicking outside of it
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    }
  };

  // Background Particle System
  const particleBackgroundInteraction = {
    init() {
      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.id = 'particle-canvas';
      document.body.prepend(canvas);
      
      const ctx = canvas.getContext('2d');
      let width = window.innerWidth;
      let height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      const particles = [];
      const particleCount = 100;
      const mouse = { x: width / 2, y: height / 2 };
      
      // Teal color
      const dotColor = 'rgba(20, 184, 166, 0.6)';
      
      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 1.5 + 0.5
        });
      }
      
      window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      });
      
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
      
      function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
          // Idle movement
          p.x += p.vx;
          p.y += p.vy;
          
          // Screen wrap
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
          
          // Mouse interaction
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            // Smoothly swirl around mouse
            const angle = Math.atan2(dy, dx);
            const force = (120 - dist) / 120;
            
            p.x += Math.cos(angle + Math.PI / 2) * force * 1.5;
            p.y += Math.sin(angle + Math.PI / 2) * force * 1.5;
            
            // Draw lines between mouse and close particles
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${force * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();
        });
        
        requestAnimationFrame(animate);
      }
      
      animate();
    }
  };

  // Initialize everything when DOM is ready
  function init() {
    themeManager.init();
    mobileNav.init();
    scrollAnimations.init();
    rippleEffect.init();
    formEnhancements.init();
    smoothScroll.init();
    navbarScroll.init();
    showcaseInteraction.init();
    appStoreModalInteraction.init();
    particleBackgroundInteraction.init();

    // Add loading complete class
    document.body.classList.add('loaded');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
