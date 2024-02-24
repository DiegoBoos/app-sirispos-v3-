import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ValidatorsService } from '@shared/services/validators.service';
import Swal from 'sweetalert2';
import { MessengerEvent } from '../../models/messenger-event.model';
import { MessengerService } from '../../pages/messenger.service';
import { PipesModule } from '../../../pipes/pipes.module';
import { Messenger } from '../../models/messenger.model';

import { Cliente } from '../../../customers/models/cliente-model';
import { InvoiceEvent } from '../../models/invoice-event.model';
import { Tercero } from '../../../customers/models/tercero.model';
import { Pedido } from '../../../pedidos/interfaces/pedido.interface';

@Component({
  selector: 'app-new-edit-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-edit-event.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewEditEventComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  private messengerService = inject(MessengerService);

  public action: string = '';
  private messenger: Messenger = new Messenger();

  public invoiceNumber: string = '';

  public invoicesEvent = signal<InvoiceEvent[]>([]);

  // public formInvoices!: FormGroup;

  public form: FormGroup = this.fb.group({
    id: [null],
    messengerId: null,
    concept: ['', [Validators.required]],
    startDate: null,
    endDate: null,
    observation: '',
    invoicesEvent: []
  });

  constructor(
    public dialogRef: MatDialogRef<NewEditEventComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { action, messenger, messengerEvent } = obj;

    if (messengerEvent) {
      
      const messengerEventObj: MessengerEvent = messengerEvent;

      messengerEventObj.invoicesEvent?.map( i => {
        const { pedido } = i;
        
        const { cliente, pedidoId, feHdr } = pedido!;
          const invoiceEvent: InvoiceEvent = {
              pedidoId,
              invoiceNumber: feHdr?.numeroFactura,
              cliente,
            };
          this.invoicesEvent.update((arr: InvoiceEvent[]) => {
            arr.push(invoiceEvent);
            return arr.slice(0);
          });
      })
      
      this.form.setValue(messengerEvent);

    }

    if (messenger) {
      this.messenger = messenger;
    }

    this.action = action;

    // this.creatForm();
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

  isValidFieldFormArray(form: any, field: string) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldErrorFormArray(form: any, field: string) {
    return this.validatorsService.getFieldError(form, field);
  }

  verifyInvoiceRegistered(): boolean {
    const index = this.invoicesEvent().findIndex(i=>i.invoiceNumber===this.invoiceNumber);
    return index<0? false: true;
  }

  addInvoice() {
    if (this.invoiceNumber.trim() !== '') {
      if (!this.verifyInvoiceRegistered()) {
        this.messengerService.getInvoice(this.invoiceNumber).subscribe((resp: Pedido) => {
          const { cliente, pedidoId, feHdr } = resp;
          const invoiceEvent: InvoiceEvent = {
              pedidoId,
              invoiceNumber: feHdr?.numeroFactura,
              cliente,
            };
          this.invoicesEvent.update((arr: InvoiceEvent[]) => {
            arr.push(invoiceEvent);
            return arr.slice(0);
          });
        });
      }
    }
    this.invoiceNumber = '';
  }

  removeInvoice(invoice: InvoiceEvent) {
    const index = this.invoicesEvent().findIndex(
      (i) => i.pedidoId === invoice.pedidoId
    );
    this.invoicesEvent.update((arr: InvoiceEvent[]) => {
      arr.splice(index, 1);
      return arr.slice(0);
    });
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

    const messengerEvent: MessengerEvent = this.form.value;
    messengerEvent.messengerId = this.messenger.id;

    messengerEvent.invoicesEvent = this.invoicesEvent();

    this.messengerService
      .saveMessengerEvent(messengerEvent)
      .subscribe((resp: any) => {
        if (resp) {
          Swal.fire(
            'Transacción exitosa.',
            'Evento registrado satisfactoriamente.',
            'success'
          );

          this.closeDialog('save');
        }
      });
  }

  closeDialog(action: string): void {
    this.dialogRef.close({ action });
  }

  registerEndEvent(): void {
    const messengerEvent: MessengerEvent = this.form.value;

    messengerEvent.invoicesEvent = this.invoicesEvent();

    this.messengerService
      .saveEndEvent(messengerEvent)
      .subscribe((resp: any) => {
        if (resp) {
          Swal.fire(
            'Transacción exitosa.',
            'Evento cerrado satisfactoriamente.',
            'success'
          );

          this.closeDialog('save');
        }
      });
  }
}
