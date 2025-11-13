// const API_URL = 'https://sitemcor-arte.onrender.com/api';
const API_URL = 'http://localhost:3000/api';

// ================= VARIÁVEIS GLOBAIS =================
let allProducts = []; // Produtos vindos da API
let currentProduct = { title: '', price: 0, img: '' };

// ================= INICIALIZAÇÃO =================
document.addEventListener('DOMContentLoaded', () => {
  initializeAPI();
});

// Small debounce helper
function debounce(fn, wait = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// ================= CONEXÃO COM API =================
async function initializeAPI() {
  try {
    console.log('🚀 Conectando à API...', `${API_URL}/products`);

    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    // backend às vezes retorna array ou { products: [...] }
    const json = await response.json();
    allProducts = Array.isArray(json) ? json : (json.products || []);

    console.log('✅ Produtos carregados:', allProducts);
    
    if (allProducts.length === 0) {
      console.warn('⚠️ Nenhum produto encontrado na API');
    }

    renderProductsFromAPI(allProducts);
    syncPricesWithAPI();
    
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error.message);
    
    // Mostra erro para o usuário
    const grid = document.getElementById('productsGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-message">
          <p>❌ Erro ao carregar produtos: ${error.message}</p>
          <button onclick="initializeAPI()" class="btn-retry">🔄 Tentar Novamente</button>
        </div>
      `;
    }
  }
}
// ================= FILTRO =================
// filtra a lista allProducts e re-renderiza
function filterProductsByName(query) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) {
    renderProductsFromAPI(allProducts);
    return;
  }

  const filtered = allProducts.filter(p => {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });

  renderProductsFromAPI(filtered);
}

// ligar o input do filtro (debounced)
const filterEl = document.getElementById('filterInput');
if (filterEl) {
  filterEl.addEventListener('input', debounce((e) => {
    filterProductsByName(e.target.value);
  }, 200));
}


// ================= SINCRONIZAÇÃO DE PREÇOS =================
function syncPricesWithAPI() {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const titleEl = card.querySelector('.product-title');
    const priceEl = card.querySelector('.product-price');
    const descEl = card.querySelector('.product-description');
    const imgEl = card.querySelector('img');

    if (!titleEl || !priceEl) return;

    const localName = titleEl.textContent.trim().toLowerCase();

    const apiProduct = allProducts.find(p => {
      const apiName = p.name.toLowerCase();
      return (
        apiName === localName ||
        apiName.includes(localName) ||
        localName.includes(apiName)
      );
    });

    if (apiProduct) {
      const newPrice = apiProduct.price
        ? `R$ ${parseFloat(apiProduct.price).toFixed(2).replace('.', ',')}`
        : priceEl.textContent;

      priceEl.textContent = newPrice;

      if (descEl && apiProduct.description) {
        descEl.textContent = apiProduct.description;
      }

      if (imgEl && apiProduct.img) {
        imgEl.src = `${API_URL.replace('/api', '')}/uploads/${apiProduct.img}`;
      }


      // 🔗 Guardar info no dataset do card
      card.dataset.apiId = apiProduct.id;
      card.dataset.price = apiProduct.price;
      card.dataset.name = apiProduct.name;
      card.dataset.description = apiProduct.description || '';
      card.dataset.img = apiProduct.img || '';
    }

    // 🔥 Adiciona evento de clique para abrir o modal
    card.addEventListener('click', () => openProductModal(card));
  });

  console.log('🔄 Sincronização concluída!');
}

function renderProductsFromAPI(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Limpa duplicados se já existirem
  const apiCards = grid.querySelectorAll('.api-product-card');
  apiCards.forEach(c => c.remove());

  products.forEach(p => {
    // Cria elemento do card
    const card = document.createElement('div');
    card.className = 'product-card api-product-card';
    card.dataset.category = p.category || '';
    
    // ✅ CORREÇÃO AQUI - Imagens vêm direto do Cloudinary
    const imageUrl = p.img 
      ? p.img // Cloudinary já retorna URL completa
      : `${API_URL.replace('/api', '')}/uploads/default.png`; // Fallback

    card.innerHTML = `
      <div class="product-image">
        <img src="${imageUrl}" alt="${p.name}" onerror="this.src='${API_URL.replace('/api', '')}/uploads/default.png'">
      </div>
      <div class="product-content">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-description">${p.description || ''}</p>
        <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
        <button class="btn-product" onclick="solicitarProduto()">Solicitar Orçamento</button>
      </div>
    `;

    // 🔗 Guardar info no dataset do card
    card.dataset.apiId = p.id;
    card.dataset.price = p.price;
    card.dataset.name = p.name;
    card.dataset.description = p.description || '';
    card.dataset.img = p.img || '';

    grid.appendChild(card);
  });

  console.log(`🧩 ${products.length} produtos renderizados da API!`);
}
// ================= MODAL =================
function openProductModal(card) {
  const modalEl = document.getElementById('productModal');
  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);

  const title = card.dataset.name || 'Produto';
  const price = parseFloat(card.dataset.price || 0);
  const img = card.dataset.img || '';
  const desc = card.dataset.description || '';

  // Atualiza os elementos do modal
  const modalTitle = modalEl.querySelector('#modalProductName');
  const modalPrice = modalEl.querySelector('#unitPrice');
  const modalImg = modalEl.querySelector('#modalProductImage');
  const modalDesc = modalEl.querySelector('#modalProductDescription');

  if (modalTitle) modalTitle.textContent = title;
  if (modalPrice) modalPrice.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
  if (modalDesc) modalDesc.textContent = desc;
  
  // ✅ CORREÇÃO AQUI - Imagem direto do Cloudinary
  if (modalImg) {
    if (img) {
      modalImg.src = img; // URL direta do Cloudinary
    } else {
      modalImg.src = './imgs/default.png'; // Fallback local
    }
  }

  // Salva o produto atual
  currentProduct = { title, price, img };

  // Zera quantidade e total
  const quantityInput = document.getElementById('quantityInput');
  const totalPriceSpan = document.getElementById('totalPrice');
  if (quantityInput) quantityInput.value = 1;
  if (totalPriceSpan) totalPriceSpan.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;

  modal.show();
}
// ================= WHATSAPP =================
const btnSolicitar = document.getElementById('btnSolicitar');
if (btnSolicitar) {
  btnSolicitar.addEventListener('click', () => {
    const productName = currentProduct.title || 'Produto';
    const total = totalPriceSpan.textContent;
    const quantity = quantityInput.value;

    const msg = `Olá! Gostaria de solicitar o orçamento do produto *${productName}*.\nQuantidade: ${quantity}\nTotal estimado: ${total}`;
    const whatsappURL = `https://wa.me/558398874651?text=${encodeURIComponent(msg)}`;

    window.open(whatsappURL, '_blank');
  });
}
