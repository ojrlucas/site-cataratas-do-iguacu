var clicks = null

function navLinksSuperior() {
    clicks = (clicks == true) ? false : true
    const abreListaLinks = document.getElementById('lista-links-superior')
    
    if (clicks) {
        abreListaLinks.style.display = 'flex'

    } else {
        abreListaLinks.style.display = 'none'

    }   
}