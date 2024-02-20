import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MessengerService } from '../../pages/messenger.service';
import { PipesModule } from '../../../pipes/pipes.module';
import Swal from 'sweetalert2';
import { Messenger } from '../../models/messenger.model';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-new-edit-messenger',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, PipesModule, ReactiveFormsModule],
  templateUrl: './new-edit-messenger.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewEditMessengerComponent {

  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  
  private messengerService = inject(MessengerService);

  public action: string = '';

  public form: FormGroup = this.fb.group({
    id: [null],
    identification: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });


  constructor(
    public dialogRef: MatDialogRef<NewEditMessengerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { action, messenger } = obj;

   if (messenger) {
    this.form.setValue(messenger);
   }
    

    this.action = action;

  }

  getFormErrors() {
    const errores: { [key: string]: any } = {};

    // Recorrer todos los controles del formulario
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      // Obtener los errores del control si existen
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });

    return errores;
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  onSave() {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const errors = this.getFormErrors();
      const errorProperties = [];

      for (const property in errors) {
        errorProperties.push(property);
      }

      Swal.fire(
        'Error de validación',
        `Campos: ${errorProperties.join(', ')}`,
        'error'
      );

      console.log(errors);

      return;
    }

    const messenger: Messenger = this.form.value;

    this.messengerService.saveMessenger(messenger).subscribe((resp: any) => {

      if (resp) {
        Swal.fire('Transacción exitosa.','Mensagero registrado satisfactoriamente.','success');

        this.closeDialog();
      }
      
    });

  }

  closeDialog(): void {
  
    this.dialogRef.close();
  }
}
