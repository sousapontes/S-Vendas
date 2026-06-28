/* ===================================================
   Só Vendas — Main Script
   =================================================== */

const DEFAULT_CONFIG = {
  storeName:    "Só Vendas",
  whatsapp:     "351924148088",
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
  // ROUPAS — Masculino
  { id: 1,  name: "T-Shirt Básica Premium",    category: "roupa",    subcategory: "masculino", price: 15.00, desc: "T-shirt em algodão de alta qualidade. Disponível em várias cores.",             emoji: "👕", available: true },
  { id: 2,  name: "Camisa de Linho Azul",       category: "roupa",    subcategory: "masculino", price: 29.00, desc: "Camisa elegante em linho natural. Fresca e confortável.",                        emoji: "👔", available: true },
  { id: 3,  name: "Calças Chino Bege",          category: "roupa",    subcategory: "masculino", price: 34.00, desc: "Calças chino clássicas, versáteis para o dia-a-dia.",                            emoji: "👖", available: true },
  // ROUPAS — Feminino
  { id: 4,  name: "Vestido Floral Verão",       category: "roupa",    subcategory: "feminino",  price: 38.00, desc: "Vestido leve com estampado floral, perfeito para o calor de São Tomé.",          emoji: "👗", available: true },
  { id: 5,  name: "Blusa de Alças Branca",      category: "roupa",    subcategory: "feminino",  price: 18.00, desc: "Blusa leve e elegante, ideal para o dia-a-dia.",                                 emoji: "👚", available: true },
  // ROUPAS — Criança
  { id: 6,  name: "Conjunto Criança Verão",     category: "roupa",    subcategory: "crianca",   price: 22.00, desc: "Conjunto de camiseta e calção para criança. Confortável e colorido.",            emoji: "🧒", available: true },
  // SAPATOS — Masculino
  { id: 7,  name: "Sapatilhas Brancas Classic", category: "sapato",   subcategory: "masculino", price: 48.00, desc: "Sapatilhas brancas atemporais. Conforto garantido para uso diário.",             emoji: "👟", available: true },
  { id: 8,  name: "Sapatos de Couro Marrom",    category: "sapato",   subcategory: "masculino", price: 65.00, desc: "Sapatos clássicos em couro genuíno. Elegância para qualquer ocasião.",           emoji: "👞", available: true },
  // SAPATOS — Feminino
  { id: 9,  name: "Sandálias de Verão",         category: "sapato",   subcategory: "feminino",  price: 32.00, desc: "Sandálias confortáveis e estilosas, ideais para o verão.",                      emoji: "🩴", available: true },
  { id: 10, name: "Sapatilhas Rosas",           category: "sapato",   subcategory: "feminino",  price: 42.00, desc: "Sapatilhas elegantes em rosa. Leves e confortáveis.",                            emoji: "👠", available: true },
  // SAPATOS — Criança
  { id: 11, name: "Ténis Criança Coloridos",    category: "sapato",   subcategory: "crianca",   price: 28.00, desc: "Ténis leves e resistentes para crianças. Fecho com velcro.",                    emoji: "👟", available: true },
  // PULSEIRAS
  { id: 12, name: "Pulseira Dourada Elegante",  category: "pulseira", subcategory: null,        price: 14.00, desc: "Pulseira fina em aço inoxidável banhada a ouro. Resistente e elegante.",         emoji: "📿", available: true },
  { id: 13, name: "Conjunto 3 Pulseiras",       category: "pulseira", subcategory: null,        price: 20.00, desc: "Conjunto de 3 pulseiras combinadas — ouro, prata e couro.",                     emoji: "💫", available: true },
  { id: 14, name: "Pulseira Tecida Colorida",   category: "pulseira", subcategory: null,        price: 9.00,  desc: "Pulseira artesanal com padrões coloridos. Feita à mão em Portugal.",             emoji: "🌈", available: true },
];

// ---- STATE ----
let config = {};
let products = [];
let cart = [];
let currentCategory   = "all";
let currentSubcategory = "all";
let searchQuery        = "";

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  loadProducts();
  applyConfig();
  renderProducts();
  updateCartUI();
});

