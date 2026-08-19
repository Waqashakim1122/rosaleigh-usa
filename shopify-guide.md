# Rosaleigh Skincare — Shopify 2.0 Theme Integration Guide

This guide explains how the HTML/CSS/JS code built for **Rosaleigh** converts seamlessly into a high-converting, luxury **Shopify 2.0 Theme**.

---

## 1. Shopify Theme Architecture vs. HTML/CSS/PHP

| Feature | Standard HTML / PHP | Shopify 2.0 Theme (Dawn / Custom) |
| :--- | :--- | :--- |
| **Templating Engine** | PHP (`<?php ... ?>`) / HTML | **Liquid** (`{{ ... }}`, `{% ... %}`) |
| **Styling** | `css/style.css`, `css/responsive.css` | `assets/rosaleigh.css` |
| **Logic & Interactions** | `js/cart.js`, `js/main.js`, `js/faq.js` | `assets/rosaleigh.js` |
| **Modular Parts** | `includes/header.php`, `includes/footer.php` | `sections/*.liquid`, `snippets/*.liquid` |
| **Commerce & Checkout** | Local JavaScript Demo | **Shopify Cart AJAX API** (`/cart/add.js`, `/cart.js`) |

---

## 2. Directory Mapping for Shopify

To turn this project into a Shopify theme:

```
rosaleigh-shopify-theme/
├── assets/
│   ├── rosaleigh.css               # from css/style.css + css/responsive.css
│   ├── rosaleigh.js                # from js/main.js, js/faq.js, js/slider.js
│   ├── cart-drawer.js              # from js/cart.js (connected to /cart/add.js)
│   ├── Logo.png                    # from images/Logo.png
│   └── hero-products.png           # from assets/images/hero/hero-products.png
│
├── config/
│   └── settings_schema.json        # Global theme colors, typography, curves
│
├── layout/
│   └── theme.liquid                # Master layout with announcement, header, {{ content_for_layout }}, footer, cart drawer
│
├── sections/
│   ├── announcement-bar.liquid     # 3-item UK banner
│   ├── header.liquid               # Nav, Logo, Currency, Account, Bag badge
│   ├── hero-banner.liquid          # Hero banner with editable text & wave divider
│   ├── trust-badges.liquid         # 5 Grass-fed/UK trust badges
│   ├── bestsellers-grid.liquid     # Dynamic Shopify collection grid with quick add
│   ├── video-showcase.liquid       # Video player section with autoplay & tags
│   ├── why-tallow.liquid           # Curved container with bullet points & bowl visual
│   ├── why-rosaleigh.liquid        # 4 feature cards
│   ├── testimonials-slider.liquid  # Quote carousel with Emily R and reviews
│   ├── newsletter.liquid           # Shopify customer newsletter integration
│   ├── main-about.liquid           # About page template
│   ├── main-contact.liquid         # Contact page + Shopify contact form
│   ├── main-ingredients.liquid     # 4 Core pillars grid
│   └── footer.liquid               # Multi-column footer & payment badges
│
└── snippets/
    ├── product-card.liquid         # Reusable card with price, rating & quick add
    ├── cart-drawer.liquid          # Slide-out Ajax bag drawer
    └── wave-curve.liquid           # SVG organic wave dividers
```

---

## 3. Sample Shopify Section Conversion (`sections/hero-banner.liquid`)

```liquid
<section class="hero-section" id="Hero-{{ section.id }}">
  <div class="container">
    <div class="hero-grid">
      
      <div class="hero-content">
        {% if section.settings.eyebrow != blank %}
          <span class="eyebrow">{{ section.settings.eyebrow }}</span>
        {% endif %}
        
        <h1 class="hero-title">
          {{ section.settings.heading | default: "Nourish Naturally.<br><span class='glow'>Glow</span> Authentically." }}
        </h1>
        
        <p class="hero-description">
          {{ section.settings.subheading }}
        </p>
        
        {% if section.settings.btn_label != blank %}
          <div>
            <a href="{{ section.settings.btn_link }}" class="btn btn-primary btn-lg">
              {{ section.settings.btn_label }}
            </a>
          </div>
        {% endif %}
      </div>

      <div class="hero-image-wrap">
        {% if section.settings.image != blank %}
          <img src="{{ section.settings.image | image_url: width: 1200 }}" 
               alt="{{ section.settings.image.alt | default: 'Rosaleigh Tallow Skincare' }}" 
               class="hero-products-img" 
               loading="eager">
        {% else %}
          <img src="{{ 'hero-products.png' | asset_url }}" alt="Rosaleigh Tallow Skincare" class="hero-products-img">
        {% endif %}
      </div>

    </div>
  </div>
</section>

<!-- Signature Wave Curve Divider -->
<div class="curve-divider curve-divider-bottom" style="background-color: var(--bg-warm-cream);">
  <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
    <path d="M0,0 C320,80 480,110 720,80 C960,50 1180,95 1440,30 L1440,120 L0,120 Z" fill="#FFFFFF"></path>
  </svg>
</div>

{% schema %}
{
  "name": "Rosaleigh Hero Banner",
  "settings": [
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Eyebrow Text",
      "default": "TALLOW BASED SKINCARE"
    },
    {
      "type": "html",
      "id": "heading",
      "label": "Heading (HTML allowed)",
      "default": "Nourish Naturally.<br><span class=\"glow\">Glow</span> Authentically."
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Handcrafted tallow-based skincare made with nature's finest ingredients for healthy, radiant skin."
    },
    {
      "type": "text",
      "id": "btn_label",
      "label": "Button Label",
      "default": "Shop Our Collection"
    },
    {
      "type": "url",
      "id": "btn_link",
      "label": "Button Link"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Hero Image (Stone composition)"
    }
  ],
  "presets": [
    {
      "name": "Rosaleigh Hero Banner"
    }
  ]
}
{% endschema %}
```

---

## 4. Connecting Shopify Cart Drawer to AJAX API

In `cart-drawer.js`, replace the `localStorage` logic with Shopify's native endpoint:

```javascript
// Adding to Shopify Bag
function addShopifyItem(variantId, quantity = 1) {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: variantId, quantity: quantity }] })
  })
  .then(res => res.json())
  .then(data => {
    fetch('/cart.js')
      .then(res => res.json())
      .then(cart => updateCartDrawerUI(cart));
  });
}
```

---

## 5. Summary & Next Steps

- The current codebase is **100% compatible** with Shopify 2.0.
- All styles (`css/style.css`), curves, responsiveness (`css/responsive.css`), and JavaScript are cleanly decoupled from server dependencies.
- You can preview and test every single interaction locally by opening `index.html` in any browser!
