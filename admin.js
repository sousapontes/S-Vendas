/* ===================================================
   Hamilton Vendas — Admin Panel Script
   =================================================== */

const DEFAULT_PASSWORD = "hamilton1999";

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
  { id: 1,  name: "T-Shirt Básica Premium",    category: "roupa",    subcategory: "masculino", price: 15.00, desc: "T-shirt em algodão de alta qualidade. Disponível em várias cores.",             emoji: "👕", available: true },
  { id: 2,  name: "Camisa de Linho Azul",       category: "roupa",    subcategory: "masculino", price: 29.00, desc: "Camisa elegante em linho natural. Fresca e confortável.",                        emoji: "👔", available: true },
  { id: 3,  name: "Calças Chino Bege",          category: "roupa",    subcategory: "masculino", price: 34.00, desc: "Calças chino clássicas, versáteis para o dia-a-dia.",                            emoji: "👖", available: true },
  { id: 4,  name: "Vestido Floral Verão",       category: "roupa",    subcategory: "feminino",  price: 38.00, desc: "Vestido leve com estampado floral, perfeito para o calor de São Tomé.",          emoji: "👗", available: true },
  { id: 5,  name: "Blusa de Alças Branca",      category: "roupa",    subcategory: "feminino",  price: 18.00, desc: "Blusa leve e elegante, ideal para o dia-a-dia.",                                 emoji: "👚", available: true },
  { id: 6,  name: "Conjunto Criança Verão",     category: "roupa",    subcategory: "crianca",   price: 22.00, desc: "Conjunto de camiseta e calção para criança. Confortável e colorido.",            emoji: "🧒", available: true },
  { id: 7,  name: "Sapatilhas Brancas Classic", category: "sapato",   subcategory: "masculino", price: 48.00, desc: "Sapatilhas brancas atemporais. Conforto garantido para uso diário.",             emoji: "👟", available: true },
  { id: 8,  name: "Sapatos de Couro Marrom",    category: "sapato",   subcategory: "masculino", price: 65.00, desc: "Sapatos clássicos em couro genuíno. Elegância para qualquer ocasião.",           emoji: "👞", available: true },
  { id: 9,  name: "Sandálias de Verão",         category: "sapato",   subcategory: "feminino",  price: 32.00, desc: "Sandálias confortáveis e estilosas, ideais para o verão.",                      emoji: "🩴", available: true },
  { id: 10, name: "Sapatilhas Rosas",           category: "sapato",   subcategory: "feminino",  price: 42.00, desc: "Sapatilhas elegantes em rosa. Leves e confortáveis.",                            emoji: "👠", available: true },
  { id: 11, name: "Ténis Criança Coloridos",    category: "sapato",   subcategory: "crianca",   price: 28.00, desc: "Ténis leves e resistentes para crianças. Fecho com velcro.",                    emoji: "👟", available: true },
  { id: 12, name: "Pulseira Dourada Elegante",  category: "pulseira", subcategory: null,        price: 14.00, desc: "Pulseira fina em aço inoxidável banhada a ouro. Resistente e elegante.",         emoji: "📿", available: true },
  { id: 13, name: "Conjunto 3 Pulseiras",       category: "pulseira", subcategory: null,        price: 20.00, desc: "Conjunto de 3 pulseiras combinadas — ouro, prata e couro.",                     emoji: "💫", available: true },
  { id: 14, name: "Pulseira Tecida Colorida",   category: "pulseira", subcategory: null,        price: 9.00,  desc: "Pulseira artesanal com padrões coloridos. Feita à mão em Portugal.",             emoji: "🌈", available: true },
];

// ---- STATE ----
let config   = {};
let products = [];

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) {
    showPanel();
  } else {
    document.getElementById("login-screen").style.display = "flex";
  }
  setupCharCounters();
});

// ---- AUTH ----
function getPassword() {
  return localStorage.getItem("hv_admin_pass") || DEFAULT_PASSWORD;
}

function isLoggedIn() {
  return sessionStorage.getItem("hv_admin_auth") === "1";
}

function doLogin(e) {
  e.preventDefault();
  const pwd = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");
  if (pwd === getPassword()) {
    sessionStorage.setItem("hv_admin_auth", "1");
    errEl.style.display = "none";
    document.getElementById("login-screen").style.display = "none";
    showPanel();
  } else {
    errEl.style.display = "block";
    document.getElementById("login-password").value = "";
  }
}

function doLogout() {
  sessionStorage.removeItem("hv_admin_auth");
  location.reload();
}