// ---- STORAGE ----
function loadConfig() {
  try {
    const s = localStorage.getItem("hv_config");
    config = s ? { ...DEFAULT_CONFIG, ...JSON.parse(s) } : { ...DEFAULT_CONFIG };
  } catch { config = { ...DEFAULT_CONFIG }; }
}

function loadProducts() {
  try {
    const s = localStorage.getItem("hv_products");
    products = s ? JSON.parse(s) : [...DEFAULT_PRODUCTS];
  } catch { products = [...DEFAULT_PRODUCTS]; }
}

// ---- APPLY CONFIG ----
function applyConfig() {
  safeSet("page-title",        "textContent", config.seoTitle);
  safeAttr("page-description", "content",     config.seoDesc);
  safeAttr("page-keywords",    "content",     config.seoKeywords);
  safeAttr("og-title",         "content",     config.ogTitle);
  safeAttr("og-description",   "content",     config.ogDesc);
  safeAttr("og-image",         "content",     config.ogImage);
  const heroH = document.getElementById("hero-headline");
  if (heroH) heroH.innerHTML = config.heroHeadline;
  safeSet("hero-subheadline", "textContent", config.heroSub);
  const waLink = document.getElementById("contact-whatsapp-link");
  if (waLink) {
    const msg = encodeURIComponent(`Olá! Tenho interesse nos produtos da ${config.storeName}. Podem ajudar-me?`);
    waLink.href = `https://wa.me/${config.whatsapp}?text=${msg}`;
  }
}

function safeSet(id, prop, val)  { const el = document.getElementById(id); if (el && val) el[prop] = val; }
function safeAttr(id, attr, val) { const el = document.getElementById(id); if (el && val) el.setAttribute(attr, val); }

// ---- LABELS ----
const CAT_LABELS    = { roupa: "Roupas", sapato: "Sapatos", pulseira: "Pulseiras" };
const SUBCAT_LABELS = { masculino: "Masculino", feminino: "Feminino", crianca: "Criança" };

// ---- FILTERS ----
function filterProducts(cat, btn) {
  currentCategory    = cat;
  currentSubcategory = "all";
  searchQuery        = "";

  // Reset search input
  const si = document.getElementById("search-input");
  if (si) si.value = "";
  const sc = document.getElementById("search-clear");
  if (sc) sc.style.display = "none";

  // Active state on category buttons
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  // Show/hide subcategory bar
  const subcatBar = document.getElementById("subcat-bar");
  if (subcatBar) {
    const hasSubcat = cat === "roupa" || cat === "sapato";
    subcatBar.style.display = hasSubcat ? "flex" : "none";
  }
  // Reset subcategory buttons
  document.querySelectorAll(".subcat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.subcat === "all");
  });

  renderProducts();
}

