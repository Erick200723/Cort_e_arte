// Filtro de produtos
document.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.getElementById('filterInput');
    const productCards = document.querySelectorAll('.product-card');
    
    filterInput.addEventListener('input', function() {
        const filterText = this.value.toLowerCase().trim();
        
        // Filtra os produtos
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
        
        // Verifica se há resultados
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

function redirect(){
    window.location.href = "contato.html"
}

document.addEventListener('DOMContentLoaded', () => {
  const filterInput = document.getElementById('filterInput');
  const productCards = document.querySelectorAll('.product-card');
  const mainImage = document.getElementById('mainImage');
  const thumbnailContainer = document.getElementById('thumbnailContainer');

  // ================= MODAL =================
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      let images = [];
      try {
        images = JSON.parse(card.getAttribute('data-images'));
      } catch(e) {
        console.error('Erro ao ler data-images:', e);
        return;
      }
      if (!images || images.length === 0) return;

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

      const productModal = new bootstrap.Modal(document.getElementById('productModal'));
      productModal.show();
    });
  });
});

// ================= REDIRECIONAMENTO =================
function trasition(url) {
  window.location.href = url;
}
