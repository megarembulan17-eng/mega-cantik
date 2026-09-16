/**
 * MEGA REMBULAN MAHARANI (EGAA) - PERSONAL PORTFOLIO
 * Sweet Lilac & Blue Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initPhotoSwitcher();
  initSocialPlaceholders();
  initSparkleClick();
});

/* --------------------------------------------------
   1. NAVBAR & ACTIVE NAVIGATION
-------------------------------------------------- */
function initNavbar() {
  const headerNav = document.getElementById('header-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled state for glassmorphic header
  const handleScroll = () => {
    if (window.scrollY > 30) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  }

  // Active section indicator using IntersectionObserver
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));
}

/* --------------------------------------------------
   2. SCROLL REVEAL ANIMATIONS
-------------------------------------------------- */
function initScrollReveal() {
  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-fade-up, .reveal-scale').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------
   3. BACK TO TOP BUTTON
-------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 380) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------
   4. INTERACTIVE PHOTO REPLACER (EASY CUSTOM PHOTO PREVIEW)
-------------------------------------------------- */
function initPhotoSwitcher() {
  const fileInput = document.getElementById('profile-file-input');
  const swapBtn = document.getElementById('swap-photo-btn');
  const heroPhotoImg = document.getElementById('hero-profile-img');
  const contactPhotoImg = document.getElementById('contact-profile-img');
  const dropZone = document.getElementById('profile-photo-dropzone');

  if (!fileInput || !heroPhotoImg) return;

  if (swapBtn) {
    swapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropZone) {
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag and drop support
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--lilac-500)';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--lilac-300)';
      });
    });

    dropZone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });
  }

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Mohon pilih file gambar (JPG, PNG, atau WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newSrc = event.target.result;
      heroPhotoImg.src = newSrc;
      if (contactPhotoImg) {
        contactPhotoImg.src = newSrc;
      }
      showToast('✨ Foto profil Egaa berhasil diperbarui! ♡');
    };
    reader.readAsDataURL(file);
  }
}

/* --------------------------------------------------
   5. SOCIAL PLACEHOLDER INTERACTION & TOAST NOTIFICATION
-------------------------------------------------- */
function initSocialPlaceholders() {
  const socialBtns = document.querySelectorAll('.social-btn');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = btn.getAttribute('data-platform') || 'Akun';
      showToast(`✨ Placeholder ${platform} Egaa (Mudah diedit di file index.html)`);
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('cute-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cute-toast';
    toast.className = 'cute-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------
   6. CLICK SPARKLE EFFECT (SWEET MICRO-INTERACTION)
-------------------------------------------------- */
function initSparkleClick() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', (e) => {
    // Avoid spamming on inputs/buttons
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    createSparkle(e.clientX, e.clientY);
  });

  function createSparkle(x, y) {
    const colors = ['#B8A7EA', '#A2D2FF', '#FFAFCC', '#FFD166'];
    const count = 3;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'fixed';
      sparkle.style.left = `${x + (Math.random() * 20 - 10)}px`;
      sparkle.style.top = `${y + (Math.random() * 20 - 10)}px`;
      sparkle.style.width = '10px';
      sparkle.style.height = '10px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '9999';
      sparkle.style.transform = 'translate(-50%, -50%) scale(0)';
      sparkle.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      sparkle.style.opacity = '1';

      // SVG Sparkle shape
      const color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.innerHTML = `
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path fill="${color}" d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z"/>
        </svg>
      `;

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 25;
        sparkle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(${0.8 + Math.random() * 0.5}) rotate(${Math.random() * 90}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 650);
    }
  }
}
