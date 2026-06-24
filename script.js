/* ===================================================
   Hamilton Vendas — Main Script
   =================================================== */

// ---- DEFAULT CONFIG (overridden by admin settings in localStorage) ----
const DEFAULT_CONFIG = {
  storeName:    "Só Vendas",
  whatsapp:     "351912345678",
  currency:     "€",
  heroHeadline: "Moda que chega <br /><em>com estilo</em>",
  heroSub:      "Escolha as suas peças favoritas — roupas, sapatos e pulseiras de qualidade. Enviamos de Portugal direto para São Tomé. Pedido simples pelo WhatsApp.",
  seoTitle:     "Só Vendas — Moda de Portugal para São Tomé",
  seoDesc:      "Encomende roupas, sapatos e pulseiras de qualidade de Portugal para São Tomé e Príncipe. Pedido rápido via WhatsApp.",
  seoKeywords:  "roupas portugal são tomé, sapatos encomenda, pulseiras moda, só vendas",
  ogTitle:      "Só Vendas — Moda de Portugal para São Tomé",
  ogDesc:       "Encomende roupas, sapatos e pulseiras via WhatsApp.",
  ogImage:      "",
};

const DEFAULT_PRODUCTS = [
  {
    id: 1, name: "T-Shirt Básica Premium",
    category: "roupa", price: 15.00,
    desc: "T-shirt em algodão de alta qualidade. Disponível em várias cores.",
    emoji: "👕", available: true
  },
  {
    id: 2, name: "Vestido Floral Verão",
    category: "roupa", price: 38.00,
    desc: "Vestido leve com estampado floral, perfeito para o calor de São Tomé.",
    emoji: "👗", available: true
  },
  {
    id: 3, name: "Camisa de Linho Azul",
    category: "roupa", price: 29.00,
    desc: "Camisa elegante em linho natural. Fresca e confortável.",
    emoji: "👔", available: true
  },
  {
    id: 4, name: "Calças Chino Bege",
    category: "roupa", price: 34.00,
    desc: "Calças chino clássicas, versáteis para o dia-a-dia.",
    emoji: "👖", available: true
  },
  {
    id: 5, name: "Sapatilhas Brancas Classic",
    category: "sapato", price: 48.00,
    desc: "Sapatilhas brancas atemporais. Conforto garantido para uso diário.",
    emoji: "👟", available: true
  },
  {
    id: 6, name: "Sandálias de Verão",
    category: "sapato", price: 32.00,
    desc: "Sandálias confortáveis e estilosas, ideais para o verão.",
    emoji: "🩴", available: true
  },
  {
    id: 7, name: "Sapatos de Couro Marrom",
    category: "sapato", price: 65.00,
    desc: "Sapatos clássicos em couro genuíno. Elegância para qualquer ocasião.",
    emoji: "👞", available: true
  },
  {
    id: 8, name: "Pulseira Dourada Elegante",
    category: "pulseira", price: 14.00,
    desc: "Pulseira fina em aço inoxidável banhada a ouro. Resistente e elegante.",
    emoji: "📿", available: true
  },
  {
    id: 9, name: "Conjunto 3 Pulseiras",
    category: "pulseira", price: 20.00,
    desc: "Conjunto de 3 pulseiras combinadas — ouro, prata e couro.",
    emoji: "💫", available: true
  },
  {
    id: 10, name: "Pulseira Tecida Colorida",
    category: "pulseira", price: 9.00,
    desc: "Pulseira artesanal com padrões coloridos. Feita à mão em Portugal.",
    emoji: "🌈", available: true
  },
];

// ---- STATE ----
let config = {};
let products = [];
let cart = []; // [{id, qty}]
let currentFilter = "all";

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  loadProducts();
  applyConfig();
  renderProducts(currentFilter);
  updateCartUI();
});

// ---- STORAGE HELPERS ----
function loadConfig() {
  try {
    const stored = localStorage.getItem("hv_config");
    config = stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : { ...DEFAULT_CONFIG };
  } catch {
    config = { ...DEFAULT_CONFIG };
  }
}

function loadProducts() {
  try {
    const stored = localStorage.getItem("hv_products");
    products = stored ? JSON.parse(stored) : [...DEFAULT_PRODUCTS];
  } catch {
    products = [...DEFAULT_PRODUCTS];
  }
}

// ---- APPLY CONFIG TO PAGE ----
function applyConfig() {
  safeSet("page-title", "textContent", config.seoTitle);
  safeAttr("page-description", "content", config.seoDesc);
  safeAttr("page-keywords", "content", config.seoKeywords);
  safeAttr("og-title", "content", config.ogTitle);
  safeAttr("og-description", "content", config.ogDesc);
  safeAttr("og-image", "content", config.ogImage);

  const heroH = document.getElementById("hero-headline");
  if (heroH) heroH.innerHTML = config.heroHeadline;
  safeSet("hero-subheadline", "textContent", config.heroSub);

  // WhatsApp contact link
  const waLink = document.getElementById("contact-whatsapp-link");
  if (waLink) {
    const msg = encodeURIComponent(`Olá! Tenho interesse nos produtos da ${config.storeName}. Podem ajudar-me?`);
    waLink.href = `https://wa.me/${config.whatsapp}?text=${msg}`;
  }
}

