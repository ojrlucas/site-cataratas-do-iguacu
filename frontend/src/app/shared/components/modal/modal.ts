import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
})
export class Modal {
  rotulo = input('Janela');
  largo = input(false);
  fechar = output<void>();

  @HostListener('document:keydown.escape')
  aoPressionarEscape() {
    this.fechar.emit();
  }
}