// ---- PANEL SETUP ----
function showPanel() {
  loadConfig();
  loadProducts();
  document.getElementById("admin-panel").style.display = "flex";
  populateForms();
  renderAdminProducts();
  calcSEOScore();
}

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

function saveConfig() {
  localStorage.setItem("hv_config", JSON.stringify(config));
}

function saveProducts() {
  localStorage.setItem("hv_products", JSON.stringify(products));
}

// ---- TABS ----
function switchTab(tab, btn) {
  document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const el = document.getElementById("tab-" + tab);
  if (el) el.style.display = "block";
  if (btn) btn.classList.add("active");
  return false;
}

// ---- POPULATE FORMS ----
function populateForms() {
  setVal("seo-title",         config.seoTitle);
  setVal("seo-desc",          config.seoDesc);
  setVal("seo-keywords",      config.seoKeywords);
  setVal("og-title-input",    config.ogTitle);
  setVal("og-desc-input",     config.ogDesc);
  setVal("og-image-input",    config.ogImage);
  setVal("store-name",        config.storeName || "Só Vendas");
  setVal("store-whatsapp",    config.whatsapp);
  setVal("hero-headline-input", config.heroHeadline);
  setVal("hero-sub-input",    config.heroSub);
  const curr = document.getElementById("store-currency");
  if (curr) curr.value = config.currency;
  updateAllCounters();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val || "";
}

// ---- SEO SAVE ----
function saveSEO() {
  config.seoTitle    = getVal("seo-title");
  config.seoDesc     = getVal("seo-desc");
  config.seoKeywords = getVal("seo-keywords");
  config.ogTitle     = getVal("og-title-input");
  config.ogDesc      = getVal("og-desc-input");
  config.ogImage     = getVal("og-image-input");
  saveConfig();
  calcSEOScore();
  showToast("Configurações SEO guardadas!");
}

function resetSEO() {
  if (!confirm("Repor todas as configurações SEO para os valores padrão?")) return;
  config.seoTitle    = DEFAULT_CONFIG.seoTitle;
  config.seoDesc     = DEFAULT_CONFIG.seoDesc;
  config.seoKeywords = DEFAULT_CONFIG.seoKeywords;
  config.ogTitle     = DEFAULT_CONFIG.ogTitle;
  config.ogDesc      = DEFAULT_CONFIG.ogDesc;
  config.ogImage     = DEFAULT_CONFIG.ogImage;
  saveConfig();
  populateForms();
  calcSEOScore();
  showToast("SEO reposto para os valores padrão.");
}

// ---- STORE SAVE ----
function saveStore() {
  config.storeName     = getVal("store-name") || DEFAULT_CONFIG.storeName;
  config.whatsapp      = getVal("store-whatsapp").replace(/\s+/g, "");
  config.currency      = document.getElementById("store-currency")?.value || "€";
  config.heroHeadline  = getVal("hero-headline-input");
  config.heroSub       = getVal("hero-sub-input");
  saveConfig();
  showToast("Configurações da loja guardadas!");
}

function changePassword() {
  const np = getVal("new-password");
  const cp = getVal("confirm-password");
  if (!np) { showToast("Introduza uma nova senha."); return; }
  if (np !== cp) { showToast("As senhas não coincidem."); return; }
  if (np.length < 6) { showToast("A senha deve ter pelo menos 6 caracteres."); return; }
  localStorage.setItem("hv_admin_pass", np);
  setVal("new-password", "");
  setVal("confirm-password", "");
  showToast("Senha alterada com sucesso!");
}

