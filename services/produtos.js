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

  let currentProduct = { title: '', price: 0 };

  // Abrir modal ao clicar no card
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

      // Guardar dados do produto
      currentProduct.title = card.querySelector('.product-title').innerText;
      currentProduct.price = parseFloat(
        card.querySelector('.product-price').innerText.replace('R$ ', '').replace(',', '.')
      );

      const modalTitle = document.getElementById('productModalLabel');
      modalTitle.innerText = currentProduct.title;


      // Resetar quantidade, pagamento e preços
      quantityInput.value = 1;
      paymentMethod.value = "pix";
      updateTotal();

      const productModal = new bootstrap.Modal(document.getElementById('productModal'));
      productModal.show();
    });
  });

  // ================= FUNÇÃO PARA ATUALIZAR TOTAL =================
  function updateTotal() {
    let quantity = parseInt(quantityInput.value) || 1;
    if (quantity < 1) quantity = 1;
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

  // ================= SOLICITAR VIA WHATSAPP =================
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
