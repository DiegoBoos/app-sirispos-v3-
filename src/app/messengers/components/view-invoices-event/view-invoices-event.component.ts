import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InvoiceEvent } from '../../models/invoice-event.model';

@Component({
  selector: 'app-view-invoices-event',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './view-invoices-event.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewInvoicesEventComponent {
  public invoices = signal<InvoiceEvent[]>([]);

  constructor(
    public dialogRef: MatDialogRef<ViewInvoicesEventComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { invoices } = obj;

    if (invoices) {

      invoices.map((i: any)=>{

        const { pedido } = i;

        const invoiceEvent: InvoiceEvent = {
          pedidoId: pedido.pedidoId,
          invoiceNumber: pedido.feHdr?.numeroFactura,
          cliente: pedido.cliente,
        };
        this.invoices.update((arr: InvoiceEvent[]) => {
          arr.push(invoiceEvent);
          return arr.slice(0);
        });
      })

    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
