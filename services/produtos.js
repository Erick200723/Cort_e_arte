// Filtro de produtos
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