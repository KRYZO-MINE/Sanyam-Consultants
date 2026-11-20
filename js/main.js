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

  const trackEvent = (name, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  };

  document.querySelectorAll('[data-product]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.getElementById('leadInterest');
      if (select) select.value = link.dataset.product;
      trackEvent('contact_form_started', { interest: link.dataset.product });
    });
  });

  document.querySelectorAll('[data-whatsapp-message], .floating-whatsapp').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('whatsapp_button_clicked', { message: link.dataset.whatsappMessage || 'general' });
    });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('phone_number_clicked'));
  });

  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    let formStarted = false;
    leadForm.addEventListener('focusin', () => {
      if (!formStarted) {
        formStarted = true;
        trackEvent('contact_form_started');
      }
    });

    leadForm.addEventListener('input', () => {
      leadForm.querySelectorAll('.field-error').forEach(field => field.classList.remove('field-error'));
      const status = document.getElementById('leadStatus');
      if (status) status.textContent = '';
    });

    leadForm.addEventListener('submit', async event => {
      event.preventDefault();
      const status = document.getElementById('leadStatus');
      const submitButton = leadForm.querySelector('.lead-submit');
      leadForm.querySelectorAll('.field-error').forEach(field => field.classList.remove('field-error'));

      const fields = Object.fromEntries(new FormData(leadForm).entries());
      if (fields.website) return;

      const requiredFields = ['customerName', 'phone', 'businessName', 'city', 'interest'];
      let invalid = false;
      requiredFields.forEach(name => {
        const field = leadForm.elements[name];
        if (!field || !field.value.trim()) {
          field && field.classList.add('field-error');
          invalid = true;
        }
      });

      const phoneDigits = fields.phone.replace(/\D/g, '');
      if (!/^(?:91)?[6-9]\d{9}$/.test(phoneDigits)) {
        leadForm.elements.phone.classList.add('field-error');
        invalid = true;
      }

      if (!leadForm.checkValidity()) invalid = true;

      if (invalid) {
        status.className = 'form-status error';
        status.textContent = 'Please enter valid details in the highlighted fields.';
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const payload = {
        leadId: 'lead_' + Date.now(),
        customerName: fields.customerName.trim(),
        phoneNumber: phoneDigits,
        businessName: fields.businessName.trim(),
        city: fields.city.trim(),
        interestedProduct: fields.interest,
        email: (fields.email || '').trim(),
        message: (fields.message || '').trim(),
        submissionDateTime: new Date().toISOString(),
        landingPageUrl: window.location.href,
        leadSource: 'Website',
        campaignName: params.get('campaign') || '',
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || ''
      };

      const messageLines = [
        `Hello Sanyam Consultants, My Name is ${payload.customerName} and my business name is ${payload.businessName}. I want to learn more about ${payload.interestedProduct}.`
      ];
      if (payload.message) messageLines.push(payload.message);
      messageLines.push(payload.phoneNumber);
      if (payload.email) messageLines.push(payload.email);

      const whatsappUrl = 'https://wa.me/917206767999?text=' + encodeURIComponent(messageLines.join('\n'));
      submitButton.disabled = true;
      submitButton.textContent = 'Opening WhatsApp...';
      status.className = 'form-status success';
      status.textContent = 'Your enquiry details are ready. WhatsApp is opening; please press Send in WhatsApp.';
      trackEvent('enquiry_form_submitted', { interested_product: payload.interestedProduct, delivery: 'whatsapp' });

      const whatsappWindow = window.open(whatsappUrl, '_blank');
      if (!whatsappWindow) {
        window.location.href = whatsappUrl;
      } else if ('opener' in whatsappWindow) {
        whatsappWindow.opener = null;
      }

      leadForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Enquiry';
    });
  }
}

initializePage();