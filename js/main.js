function initializePage() {
  document.querySelectorAll('.nav-links li').forEach((item) => {
    const link = item.querySelector('a');
    const href = link && link.getAttribute('href');

    if (href === 'index.html' || href === '../index.html') {
      item.remove();
    }
  });

  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = toggle.closest('li');
      const wasOpen = parentLi.classList.contains('dropdown-open');
      document.querySelectorAll('.nav-links > li.dropdown-open').forEach(li => {
        li.classList.remove('dropdown-open');
      });
      if (!wasOpen) {
        parentLi.classList.add('dropdown-open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const insideDropdown = e.target.closest('.nav-links > li.dropdown-open');
    const insideToggle = e.target.closest('.nav-dropdown-toggle');
    if (!insideDropdown && !insideToggle) {
      document.querySelectorAll('.nav-links > li.dropdown-open').forEach(li => {
        li.classList.remove('dropdown-open');
      });
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.querySelectorAll('.nav-links > li.dropdown-open').forEach(li => {
        li.classList.remove('dropdown-open');
      });
    });
  });

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  document.querySelectorAll('.post-faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.post-faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.services-grid .reveal, .why-grid .reveal, .areas-grid .reveal, .faq-list .reveal, .process-grid .reveal, .industries-grid .reveal, .testimonials-grid .reveal').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  const upgradeOffer = document.getElementById('upgradeOffer');
  if (upgradeOffer) {
    const closeButton = upgradeOffer.querySelector('.offer-modal-close');
    const actionLink = upgradeOffer.querySelector('.offer-modal-action');
    const originalBodyOverflow = document.body.style.overflow;
    const idleDelay = 30000;
    let idleTimer;
    let previousFocus;
    let offerHasBeenShown = false;

    const showOffer = () => {
      if (!upgradeOffer.hidden) return;
      window.clearTimeout(idleTimer);
      previousFocus = document.activeElement;
      upgradeOffer.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
      offerHasBeenShown = true;
    };

    const scheduleIdleOffer = () => {
      window.clearTimeout(idleTimer);
      if (offerHasBeenShown && upgradeOffer.hidden) {
        idleTimer = window.setTimeout(showOffer, idleDelay);
      }
    };

    const closeOffer = (restoreFocus) => {
      upgradeOffer.hidden = true;
      document.body.style.overflow = originalBodyOverflow;
      if (restoreFocus && previousFocus) previousFocus.focus();
      scheduleIdleOffer();
    };

    ['click', 'keydown', 'mousemove', 'mousedown', 'scroll', 'touchstart', 'wheel'].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        if (upgradeOffer.hidden) scheduleIdleOffer();
      }, { passive: true });
    });

    closeButton.addEventListener('click', () => closeOffer(true));
    actionLink.addEventListener('click', () => closeOffer(false));
    upgradeOffer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeOffer(true);
      } else if (event.key === 'Tab') {
        const activeElement = document.activeElement;
        if (event.shiftKey && activeElement === closeButton) {
          event.preventDefault();
          actionLink.focus();
        } else if (!event.shiftKey && activeElement === actionLink) {
          event.preventDefault();
          closeButton.focus();
        }
      }
    });

    window.setTimeout(showOffer, 9000);
  }
}

initializePage();