// ---- SEO SCORE ----
function calcSEOScore() {
  const checks = [
    {
      label: "Título SEO presente",
      ok: config.seoTitle && config.seoTitle.length >= 10,
      weight: 20
    },
    {
      label: `Comprimento do título ideal (${(config.seoTitle||"").length} chars)`,
      ok: config.seoTitle && config.seoTitle.length >= 30 && config.seoTitle.length <= 70,
      warn: config.seoTitle && (config.seoTitle.length < 30 || config.seoTitle.length > 70),
      weight: 15
    },
    {
      label: "Meta descrição presente",
      ok: config.seoDesc && config.seoDesc.length >= 20,
      weight: 20
    },
    {
      label: `Comprimento da descrição ideal (${(config.seoDesc||"").length} chars)`,
      ok: config.seoDesc && config.seoDesc.length >= 100 && config.seoDesc.length <= 170,
      warn: config.seoDesc && (config.seoDesc.length < 100 || config.seoDesc.length > 170),
      weight: 15
    },
    {
      label: "Palavras-chave definidas",
      ok: config.seoKeywords && config.seoKeywords.length > 5,
      weight: 10
    },
    {
      label: "Título OG (redes sociais) definido",
      ok: config.ogTitle && config.ogTitle.length > 5,
      weight: 10
    },
    {
      label: "Imagem OG (partilha social) definida",
      ok: config.ogImage && config.ogImage.startsWith("http"),
      weight: 10
    },
  ];

  let score = 0;
  checks.forEach(c => { if (c.ok) score += c.weight; });

  const circle = document.getElementById("score-circle");
  const scoreVal = document.getElementById("score-value");
  const scoreLabel = document.getElementById("score-label");
  const checksEl = document.getElementById("score-checks");

  if (scoreVal) scoreVal.textContent = score;

  const deg = Math.round(score * 3.6);
  const color = score >= 80 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";
  if (circle) circle.style.background = `conic-gradient(${color} ${deg}deg, #E2E8F0 ${deg}deg)`;

  if (scoreLabel) {
    scoreLabel.textContent = score >= 80 ? "Excelente — SEO bem configurado"
      : score >= 60 ? "Bom — Alguns pontos a melhorar"
      : score >= 40 ? "Regular — Precisa de atenção"
      : "Fraco — Configure os campos em baixo";
  }

  if (checksEl) {
    checksEl.innerHTML = checks.map(c => {
      const cls = c.ok ? "check-ok" : (c.warn ? "check-warn" : "check-fail");
      const icon = c.ok ? "✓" : (c.warn ? "!" : "✗");
      return `<div class="check-row ${cls}"><span>${icon}</span><span>${c.label}</span></div>`;
    }).join("");
  }
}

// ---- PRODUCT MANAGEMENT ----
const CAT_LABELS    = { roupa: "Roupa", sapato: "Sapato", pulseira: "Pulseira" };
const SUBCAT_LABELS = { masculino: "Masculino", feminino: "Feminino", crianca: "Criança" };

function toggleSubcatField() {
  const cat = document.getElementById("modal-category")?.value;
  const field = document.getElementById("subcat-field");
  if (!field) return;
  field.style.display = (cat === "roupa" || cat === "sapato") ? "block" : "none";
}

function renderAdminProducts() {
  const list = document.getElementById("admin-product-list");
  if (!list) return;
  if (!products.length) {
    list.innerHTML = `<p style="color:var(--text-muted);padding:20px 0;">Sem produtos. Clique em "Novo Produto" para adicionar.</p>`;
    return;
  }
  list.innerHTML = products.map(p => `
    <div class="product-list-item">
      ${p.image
        ? `<img src="${p.image}" class="product-list-img" alt="${escHtml(p.name)}" />`
        : `<div class="product-list-emoji">${p.emoji}</div>`}
      <div class="product-list-info">
        <div class="product-list-name">
          ${escHtml(p.name)}
          ${p.available
            ? `<span class="badge-avail">Disponível</span>`
            : `<span class="badge-unavail">Indisponível</span>`}
        </div>
        <div class="product-list-meta">
          ${CAT_LABELS[p.category] || p.category}${p.subcategory ? ` › ${SUBCAT_LABELS[p.subcategory] || p.subcategory}` : ""}
          · ${escHtml(p.desc)}
        </div>
      </div>
      <div class="product-list-price">€${p.price.toFixed(2).replace(".",",")}</div>
      <div class="product-list-actions">
        <button class="btn btn-secondary" onclick="openProductModal(${p.id})">Editar</button>
        <button class="btn btn-danger" onclick="deleteProduct(${p.id})">Apagar</button>
      </div>
    </div>
  `).join("");
}

let editingId = null;
let currentImageBase64 = null;

