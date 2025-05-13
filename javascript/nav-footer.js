function exibirDiv(id) {
    const divAExibir = document.getElementById(id)
    const style = (id === 'nav-links-lista') ? 'block' : 'flex'
    divAExibir.style.display = (divAExibir.style.display === 'none') ? style : 'none'
}

function exibirCard(cardClass) {
    const cardAExibir = document.getElementsByClassName(cardClass)[0];
    const botaoLer = cardAExibir.querySelector('a');

    if (cardAExibir.classList.contains('card-exibido')) {
        cardAExibir.classList.remove('card-exibido');
        botaoLer.innerHTML = 'Ler mais';
    } else {
        cardAExibir.classList.add('card-exibido');
        botaoLer.innerHTML = 'Ler menos';
    }
}

async function carregamentoDinamico() {
    try {
        const [headerResponse, footerResponse, divsInfoResponse] = await Promise.all([
            fetch('carregamento-dinamico/nav-menu.html'),
            fetch('carregamento-dinamico/footer.html'),
            fetch('carregamento-dinamico/divs-info-home.html')

        ])

        if (!headerResponse.ok || !footerResponse.ok || !divsInfoResponse.ok)
            throw new Error('Erro ao carregar um ou mais arquivos HTML')

        const [headerHtml, footerHtml, divsInfoHtml] = await Promise.all([
            headerResponse.text(),
            footerResponse.text(),
            divsInfoResponse.text()
        ])

        document.body.insertAdjacentHTML('afterbegin', headerHtml)
        document.body.insertAdjacentHTML('beforeend', footerHtml)
        document.body.insertAdjacentHTML('beforeend', divsInfoHtml)

    } catch (error) {
        console.error('Falha ao carregar componentes da página:', error)
        const errorMessage = `<div style="color:red;text-align:center;margin:20px;">Erro ao carregar partes da página. Tente novamente mais tarde.</div>`
        document.body.insertAdjacentHTML('beforeend', errorMessage)
    }
}

carregamentoDinamico()
   