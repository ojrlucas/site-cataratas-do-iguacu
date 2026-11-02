import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PedidoQr } from '../../../../core/models/api.models';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-comprovante-modal',
  imports: [DatePipe, Modal],
  templateUrl: './comprovante-modal.html',
})
export class ComprovanteModal {
  pedido = input.required<PedidoQr>();
  fechar = output<void>();
  reenviar = output<number>();
}
