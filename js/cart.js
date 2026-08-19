/* ==========================================================================
   ROSALEIGH LUXURY TALLOW SKINCARE - CART & COMMERCE ENGINE
   ========================================================================== */

const RosaleighCart = (() => {
  const STORAGE_KEY = 'rosaleigh_cart_v1';
  const FREE_SHIPPING_THRESHOLD = 50.0; // £50 Free shipping in UK
  
  // Default sample cart items if first time
  const defaultItems = [
    {
      id: 'tallow-balm-60ml',
      name: 'Tallow Balm (Nourishing & Restoring)',
      price: 24.00,
      image: 'images/tallow balm1 white.jpeg',
      quantity: 1
    }
  ];

  let cart = [];

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        cart = JSON.parse(saved);
      } catch (e) {
        cart = defaultItems;
      }
    } else {
      cart = defaultItems;
      save();
    }
    render();
    bindEvents();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    render();
  }

  function addItem(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image || 'images/tallow balm1 white.jpeg',
        quantity: product.quantity || 1
      });
    }
    save();
    openDrawer();
    showToast(`Added "${product.name}" to your bag!`);
  }

  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    save();
  }

  function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(id);
    } else {
      save();
    }
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function render() {
    // Update all badge counters
    const totalCount = getTotalItems();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update Drawer list
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem auto; display: block; opacity: 0.5;">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 01-8 0"></path>
          </svg>
          <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-dark);">Your bag is empty</p>
          <p style="font-size: 0.875rem;">Discover our handcrafted organic tallow skincare formulas.</p>
        </div>
      `;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="RosaleighCart.updateQty('${item.id}', -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="RosaleighCart.updateQty('${item.id}', 1)">+</button>
            </div>
            <div>
              <a href="javascript:void(0)" class="cart-item-remove" onclick="RosaleighCart.removeItem('${item.id}')">Remove</a>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Subtotal
    const subtotal = getSubtotal();
    const subtotalEl = document.getElementById('cart-subtotal-val');
    if (subtotalEl) {
      subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
    }

    // Free Shipping Progress
    const meterEl = document.getElementById('shipping-meter-text');
    const meterFill = document.getElementById('shipping-meter-fill');
    if (meterEl && meterFill) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        meterEl.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for <strong>FREE UK Delivery</strong>!`;
        meterFill.style.width = '100%';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        meterEl.innerHTML = `Add <strong>£${remaining}</strong> more for <strong>FREE UK Delivery</strong>`;
        meterFill.style.width = `${percent}%`;
      }
    }
  }

  function openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function bindEvents() {
    document.querySelectorAll('.trigger-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Global Add to Cart Buttons
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add-to-cart]');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.getAttribute('data-id');
        const name = addBtn.getAttribute('data-name');
        const price = addBtn.getAttribute('data-price');
        const image = addBtn.getAttribute('data-image');
        addItem({ id, name, price, image });
      }
    });
  }

  function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E9833" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  return {
    init,
    addItem,
    removeItem,
    updateQty,
    openDrawer,
    closeDrawer,
    showToast
  };
})();

document.addEventListener('DOMContentLoaded', RosaleighCart.init);
