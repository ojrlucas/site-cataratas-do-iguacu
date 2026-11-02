import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.html',
})
export class Toasts {
  toast = inject(Toast);
}
