/**
 * BRAC University Website - Interactive Functionality
 * Vanilla JS with modern ES6+ patterns
 */

(function() {
  'use strict';

  // ========================================
  // DOM Element References
  // ========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const contactForm = document.getElementById('contactForm');
  const statValues = document.querySelectorAll('.stat-value[data-count]');
  const revealElements = document.querySelectorAll('.reveal, .feature-card, .program-card, .campus-card, .news-card, .step-card, .info-card, .scholarship-item');

  // ========================================
  // Navigation Functionality
  // ========================================

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Navbar scroll effect
  let lastScrollY = window.scrollY;
  const handleNavbarScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - var(--nav-height);
        window.scrollTo({
          top: target.offsetTop - 72,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // Tab Functionality (Programs Section)
  // ========================================
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      
      // Update buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      // Update panels
      tabPanels.forEach(panel => {
        panel.hidden = true;
        panel.classList.remove('active');
      });
      targetPanel.hidden = false;
      targetPanel.classList.add('active');
      
      // Trigger entrance animation for new panel
      const cards = targetPanel.querySelectorAll('.program-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 80);
        });
      });
    });
    
    // Keyboard navigation for tabs
    button.addEventListener('keydown', (e) => {
      let targetIndex;
      const currentIndex = Array.from(tabButtons).indexOf(button);
      
      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault();
          targetIndex = (currentIndex + 1) % tabButtons.length;
          tabButtons[targetIndex].focus();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          targetIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
          tabButtons[targetIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          tabButtons[0].focus();
          break;
        case 'End':
          e.preventDefault();
          tabButtons[tabButtons.length - 1].focus();
          break;
      }
    });
  });

  // ========================================
  // Counter Animation (Hero Stats)
  // ========================================
  
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer for counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

  statValues.forEach(stat => counterObserver.observe(stat));

  // ========================================
  // Scroll Reveal Animations
  // ========================================
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Add reveal class to elements and observe
  const elementsToReveal = [
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.program-card'),
    ...document.querySelectorAll('.campus-card:not(.main-card)'),
    ...document.querySelectorAll('.news-card'),
    ...document.querySelectorAll('.step-card'),
    ...document.querySelectorAll('.info-card'),
    ...document.querySelectorAll('.scholarship-item'),
    ...document.querySelectorAll('.gallery-item'),
    document.querySelector('.story-content'),
    document.querySelector('.story-visual'),
    document.querySelector('.contact-info'),
    document.querySelector('.contact-form')
  ].filter(Boolean);

  elementsToReveal.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 50}ms`;
    revealObserver.observe(el);
  });

  // ========================================
  // Form Handling
  // ========================================
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Validate form
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    let isValid = true;
    
    // Simple validation
    contactForm.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--accent-rose)';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (!isValid) {
      shakeForm(contactForm);
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" stroke-opacity="1">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
        </path>
      </svg>
      <span>Sending...</span>
    `;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Success state
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Request Sent!</span>
    `;
    submitBtn.style.background = 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)';
    
    // Reset after delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      submitBtn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  const shakeForm = (form) => {
    form.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => { form.style.animation = ''; }, 500);
  };

  // Add shake animation dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
    .spinner { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  // Real-time validation feedback
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.hasAttribute('required') && !field.value.trim()) {
        field.style.borderColor = 'var(--accent-rose)';
      } else {
        field.style.borderColor = '';
      }
    });
    
    field.addEventListener('input', () => {
      if (field.style.borderColor === 'rgb(244, 63, 94)') {
        field.style.borderColor = '';
      }
    });
  });

  // ========================================
  // Parallax Effect for Hero Orbs
  // ========================================
  
  let ticking = false;
  const orbs = document.querySelectorAll('.orb');
  
  const updateParallax = () => {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    const heroHeight = hero.offsetHeight;
    
    if (scrollY < heroHeight) {
      orbs.forEach((orb, index) => {
        const speed = 0.15 + (index * 0.05);
        const yPos = scrollY * speed;
        const xPos = (index === 1) ? scrollY * 0.05 : 0;
        orb.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      });
    }
    ticking = false;
  };
  
  const requestParallax = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };
  
  // Only enable parallax on desktop and if user prefers motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  
  if (!prefersReducedMotion && !isMobile) {
    window.addEventListener('scroll', requestParallax, { passive: true });
  }

  // ========================================
  // Active Navigation Link on Scroll
  // ========================================
  
  const sections = document.querySelectorAll('section[id]');
  const navLinksArray = Array.from(navLinks);
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const correspondingLink = navLinksArray.find(link => link.getAttribute('href') === `#${id}`);
        
        if (correspondingLink) {
          navLinksArray.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  }, { 
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  });
  
  sections.forEach(section => sectionObserver.observe(section));

  // ========================================
  // Gallery Item Hover Effect
  // ========================================
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });

  // ========================================
  // Initialize
  // ========================================
  
  // Set initial active nav link
  const setActiveNav = () => {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < bottom) {
        navLinksArray.forEach(link => link.classList.remove('active'));
        const activeLink = navLinksArray.find(link => link.getAttribute('href') === `#${id}`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav(); // Initial check
  
  // Handle resize for mobile menu
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, 250);
  });

  console.log('BRAC University website initialized successfully');
})();