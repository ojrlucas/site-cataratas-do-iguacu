import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-fundo" (click)="fechar.emit()" role="dialog" aria-modal="true" [attr.aria-label]="rotulo()">
      <div class="modal-cartao" [class.largo]="largo()" (click)="$event.stopPropagation()">
        <button class="modal-fechar" type="button" (click)="fechar.emit()" aria-label="Fechar"><i class="bi bi-x-lg"></i></button>
        <ng-content />
      </div>
    </div>
  `,
})
export class Modal {
  rotulo = input('Janela');
  largo = input(false);
  fechar = output<void>();

  @HostListener('document:keydown.escape')
  aoEscape() {
    this.fechar.emit();
  }
}
