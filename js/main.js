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

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
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
}

initializePage();
