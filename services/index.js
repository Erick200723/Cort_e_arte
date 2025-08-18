
function direct(){
    window.location.href = "podutos.html";
}

function scrollToTop(event) {
    event.preventDefault();
    const target = document.querySelector('#topo');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}a