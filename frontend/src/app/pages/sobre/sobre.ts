import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre',
  imports: [RouterLink],
  template: `
    <div class="bg-titulo d-flex justify-content-center align-items-center flex-column color-white">
      <section class="titulo">
        <h1 class="text-center text-uppercase">
          <span class="titulo-esquerda fw-normal d-block text-uppercase">parque</span>
          nacional do Iguaçu
          <span class="titulo-direita fw-normal d-block text-uppercase">patrimônio mundial natural</span>
        </h1>
      </section>
    </div>

    <section class="pagina" style="max-width: 860px">
      <p class="eyebrow">Conheça</p>
      <h2 class="secao-titulo">o <b>parque...</b></h2>

      <div class="aviso-fa mb-4">
        <i class="bi bi-heart-fill"></i>
        <strong>Homenagem de um fã.</strong> Este site é um projeto de portfólio criado para homenagear as Cataratas do Iguaçu. Ele não é o site oficial, não representa o Parque Nacional do Iguaçu e não realiza vendas reais: ingressos, valores e e-mails são fictícios.
      </div>

      <div class="painel">
        <p>O Parque Nacional do Iguaçu, localizado no oeste do Paraná, na fronteira com a Argentina, protege uma das maiores áreas remanescentes de Mata Atlântica do Brasil. Criado em 1939, foi reconhecido pela UNESCO como Patrimônio Mundial Natural em 1986.</p>
        <p>É lá que ficam as Cataratas do Iguaçu: um conjunto de cerca de 275 quedas d'água que se estendem por quase três quilômetros, culminando na impressionante Garganta do Diabo. O rugido das águas, a névoa constante e os arco-íris que se formam sob o sol fazem do local uma das maiores maravilhas naturais do planeta.</p>
        <img src="imagens/cataratas-3.png" alt="Vista das Cataratas do Iguaçu" style="width: 100%; max-width: 420px" />
        <p>Além das quedas, o parque abriga uma biodiversidade riquíssima, com onças-pintadas, antas, quatis, tucanos e milhares de espécies de plantas e borboletas. Trilhas, passarelas, mirantes e passeios de barco e bike permitem conhecer a natureza de perto, com segurança e respeito ao meio ambiente.</p>
        <img src="imagens/cataratas-4.png" alt="Paisagem do Parque Nacional do Iguaçu" />
        <div class="d-flex gap-2 flex-wrap justify-content-center">
          <a class="btn-cpi" routerLink="/lazer">Ver opções de lazer</a>
          <a class="btn-cpi verde" routerLink="/ingressos">Ver ingressos</a>
        </div>
      </div>
    </section>
  `,
})
export class Sobre {}
