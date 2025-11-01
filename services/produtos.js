// services/produtos.js
const API_URL = 'http://localhost:3000/api';

// ================= VARIÁVEIS GLOBAIS =================
let allProducts = []; // Armazena todos os produtos da API
let currentProduct = { title: '', price: 0 };

// ================= CONEXÃO COM API (SEM ALTERAR LÓGICA EXISTENTE) =================
async function initializeAPI() {
  try {
    console.log('🚀 Iniciando conexão com API...');
    
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    allProducts = await response.json();
    console.log('✅ Produtos carregados da API:', allProducts.length, 'produtos');
    
    // Atualiza os preços dinamicamente mantendo toda a lógica existente
    syncPricesWithAPI();
    
  } catch (error) {
    console.log('ℹ️ API não disponível, usando dados locais:', error.message);
    // Não quebra o site, continua com dados locais
  }
}

// ================= SINCRONIZA PREÇOS COM API (MANTÉM LÓGICA EXISTENTE) =================
function syncPricesWithAPI() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const titleElement = card.querySelector('.product-title');
    const priceElement = card.querySelector('.product-price');
    
    if (titleElement && priceElement) {
      const productName = titleElement.textContent.trim();
      
      // Encontra produto correspondente na API (busca inteligente)
      const apiProduct = allProducts.find(p => 
        productName.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(productName.toLowerCase()) ||
        findSimilarProduct(productName, p.name)
      );
      
      if (apiProduct) {
        // Atualiza APENAS o preço mantendo todo o resto
        const originalPrice = priceElement.textContent;
        priceElement.textContent = `R$ ${apiProduct.price.toFixed(2).replace('.', ',')}`;
        
        // Atualiza data-images se existir na API
        if (apiProduct.images && apiProduct.images.length > 0) {
          card.setAttribute('data-images', JSON.stringify(apiProduct.images));
        }
        
        console.log(`💰 Preço atualizado: ${productName} - ${originalPrice} → ${priceElement.textContent}`);
      }
    }
  });
}

// Função auxiliar para encontrar produtos similares
function findSimilarProduct(frontendName, apiName) {
  const frontendWords = frontendName.toLowerCase().split(' ');
  const apiWords = apiName.toLowerCase().split(' ');
  
  return frontendWords.some(word => 
    word.length > 3 && apiWords.includes(word)
  );
}

// ================= LÓGICA ORIGINAL DO FRONTEND (MANTIDA INTACTA) =================

// ================= FILTRO DE PRODUTOS =================
document.addEventListener('DOMContentLoaded', function() {
  const filterInput = document.getElementById('filterInput');
  const productCards = document.querySelectorAll('.product-card');

  filterInput.addEventListener('input', function() {
    const filterText = this.value.toLowerCase().trim();

    productCards.forEach(card => {
      const title = card.querySelector('.product-title').textContent.toLowerCase();
      const description = card.querySelector('.product-description').textContent.toLowerCase();
      const category = card.getAttribute('data-category');

      if (title.includes(filterText) || description.includes(filterText) || category.includes(filterText)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    const visibleCards = document.querySelectorAll('.product-card[style="display: flex"]');
    let noResults = document.querySelector('.no-results');

    if (visibleCards.length === 0 && filterText !== '') {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = '<h3>Nenhum produto encontrado</h3><p>Tente usar outros termos de busca.</p>';
        document.getElementById('productsGrid').appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });
});

// ================= REDIRECIONAMENTO =================
function trasition(url) {
  window.location.href = url;
}

// ================= MODAL =================
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card');
  const mainImage = document.getElementById('mainImage');
  const thumbnailContainer = document.getElementById('thumbnailContainer');
  const quantityInput = document.getElementById('quantityInput');
  const unitPriceEl = document.getElementById('unitPrice');
  const totalPriceEl = document.getElementById('totalPrice');
  const paymentMethod = document.getElementById('paymentMethod');
  const btnSolicitar = document.getElementById('btnSolicitar');

  // Abrir modal ao clicar no card (LÓGICA ORIGINAL)
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      let images = [];
      try {
        images = JSON.parse(card.getAttribute('data-images'));
      } catch (e) {
        console.error('Erro ao ler data-images:', e);
        return;
      }
      if (!images || images.length === 0) return;

      // Atualizar imagens
      mainImage.src = images[0];
      thumbnailContainer.innerHTML = '';
      images.forEach(src => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.add('thumbnail');
        thumb.style.width = '100px';
        thumb.style.cursor = 'pointer';
        thumb.addEventListener('click', () => {
          mainImage.src = src;
        });
        thumbnailContainer.appendChild(thumb);
      });

      // Guardar dados do produto (LÓGICA ORIGINAL)
      currentProduct.title = card.querySelector('.product-title').innerText;
      currentProduct.price = parseFloat(
        card.querySelector('.product-price').innerText.replace('R$ ', '').replace(',', '.')
      );

      const modalTitle = document.getElementById('productModalLabel');
      modalTitle.innerText = currentProduct.title;

      // Manter as imagens do modal responsivas
      mainImage.style.maxWidth = '100%';
      mainImage.style.height = 'auto';

      // Resetar quantidade, pagamento e preços
      quantityInput.value = 1; // Mudei para 1 em vez de 0
      paymentMethod.value = "pix";
      updateTotal();

      const productModal = new bootstrap.Modal(document.getElementById('productModal'));
      productModal.show();
    });
  });

  // ================= FUNÇÃO PARA ATUALIZAR TOTAL =================
  function updateTotal() {
    let quantity = parseInt(quantityInput.value);
    if (quantity < 1) quantity = 1;
    if (isNaN(quantity)) quantity = 1;
    if (quantity > 10) quantity = 10;
    quantityInput.value = quantity;

    let total = currentProduct.price * quantity;

    // Ajuste por pagamento
    const method = paymentMethod.value;
    if (method === "card2") total += 10 * 2; // 2 parcelas
    if (method === "card3") total += 10 * 3; // 3 parcelas

    unitPriceEl.textContent = `R$ ${currentProduct.price.toFixed(2).replace('.', ',')}`;
    totalPriceEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // ================= EVENTOS =================
  quantityInput.addEventListener('input', updateTotal);
  paymentMethod.addEventListener('change', updateTotal);

  // ================= SOLICITAR VIA WHATSAPP (LÓGICA ORIGINAL) =================
  btnSolicitar.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value) || 1;
    let total = currentProduct.price * quantity;

    // Ajuste por pagamento
    const method = paymentMethod.value;
    let paymentText = "Pix - à vista";
    if (method === "card1") paymentText = "Cartão - 1x";
    if (method === "card2") { total += 10 * 2; paymentText = "Cartão - 2x"; }
    if (method === "card3") { total += 10 * 3; paymentText = "Cartão - 3x"; }

    const number = '558398874651';
    const mensagem = `Olá, tenho interesse no produto: ${currentProduct.title}\nQuantidade: ${quantity}\nForma de pagamento: ${paymentText}\nValor total: R$ ${total.toFixed(2).replace('.', ',')}`;
    const link = `https://wa.me/${number}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  });
});

// ================= INICIALIZAÇÃO =================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎨 Frontend Cor e Arte carregado!');
  
  // Inicializa a API em segundo plano (não bloqueia o carregamento)
  setTimeout(() => {
    initializeAPI();
  }, 1000);
  
  // Sua lógica original de transição continua funcionando
  const body = document.querySelector('body');
  if (body) {
    body.classList.remove('fade-out');
  }
});