import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MessengerEvent } from '../../models/messenger-event.model';
import { InvoiceEvent } from '../../models/invoice-event.model';

@Component({
  selector: 'app-record-calendar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './record-calendar.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordCalendarComponent {

  @Input()
  messengerEvents: MessengerEvent[] =[];

  @Output()
  public editEvent = new EventEmitter<MessengerEvent>();

  @Output()
  public viewInvoices = new EventEmitter<InvoiceEvent[]>();


  emitEditEvent(event: MessengerEvent) {
    this.editEvent.emit(event);
  }

  emitViewInvoices(invoices: InvoiceEvent[]) {
    this.viewInvoices.emit(invoices);
  }


 }