function filterSubcategory(subcat, btn) {
  currentSubcategory = subcat;
  document.querySelectorAll(".subcat-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderProducts();
}

function searchProducts(val) {
  searchQuery = val.trim().toLowerCase();
  const sc = document.getElementById("search-clear");
  if (sc) sc.style.display = searchQuery ? "flex" : "none";
  renderProducts();
}

function clearSearch() {
  searchQuery = "";
  const si = document.getElementById("search-input");
  if (si) { si.value = ""; si.focus(); }
  const sc = document.getElementById("search-clear");
  if (sc) sc.style.display = "none";
  renderProducts();
}

// ---- RENDER ----
function renderProducts() {
  const grid  = document.getElementById("products-grid");
  const empty = document.getElementById("empty-state");
  const countEl = document.getElementById("search-count");
  if (!grid) return;

  let filtered = products;

  if (currentCategory !== "all")
    filtered = filtered.filter(p => p.category === currentCategory);

  if (currentSubcategory !== "all")
    filtered = filtered.filter(p => p.subcategory === currentSubcategory);

  if (searchQuery)
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.desc.toLowerCase().includes(searchQuery)
    );

  // Search count label
  if (countEl) {
    if (searchQuery && filtered.length > 0) {
      countEl.textContent = `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para "${searchQuery}"`;
      countEl.style.display = "block";
    } else if (searchQuery && filtered.length === 0) {
      countEl.textContent = `Sem resultados para "${searchQuery}"`;
      countEl.style.display = "block";
    } else {
      countEl.style.display = "none";
    }
  }

  if (!filtered.length) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  grid.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    const added  = !!inCart;
    const qtyStr = inCart ? ` (${inCart.qty})` : "";
    const imgHtml = p.image
      ? `<img src="${p.image}" class="product-img" alt="${escHtml(p.name)}" loading="lazy" />`
      : `<div class="product-img-placeholder">${p.emoji}</div>`;

    // Category + subcategory tag
    const catLabel    = CAT_LABELS[p.category] || p.category;
    const subcatLabel = p.subcategory ? SUBCAT_LABELS[p.subcategory] : "";
    const tagHtml     = subcatLabel
      ? `<div class="product-cat-tag"><span>${catLabel}</span><span class="subcat-sep">›</span><span>${subcatLabel}</span></div>`
      : `<div class="product-cat-tag"><span>${catLabel}</span></div>`;

    return `
      <div class="product-card" data-id="${p.id}">
        ${imgHtml}
        <div class="product-body">
          ${tagHtml}
          <div class="product-name">${escHtml(p.name)}</div>
          <div class="product-desc">${escHtml(p.desc)}</div>
          <div class="product-footer">
            <span class="product-price">${config.currency}${p.price.toFixed(2).replace(".", ",")}</span>
            ${p.available
              ? `<button class="add-btn${added ? " added" : ""}" onclick="addToCart(${p.id})">
                   ${added ? "✓ Adicionado" + qtyStr : "+ Adicionar"}
                 </button>`
              : `<span class="badge-unavailable">Indisponível</span>`}
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
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });
  updateCartUI();
  renderProducts();
  showToast(`"${product.name}" adicionado ao pedido`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderProducts();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  updateCartUI();
  renderProducts();
}

function clearCart() {
  cart = [];
  updateCartUI();
  renderProducts();
  closeCart();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => {
    const p = products.find(pr => pr.id === c.id);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = totalItems;

  const emptyEl  = document.getElementById("cart-empty");
  const listEl   = document.getElementById("cart-list");
  const footerEl = document.getElementById("cart-footer");

  if (totalItems === 0) {
    if (emptyEl)  emptyEl.style.display  = "block";
    if (listEl)   listEl.innerHTML        = "";
    if (footerEl) footerEl.style.display = "none";
    return;
  }
  if (emptyEl)  emptyEl.style.display  = "none";
  if (footerEl) footerEl.style.display = "flex";

  if (listEl) {
    listEl.innerHTML = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return "";
      const subtotal = (p.price * item.qty).toFixed(2).replace(".", ",");
      const thumb = p.image
        ? `<img src="${p.image}" class="cart-item-thumb" alt="${escHtml(p.name)}" />`
        : `<div class="cart-item-emoji">${p.emoji}</div>`;
      return `
        <li class="cart-item">
          ${thumb}
          <div class="cart-item-info">
            <div class="cart-item-name">${escHtml(p.name)}</div>
            <div class="cart-item-price">${config.currency}${p.price.toFixed(2).replace(".", ",")} × ${item.qty} = ${config.currency}${subtotal}</div>
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

// ---- MOBILE NAV ----
function toggleMobileNav() {
  const nav = document.getElementById("mobile-nav");
  if (nav?.classList.contains("open")) closeMobileNav();
  else {
    nav?.classList.add("open");
    document.getElementById("mobile-nav-overlay")?.classList.add("open");
    document.getElementById("hamburger")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}
function closeMobileNav() {
  document.getElementById("mobile-nav")?.classList.remove("open");
  document.getElementById("mobile-nav-overlay")?.classList.remove("open");
  document.getElementById("hamburger")?.classList.remove("open");
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
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

// ---- CONTACT FORM ----
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
  text += `*Nome:* ${name}\n*Contacto:* ${phone}\n`;
  if (email)   text += `*Email:* ${email}\n`;
  if (message) text += `*Mensagem:* ${message}\n`;
  text += `\nAguardo o vosso contacto. Obrigado!`;
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ---- HEADER SCROLL ----
window.addEventListener("scroll", () => {
  const h = document.getElementById("header");
  if (h) h.style.boxShadow = window.scrollY > 10 ? "0 2px 20px rgba(0,0,0,.3)" : "none";
});
