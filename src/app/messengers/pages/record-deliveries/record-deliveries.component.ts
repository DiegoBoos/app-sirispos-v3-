import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { format } from 'date-fns';

import { MessengerService } from '../messenger.service';
import { Messenger } from '../../models/messenger.model';
import { RecordCalendarComponent } from '../../components/record-calendar/record-calendar.component';
import { MessengerEvent } from '../../models/messenger-event.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewEditEventComponent } from '../../components/new-edit-event/new-edit-event.component';
import { InvoiceEvent } from '../../models/invoice-event.model';
import { ViewInvoicesEventComponent } from '../../components/view-invoices-event/view-invoices-event.component';

@Component({
  selector: 'app-record-deliveries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    RecordCalendarComponent,
  ],
  templateUrl: './record-deliveries.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecordDeliveriesComponent {
  private messengerService = inject(MessengerService);
  private dialog = inject(MatDialog);

  public term: string = '';

  public messenger = signal<Messenger>(new Messenger());
  public messengerEvents = signal<MessengerEvent[]>([]);

  private actionNewEditEvent: string = '';

  searchMessenger() {
    this.actionNewEditEvent = '';

    this.messengerService
      .searchByIdentification(this.term)
      .subscribe((data) => {
        const messenger: Messenger = data;

        if (messenger.isActive) {
          this.messenger.set(messenger);
          this.loadMessengerEvents();
          this.term = '';
        } else {
          Swal.fire(
            'No es posible registrar',
            `Mensajero "${messenger.name}" se encuentra inactivo`,
            'error'
          );
          this.messenger.set(new Messenger());
        }
      });

  }

  loadMessengerEvents() {
    this.messengerService
      .getEventsByDateByMessenger(
        this.messenger().id!,
        format(new Date(), 'yyyy-MM-dd')
      )
      .subscribe((data) => {
        const messengerEvents: MessengerEvent[] = data;

        messengerEvents.map((i) => {
          if (i.endDate) {
            const diffMinutes =
              (new Date(i.endDate).getTime() -
                new Date(i.startDate!).getTime()) /
              60000;

            const dateDiffhours = Math.floor(diffMinutes / 60);
            const dateDiffminutes = Math.floor(diffMinutes % 60);

            i.dateDiffhours = dateDiffhours;
            i.dateDiffminutes = dateDiffminutes;
          }
        });

        if (
          this.actionNewEditEvent !== 'save' &&
          this.actionNewEditEvent !== 'cancel'
        ) {
          if (messengerEvents.length === 0 || messengerEvents[0].endDate) {
            this.newEvent();
          } else {
            this.editEvent(messengerEvents[0]);
          }
        }
        this.messengerEvents.set(messengerEvents);
      });
  }

  newEvent(): void {
    const dialogRef = this.dialog.open(NewEditEventComponent, {
      data: { action: 'add', messenger: this.messenger() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { action } = result;
        this.actionNewEditEvent = action;
        this.loadMessengerEvents();
      }
    });
  }

  editEvent(messengerEvent: MessengerEvent) {
    const dialogRef = this.dialog.open(NewEditEventComponent, {
      data: { action: 'update', messengerEvent },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { action } = result;
        this.actionNewEditEvent = action;
        if (action === 'save') {
          this.loadMessengerEvents();
        }
      }
    });
  }

  viewInvoices(invoices: InvoiceEvent[]) {
    const dialogRef = this.dialog.open(ViewInvoicesEventComponent, {
      data: { invoices },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { action } = result;
        this.actionNewEditEvent = action;
        if (action === 'save') {
          this.loadMessengerEvents();
        }
      }
    });
  }
}
