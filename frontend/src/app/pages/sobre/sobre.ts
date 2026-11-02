import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroParque } from '../../shared/components/hero-parque/hero-parque';

@Component({
  selector: 'app-sobre',
  imports: [RouterLink, HeroParque],
  templateUrl: './sobre.html',
})
export class Sobre {}
