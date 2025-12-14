/**
 * Sungenesis Solar System - Main JavaScript
 * Production-ready interactive functionality
 */

(function() {
  'use strict';

  // =============================================
  // INITIALIZATION
  // =============================================

  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    initScrollReveal();
    initCounters();
    initCalculator();
    initFAQ();
    initServiceModals();
    initSmoothScroll();
    initContactForm();
  });

  // =============================================
  // THEME MANAGEMENT
  // =============================================

  function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const savedTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }

    prefersDark.addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  // =============================================
  // NAVIGATION
  // =============================================

  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    });

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
      const scrollPos = window.pageYOffset + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // =============================================
  // SCROLL REVEAL ANIMATIONS
  // =============================================

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // =============================================
  // ANIMATED COUNTERS
  // =============================================

  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterElements.length > 0) {
      counterObserver.observe(counterElements[0].parentElement);
    }

    function animateCounters() {
      counterElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = function() {
          current += increment;
          if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            element.textContent = target;
          }
        };

        requestAnimationFrame(updateCounter);
      });
    }
  }

  // =============================================
  // SAVINGS CALCULATOR
  // =============================================

  function initCalculator() {
    const form = document.getElementById('calculator-form');
    const results = document.getElementById('calculator-results');
    const resetBtn = document.getElementById('reset-calculator');

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSavings();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        results.classList.add('hidden');
        form.reset();
      });
    }

    function calculateSavings() {
      const monthlyBill = parseFloat(document.getElementById('monthly-bill').value);
      const roofSize = parseFloat(document.getElementById('roof-size').value);

      if (isNaN(monthlyBill) || isNaN(roofSize)) {
        alert('Please enter valid numbers');
        return;
      }

      const avgCostPerUnit = 8;
      const monthlyUnits = monthlyBill / avgCostPerUnit;
      const dailyUnits = monthlyUnits / 30;
      const systemSize = Math.min(Math.ceil(dailyUnits / 4), Math.floor(roofSize / 100));

      const monthlySavings = Math.floor(monthlyBill * 0.8);
      const annualSavings = monthlySavings * 12;
      const systemCost = systemSize * 50000;
      const paybackPeriod = Math.ceil((systemCost * 0.7) / annualSavings);

      const annualUnits = monthlyUnits * 12;
      const co2Saved = (annualUnits * 0.82 / 1000).toFixed(1);

      document.getElementById('system-size').textContent = systemSize;
      document.getElementById('monthly-savings').textContent = `₹${monthlySavings.toLocaleString()}`;
      document.getElementById('payback-period').textContent = paybackPeriod;
      document.getElementById('co2-saved').textContent = co2Saved;

      results.classList.remove('hidden');

      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // =============================================
  // FAQ ACCORDION
  // =============================================

  function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const answer = this.nextElementSibling;

        faqQuestions.forEach(q => {
          if (q !== question) {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.classList.remove('active');
          }
        });

        this.setAttribute('aria-expanded', !isExpanded);
        answer.classList.toggle('active');
      });

      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // =============================================
  // SERVICE MODALS
  // =============================================

  function initServiceModals() {
    const serviceLinks = document.querySelectorAll('.service-link');
    const modal = document.getElementById('service-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    const serviceData = {
      residential: {
        title: 'Residential Rooftop Solar',
        description: 'Transform your home into a clean energy powerhouse with our custom-designed residential solar systems.',
        details: [
          'Complete site assessment and energy audit',
          'Custom system design for maximum efficiency',
          'High-efficiency monocrystalline panels',
          'Net-metering setup with MSEDCL',
          '25-year panel performance warranty',
          'Professional installation by certified technicians',
          'Real-time monitoring system',
          'Government subsidy assistance'
        ],
        specs: 'System Size: 1-10 kW | Payback: 4-6 years | Warranty: 25 years'
      },
      commercial: {
        title: 'Commercial Solar Systems',
        description: 'Reduce operational costs and demonstrate corporate sustainability with large-scale solar installations.',
        details: [
          'Detailed ROI analysis and feasibility study',
          'Scalable systems from 10 kW to 500+ kW',
          'Industrial-grade equipment',
          'Power purchase agreements (PPA) available',
          'Comprehensive O&M services',
          'Tax benefits and depreciation guidance',
          'Performance monitoring and reporting',
          'Minimal downtime during installation'
        ],
        specs: 'System Size: 10-500+ kW | Payback: 3-5 years | Warranty: 25 years'
      },
      microgrid: {
        title: 'Solar Microgrids',
        description: 'Achieve complete energy independence with off-grid and hybrid microgrid solutions.',
        details: [
          'Custom microgrid design',
          'Battery storage integration',
          'Automatic grid-solar switching',
          '24/7 power availability',
          'Diesel generator integration (if needed)',
          'Advanced energy management system',
          'Remote monitoring and control',
          'Perfect for remote locations'
        ],
        specs: 'System Size: Custom | Backup: 24/7 | Warranty: 10-25 years'
      },
      battery: {
        title: 'Battery Storage Solutions',
        description: 'Store excess solar energy and achieve true energy independence with advanced battery systems.',
        details: [
          'Lithium-ion battery technology',
          'Scalable capacity (5-50 kWh)',
          'Seamless integration with existing solar',
          'Backup power during outages',
          'Peak-shaving and load management',
          'Smart charging algorithms',
          'Mobile app monitoring',
          '10-year battery warranty'
        ],
        specs: 'Capacity: 5-50 kWh | Cycles: 6000+ | Warranty: 10 years'
      },
      maintenance: {
        title: 'Maintenance & Monitoring',
        description: 'Keep your solar system running at peak efficiency with our comprehensive maintenance services.',
        details: [
          'Quarterly performance inspections',
          'Panel cleaning (2-4 times/year)',
          'Electrical connection checks',
          'Inverter performance monitoring',
          'Real-time performance dashboards',
          'Annual system health reports',
          'Rapid response to issues',
          'Preventive maintenance'
        ],
        specs: 'Response Time: 24-48 hours | Plans: Annual/Biennial | Coverage: Comprehensive'
      },
      financing: {
        title: 'Financing & Subsidies',
        description: 'Make solar affordable with government subsidies, flexible financing, and EMI options.',
        details: [
          'PM Surya Ghar subsidy assistance',
          'Up to 40% government subsidy',
          'Zero down payment options',
          'Flexible EMI plans (1-5 years)',
          'Bank loan facilitation',
          'Tax benefit guidance',
          'Accelerated depreciation for businesses',
          'Complete documentation support'
        ],
        specs: 'Subsidy: Up to 40% | EMI: From ₹5,000/month | Approval: 7-10 days'
      }
    };

    serviceLinks.forEach(link => {
      link.addEventListener('click', function() {
        const serviceType = this.getAttribute('data-service');
        const service = serviceData[serviceType];

        if (service) {
          showModal(service);
        }
      });
    });

    function showModal(service) {
      let detailsHTML = '<ul style="list-style: none; padding: 0;">';
      service.details.forEach(detail => {
        detailsHTML += `<li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
          <span style="position: absolute; left: 0; color: var(--color-primary); font-weight: 700;">✓</span>
          ${detail}
        </li>`;
      });
      detailsHTML += '</ul>';

      modalBody.innerHTML = `
        <h2 id="modal-title" style="margin-bottom: 1rem; color: var(--color-primary);">${service.title}</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">${service.description}</p>
        <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">What's Included</h3>
        ${detailsHTML}
        <div style="background: var(--color-surface); padding: 1rem; border-radius: 0.5rem; margin-top: 2rem;">
          <strong>Specifications:</strong> ${service.specs}
        </div>
        <a href="#contact" class="btn btn-primary btn-ripple" style="margin-top: 2rem; display: inline-flex;">
          Get a Quote
        </a>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      modalClose.focus();
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // =============================================
  // SMOOTH SCROLL
  // =============================================

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href === '#') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          const navbarHeight = document.getElementById('navbar').offsetHeight;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          if (this.closest('.modal')) {
            const modal = document.getElementById('service-modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }
      });
    });
  }

  // =============================================
  // CONTACT FORM
  // =============================================

  function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
      form.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !phone || !subject || !message) {
          e.preventDefault();
          alert('Please fill in all required fields');
          return;
        }

        if (!validateEmail(email)) {
          e.preventDefault();
          alert('Please enter a valid email address');
          return;
        }

        this.action = `mailto:sungenesis3sss@gmail.com?subject=Contact Form: ${encodeURIComponent(subject)}&body=${encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`
        )}`;
      });
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });

})();
