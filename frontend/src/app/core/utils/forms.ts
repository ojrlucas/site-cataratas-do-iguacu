import { AbstractControl } from '@angular/forms';

export const campoInvalido = (controle: AbstractControl): boolean =>
  controle.invalid && (controle.touched || controle.dirty);
