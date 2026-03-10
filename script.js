/* =====================================================
   MAYFIELD GLOBAL SCHOOL — MASTER SCRIPT
   ===================================================== */

// ─── EMAILJS CONFIG ─────────────────────────────────
// Replace these with your actual EmailJS credentials
// ─── EMAILJS CONFIG ─────────────────────────────────
// 🔐 ADD YOUR EMAILJS CREDENTIALS BELOW

const EMAILJS_CONFIG = {
  publicKey:   'LusIoWFn5c4M_tFJt',   // ← Add EmailJS Public Key
  serviceId:   'service_y1qm3mr',   // ← Add EmailJS Service ID
  templateId:  'template_c3fvb3c',  // ← Add EmailJS Template ID (Admission)
  contactTemplateId: 'YOUR_CONTACT_TEMPLATE_ID_HERE' // ← Add Template for Contact Form
};

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ─── NAVBAR ─────────────────────────────────────────
const navbar    = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
});

document.addEventListener('click', (e) => {
  if (!navbar?.contains(e.target)) {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  }
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ─── SCROLL ANIMATIONS ──────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ─── COUNTER ANIMATION ──────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals || 0;
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.querySelectorAll?.('[data-target]').forEach(animateCounter);
      document.querySelectorAll('[data-target]').forEach(el => {
        if (e.target.contains(el)) animateCounter(el);
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-bar, .about-stats-row, .about-mini-stats').forEach(el => {
  counterObserver.observe(el);
});

// ─── GALLERY FILTER ──────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (cat === 'all' || item.dataset.category === cat) {
        item.style.display = 'block';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(.95)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

// Load More Gallery
const loadMoreBtn = document.getElementById('loadMoreBtn');
const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
if (loadMoreBtn && hiddenItems.length) {
  loadMoreBtn.addEventListener('click', () => {
    hiddenItems.forEach(item => {
      item.classList.remove('hidden');
      item.style.display = 'block';
    });
    loadMoreBtn.parentElement.style.display = 'none';
  });
}

// ─── TOAST ────────────────────────────────────────────
function showToast(message, type = 'success') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ─── ADMISSION FORM ────────────────────────────────────
const admissionForm  = document.getElementById('admissionForm');
const formSuccessMsg = document.getElementById('formSuccessMsg');

if (admissionForm) {
  admissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateAdmissionForm()) return;

    const submitBtn = admissionForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Sending...';
    submitBtn.disabled = true;

    const formData = {
      student_name:  document.getElementById('studentName')?.value.trim(),
      parent_phone:  document.getElementById('parentPhone')?.value.trim(),
      parent_email:  document.getElementById('parentEmail')?.value.trim(),
      applying_class: document.getElementById('applyingClass')?.value,
      school_name:   'Mayfield Global School',
    };

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData);
        admissionForm.style.display = 'none';
        if (formSuccessMsg) formSuccessMsg.classList.add('show');
        showToast('Enquiry submitted! We\'ll contact you within 24 hours.', 'success');
      } else {
        // Demo mode (EmailJS not configured)
        await new Promise(r => setTimeout(r, 1200));
        admissionForm.style.display = 'none';
        if (formSuccessMsg) formSuccessMsg.classList.add('show');
        showToast('✅ Form submitted! (Configure EmailJS to send emails)', 'success');
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      showToast('Failed to send. Please call us directly.', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  // Real-time field validation clear
  admissionForm.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = input.closest('.form-group')?.querySelector('.error-msg');
      if (errEl) errEl.textContent = '';
    });
  });
}

function validateAdmissionForm() {
  let valid = true;

  // Student Name
  const name = document.getElementById('studentName');
  if (name) {
    const val = name.value.trim();
    setError(name, !val || val.length < 3 ? 'Please enter the student\'s full name (min 3 chars).' : '');
    if (!val || val.length < 3) valid = false;
  }

  // Phone
  const phone = document.getElementById('parentPhone');
  if (phone) {
    const val = phone.value.trim().replace(/\s/g, '');
    const ok = /^(\+91|91)?[6-9]\d{9}$/.test(val);
    setError(phone, !ok ? 'Enter a valid 10-digit Indian mobile number.' : '');
    if (!ok) valid = false;
  }

  // Email
  const email = document.getElementById('parentEmail');
  if (email) {
    const val = email.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setError(email, !ok ? 'Enter a valid email address.' : '');
    if (!ok) valid = false;
  }

  // Class
  const cls = document.getElementById('applyingClass');
  if (cls) {
    setError(cls, !cls.value ? 'Please select a class.' : '');
    if (!cls.value) valid = false;
  }

  return valid;
}

function setError(input, msg) {
  const errEl = input.closest('.form-group')?.querySelector('.error-msg');
  if (errEl) errEl.textContent = msg;
  input.classList.toggle('error', !!msg);
}

// ─── SMOOTH ANCHOR SCROLL ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".dps-slide");
  const nextBtn = document.querySelector(".dps-next");
  const prevBtn = document.querySelector(".dps-prev");

  let index = 0;
  let interval = setInterval(nextSlide, 4000);

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  nextBtn?.addEventListener("click", function() {
    nextSlide();
    resetInterval();
  });

  prevBtn?.addEventListener("click", function() {
    prevSlide();
    resetInterval();
  });

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 4000);
  }

});


// ─── CONTACT FORM ────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const contactSuccessMsg = document.getElementById('contactSuccessMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Sending...';
    submitBtn.disabled = true;

    const formData = {
      from_name: document.getElementById('contactName')?.value.trim(),
      from_email: document.getElementById('contactEmail')?.value.trim(),
      phone: document.getElementById('contactPhone')?.value.trim(),
      subject: document.getElementById('contactSubject')?.value.trim(),
      message: document.getElementById('contactMessage')?.value.trim(),
      form_type: 'Contact Form'
    };

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.contactTemplateId,
        formData
      );

      contactForm.style.display = 'none';
      contactSuccessMsg?.classList.add('show');
      showToast('Message sent successfully!', 'success');

    } catch (err) {
      console.error('EmailJS Error:', err);
      showToast('Failed to send message.', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}
