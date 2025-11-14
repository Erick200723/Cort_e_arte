function trasition(url){
    document.body.classList.add('fade-out')
    setTimeout(()=>{
        window.location.href = url
    }, 500)
}