function openProductModal(id) {
  editingId = id || null;
  currentImageBase64 = null;

  const modal   = document.getElementById("product-modal");
  const overlay = document.getElementById("product-modal-overlay");
  const title   = document.getElementById("modal-title");

  if (id) {
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    title.textContent = "Editar Produto";
    setVal("modal-name",  p.name);
    setVal("modal-desc",  p.desc);
    setVal("modal-price", p.price);
    setVal("modal-emoji", p.emoji);
    const catEl = document.getElementById("modal-category");
    if (catEl) catEl.value = p.category;
    toggleSubcatField();
    const subcatEl = document.getElementById("modal-subcategory");
    if (subcatEl) subcatEl.value = p.subcategory || "masculino";
    const availEl = document.getElementById("modal-available");
    if (availEl) availEl.value = String(p.available);
    currentImageBase64 = p.image || null;
    setImagePreview(p.image || null);
  } else {
    title.textContent = "Novo Produto";
    setVal("modal-name",  "");
    setVal("modal-desc",  "");
    setVal("modal-price", "");
    setVal("modal-emoji", "📦");
    const catEl = document.getElementById("modal-category");
    if (catEl) catEl.value = "roupa";
    toggleSubcatField();
    const subcatEl = document.getElementById("modal-subcategory");
    if (subcatEl) subcatEl.value = "masculino";
    const availEl = document.getElementById("modal-available");
    if (availEl) availEl.value = "true";
    setImagePreview(null);
  }

  // Reset file input
  const fileEl = document.getElementById("modal-img-file");
  if (fileEl) fileEl.value = "";

  if (overlay) overlay.style.display = "block";
  if (modal)   modal.style.display   = "flex";
}

function setImagePreview(src) {
  const thumb   = document.getElementById("img-preview-thumb");
  const area    = document.getElementById("img-upload-preview");
  const removeBtn = document.getElementById("img-remove-btn");
  if (!thumb || !area) return;
  if (src) {
    thumb.src = src;
    thumb.style.display = "block";
    area.style.display  = "none";
    if (removeBtn) removeBtn.style.display = "inline-flex";
  } else {
    thumb.style.display = "none";
    area.style.display  = "flex";
    if (removeBtn) removeBtn.style.display = "none";
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast("Imagem demasiado grande. Máximo 2MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    currentImageBase64 = e.target.result;
    setImagePreview(currentImageBase64);
  };
  reader.readAsDataURL(file);
}

function removeProductImage() {
  currentImageBase64 = null;
  const fileEl = document.getElementById("modal-img-file");
  if (fileEl) fileEl.value = "";
  setImagePreview(null);
}

function closeProductModal() {
  document.getElementById("product-modal").style.display = "none";
  document.getElementById("product-modal-overlay").style.display = "none";
  editingId = null;
}

function saveProduct() {
  const name  = getVal("modal-name").trim();
  const desc  = getVal("modal-desc").trim();
  const price = parseFloat(getVal("modal-price"));
  const emoji = getVal("modal-emoji").trim() || "📦";
  const cat    = document.getElementById("modal-category")?.value || "roupa";
  const hasSubcat = cat === "roupa" || cat === "sapato";
  const subcat = hasSubcat ? (document.getElementById("modal-subcategory")?.value || "masculino") : null;
  const avail  = document.getElementById("modal-available")?.value === "true";

  if (!name) { showToast("O nome é obrigatório."); return; }
  if (isNaN(price) || price < 0) { showToast("Preço inválido."); return; }

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx >= 0) {
      products[idx] = { ...products[idx], name, desc, price, emoji, category: cat, subcategory: subcat, available: avail, image: currentImageBase64 || products[idx].image || null };
    }
    showToast(`"${name}" actualizado.`);
  } else {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, desc, price, emoji, category: cat, subcategory: subcat, available: avail, image: currentImageBase64 || null });
    showToast(`"${name}" adicionado ao catálogo.`);
  }

  saveProducts();
  renderAdminProducts();
  closeProductModal();
}

function deleteProduct(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  if (!confirm(`Apagar "${p.name}" do catálogo? Esta acção não pode ser desfeita.`)) return;
  products = products.filter(pr => pr.id !== id);
  saveProducts();
  renderAdminProducts();
  showToast(`"${p.name}" removido.`);
}

// ---- CHAR COUNTERS ----
function setupCharCounters() {
  watchCounter("seo-title", "seo-title-count");
  watchCounter("seo-desc", "seo-desc-count");
}

function watchCounter(inputId, counterId) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  if (!input || !counter) return;
  const update = () => { counter.textContent = input.value.length; };
  input.addEventListener("input", update);
  update();
}

function updateAllCounters() {
  const seoTitle = document.getElementById("seo-title");
  const seoTitleCount = document.getElementById("seo-title-count");
  if (seoTitle && seoTitleCount) seoTitleCount.textContent = seoTitle.value.length;
  const seoDesc = document.getElementById("seo-desc");
  const seoDescCount = document.getElementById("seo-desc-count");
  if (seoDesc && seoDescCount) seoDescCount.textContent = seoDesc.value.length;
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById("admin-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ---- UTILS ----
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