function safeSet(id, prop, val) {
  const el = document.getElementById(id);
  if (el && val) el[prop] = val;
}
function safeAttr(id, attr, val) {
  const el = document.getElementById(id);
  if (el && val) el.setAttribute(attr, val);
}

// ---- PRODUCT RENDERING ----
const CAT_LABELS = { roupa: "Roupas", sapato: "Sapatos", pulseira: "Pulseiras" };

function filterProducts(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderProducts(cat);
}

function renderProducts(filter) {
  const grid = document.getElementById("products-grid");
  const empty = document.getElementById("empty-state");
  if (!grid) return;

  const filtered = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  if (!filtered.length) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  grid.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    const added = !!inCart;
    const qtyStr = inCart ? ` (${inCart.qty})` : "";
    const imgHtml = p.image
      ? `<img src="${p.image}" class="product-img" alt="${escHtml(p.name)}" loading="lazy" />`
      : `<div class="product-img-placeholder">${p.emoji}</div>`;
    return `
      <div class="product-card" data-id="${p.id}">
        ${imgHtml}
        <div class="product-body">
          <div class="product-cat-tag">${CAT_LABELS[p.category] || p.category}</div>
          <div class="product-name">${escHtml(p.name)}</div>
          <div class="product-desc">${escHtml(p.desc)}</div>
          <div class="product-footer">
            <span class="product-price">${config.currency}${p.price.toFixed(2).replace(".",",")}</span>
            ${p.available
              ? `<button class="add-btn${added ? " added" : ""}" onclick="addToCart(${p.id})">
                   ${added ? "✓ Adicionado" + qtyStr : "+ Adicionar"}
                 </button>`
              : `<span class="badge-unavailable">Indisponível</span>`
            }
          </div>
        </div>
      </div>`;
  }).join("");
}

// ---- CART ----
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || !product.available) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  updateCartUI();
  renderProducts(currentFilter);
  showToast(`"${product.name}" adicionado ao pedido`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderProducts(currentFilter);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCartUI();
  renderProducts(currentFilter);
}

function clearCart() {
  cart = [];
  updateCartUI();
  renderProducts(currentFilter);
  closeCart();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => {
    const p = products.find(pr => pr.id === c.id);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  // Badge
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = totalItems;

  // Empty vs list
  const emptyEl = document.getElementById("cart-empty");
  const listEl = document.getElementById("cart-list");
  const footerEl = document.getElementById("cart-footer");

  if (totalItems === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    if (listEl) listEl.innerHTML = "";
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  if (footerEl) footerEl.style.display = "flex";

  if (listEl) {
    listEl.innerHTML = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return "";
      const subtotal = (p.price * item.qty).toFixed(2).replace(".", ",");
      return `
        <li class="cart-item">
          <div class="cart-item-emoji">${p.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${escHtml(p.name)}</div>
            <div class="cart-item-price">${config.currency}${p.price.toFixed(2).replace(".",",")} × ${item.qty} = ${config.currency}${subtotal}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
              <button class="cart-item-remove" onclick="removeFromCart(${p.id})">Remover</button>
            </div>
          </div>
        </li>`;
    }).join("");
  }

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = `${config.currency}${totalPrice.toFixed(2).replace(".", ",")}`;
}

function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const isOpen = drawer && drawer.classList.contains("open");
  if (isOpen) closeCart(); else openCart();
}

function openCart() {
  document.getElementById("cart-drawer")?.classList.add("open");
  document.getElementById("cart-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

// ---- WHATSAPP ORDER ----
function sendWhatsAppOrder() {
  if (!cart.length) return;

  const totalPrice = cart.reduce((s, c) => {
    const p = products.find(pr => pr.id === c.id);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  const lines = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return "";
    return `  • ${p.name} x${item.qty} — ${config.currency}${(p.price * item.qty).toFixed(2).replace(".", ",")}`;
  }).filter(Boolean).join("\n");

  const message = `Olá! Tenho interesse em fazer a seguinte encomenda na ${config.storeName}:\n\n${lines}\n\n*Total: ${config.currency}${totalPrice.toFixed(2).replace(".", ",")}*\n\nPodem confirmar disponibilidade e condições de entrega para São Tomé? Obrigado!`;

  const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ---- UTILS ----
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- CONTACT FORM (Mais Informações) ----
function submitContactForm(e) {
  e.preventDefault();
  const name    = document.getElementById("cf-name")?.value.trim();
  const phone   = document.getElementById("cf-phone")?.value.trim();
  const email   = document.getElementById("cf-email")?.value.trim();
  const message = document.getElementById("cf-message")?.value.trim();
  const errEl   = document.getElementById("cf-error");

  if (!name || !phone) {
    if (errEl) { errEl.textContent = "Por favor preencha o nome e o contacto."; errEl.style.display = "block"; }
    return;
  }
  if (errEl) errEl.style.display = "none";

  let text = `Olá! Vim pelo site da ${config.storeName} e gostaria de receber mais informações.\n\n`;
  text += `*Nome:* ${name}\n`;
  text += `*Contacto:* ${phone}\n`;
  if (email)   text += `*Email:* ${email}\n`;
  if (message) text += `*Mensagem:* ${message}\n`;
  text += `\nAguardo o vosso contacto. Obrigado!`;

  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

// ---- HEADER SCROLL SHADOW ----
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (header) {
    header.style.boxShadow = window.scrollY > 10 ? "0 2px 20px rgba(0,0,0,.3)" : "none";
  }
});
