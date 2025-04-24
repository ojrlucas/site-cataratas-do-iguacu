var clicks = null

function navLinks() {
    clicks = (clicks == true) ? false : true
    const abreListaLinks = document.getElementById('nav-links-lista')
    
    if (clicks) {
        abreListaLinks.style.display = 'block'

    } else {
        abreListaLinks.style.display = 'none'

    }   
}

async function loadHeaderFooter() {
    const headerResponse = await fetch('nav-menu.html');
    const footerResponse = await fetch('footer.html');
    const headerHtml = await headerResponse.text();
    const footerHtml = await footerResponse.text();
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
    document.body.insertAdjacentHTML('beforeend', footerHtml);
}
loadHeaderFooter();