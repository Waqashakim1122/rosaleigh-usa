/* ==========================================================================
   ROSALEIGH LUXURY SKINCARE - MASTER JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-nav-close');

  function openMobileNav() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.add('active');
      mobileBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.remove('active');
      mobileBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

  // 3. Search Modal
  const searchTriggers = document.querySelectorAll('.trigger-search');
  const searchModal = document.getElementById('search-modal');
  const searchBackdrop = document.getElementById('search-backdrop');
  const searchCloseBtn = document.getElementById('search-close-btn');

  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('active');
      const input = searchModal.querySelector('input');
      if (input) setTimeout(() => input.focus(), 150);
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // 4. Currency Switcher Engine (GBP, USD, EUR)
  const currencyOptions = document.querySelectorAll('.currency-option');
  const currentCurrencyLabel = document.getElementById('current-currency-label');
  const currentFlag = document.getElementById('current-currency-flag');

  const exchangeRates = {
    'GBP': { symbol: '£', rate: 1.0, flag: '🇬🇧' },
    'USD': { symbol: '$', rate: 1.30, flag: '🇺🇸' },
    'EUR': { symbol: '€', rate: 1.18, flag: '🇪🇺' }
  };

  let activeCurrency = 'GBP';

  currencyOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const curr = opt.getAttribute('data-currency');
      if (!curr || !exchangeRates[curr]) return;

      activeCurrency = curr;
      if (currentCurrencyLabel) currentCurrencyLabel.textContent = `${curr} ${exchangeRates[curr].symbol}`;
      
      // Update displayed product prices on page
      document.querySelectorAll('[data-base-price]').forEach(priceEl => {
        const base = parseFloat(priceEl.getAttribute('data-base-price'));
        const converted = (base * exchangeRates[curr].rate).toFixed(2);
        priceEl.textContent = `${exchangeRates[curr].symbol}${converted}`;
      });

      RosaleighCart.showToast(`Currency changed to ${curr} (${exchangeRates[curr].symbol})`);
    });
  });

  // 5. Newsletter Forms
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        RosaleighCart.showToast(`Thank you for subscribing with ${input.value}! 🌿`);
        input.value = '';
      }
    });
  });

  // 6. Contact Form & Price Quote URL Auto-Population
  const contactForm = document.getElementById('rosaleigh-contact-form');
  const urlParams = new URLSearchParams(window.location.search);
  const selectedProduct = urlParams.get('product');

  if (selectedProduct) {
    const productSelect = document.getElementById('contact-product');
    const subjectInput = document.getElementById('contact-subject');
    if (productSelect) {
      // Find matching option
      for (let i = 0; i < productSelect.options.length; i++) {
        if (productSelect.options[i].text.toLowerCase().includes(selectedProduct.toLowerCase()) || 
            productSelect.options[i].value.toLowerCase().includes(selectedProduct.toLowerCase())) {
          productSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (subjectInput && !subjectInput.value) {
      subjectInput.value = `Price Quote Request: ${selectedProduct}`;
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('#contact-name');
      const name = nameInput ? nameInput.value : 'friend';
      RosaleighCart.showToast(`Thank you ${name}, your quote request has been sent to our team! We will reply shortly. 🌿`);
      contactForm.reset();
    });
  }

  // 7. Shop Sorting & Filtering Handler
  const sortSelect = document.getElementById('sort-by');
  const catalogGrid = document.getElementById('catalog-products-grid');

  if (sortSelect && catalogGrid) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const cards = Array.from(catalogGrid.querySelectorAll('.product-card'));

      if (val === 'rating') {
        cards.sort((a, b) => parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0));
      } else if (val === 'name') {
        cards.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
      }

      cards.forEach(card => catalogGrid.appendChild(card));
    });
  }

  // 8. Video Player Overlay Play/Pause Interaction
  const videoElements = document.querySelectorAll('.ambient-video');
  videoElements.forEach(vid => {
    vid.addEventListener('click', () => {
      if (vid.paused) {
        vid.play();
      } else {
        vid.pause();
      }
    });
  });
});
