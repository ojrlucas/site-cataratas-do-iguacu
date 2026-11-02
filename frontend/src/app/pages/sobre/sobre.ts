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
      <section class="comprar-ingresso mt-4">
        <a class="text-uppercase text-decoration-none color-white fw-bold" routerLink="/ingressos">COMPRAR INGRESSO</a>
      </section>
    </div>

    <div class="conteudo d-flex justify-content-center flex-wrap">
      <section class="subtitulo mt-4 mb-4 texto-pagina">
        <h2 class="text-uppercase">o <span class="azul fw-bold">parque...</span></h2>
        <p class="mt-3">O Parque Nacional do Iguaçu, localizado no oeste do Paraná, na fronteira com a Argentina, protege uma das maiores áreas remanescentes de Mata Atlântica do Brasil. Criado em 1939, foi reconhecido pela UNESCO como Patrimônio Mundial Natural em 1986.</p>
        <p>É lá que ficam as Cataratas do Iguaçu: um conjunto de cerca de 275 quedas d'água que se estendem por quase três quilômetros, culminando na impressionante Garganta do Diabo. O rugido das águas, a névoa constante e os arco-íris que se formam sob o sol fazem do local uma das maiores maravilhas naturais do planeta.</p>
        <img class="sobre-img my-3" src="imagens/cataratas-3.png" alt="Vista das Cataratas do Iguaçu" />
        <p>Além das quedas, o parque abriga uma biodiversidade riquíssima, com onças-pintadas, antas, quatis, tucanos e milhares de espécies de plantas e borboletas. Trilhas, passarelas, mirantes e passeios de barco e bike permitem conhecer a natureza de perto, com segurança e respeito ao meio ambiente.</p>
        <p>Quer saber o que fazer por lá? Veja as opções de <a class="azul fw-bold" routerLink="/lazer">lazer</a> e garanta seu <a class="azul fw-bold" routerLink="/ingressos">ingresso</a>.</p>
        <img class="sobre-img my-3" src="imagens/cataratas-4.png" alt="Paisagem do Parque Nacional do Iguaçu" />
      </section>
    </div>
  `,
})
export class Sobre {}
