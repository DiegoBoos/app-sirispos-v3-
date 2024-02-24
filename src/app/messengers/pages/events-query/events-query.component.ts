import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { format } from 'date-fns';
import { MessengerService } from '../messenger.service';
import { MessengerEvent } from '../../models/messenger-event.model';
import { EventSearchParam } from '../../interfaces/event-search-param.interface';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { ViewInvoicesEventComponent } from '../../components/view-invoices-event/view-invoices-event.component';
import { InvoiceEvent } from '../../models/invoice-event.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Messenger } from '../../models/messenger.model';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-events-query',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BlockUIModule, MatDialogModule],
  templateUrl: './events-query.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EventsQueryComponent implements OnInit {

  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  private dialog = inject(MatDialog);

  public isLoading = computed(() => {    
    if (this.messengerService.isLoading()) {
      this.blockUILoadData!.start('Consultando datos ...');
    } else {
      this.blockUILoadData!.stop();
    }
    return this.messengerService.isLoading()
  })

  public maxDate: Date = new Date();
  public dateFrom: string = format(
    new Date(new Date().getFullYear(), 0, 1),
    'yyyy-MM-dd'
  );
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');
  public term: string = '';
  public messengerService = inject(MessengerService);
  public messengers = computed(() => {
    const messengers: Messenger[] = []
    const messengerAll: Messenger = {
      id: '',
      identification: '',
      name: 'Todos'
    }
    messengers.push(messengerAll);
    this.messengerService.messengers().map(i=>messengers.push(i));
    return messengers;
  });

  public messengerId: string = '';


  public events = signal<MessengerEvent[]>([]);

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
    dateFrom: '',
    dateTo: '',
  };

  eventSearchParam: EventSearchParam = {
    messengerId: '',
    searchParam: this.searchParam,
  };

  ngOnInit(): void {
    this.loadData();
    initFlowbite();
  }

  listEventDownload() {

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;

    this.eventSearchParam.searchParam = this.searchParam;
    this.eventSearchParam.messengerId = this.messengerId;


    this.messengerService.getReportExcelBase64(this.eventSearchParam);
  }

  loadData() {
    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    let previousLength: number = this.searchParam.pagination!.length;

    this.eventSearchParam.searchParam = this.searchParam;
    this.eventSearchParam.messengerId = this.messengerId;

    this.messengerService
      .searchEvents(this.eventSearchParam)
      .subscribe((resp) => {
       
        const messengerEvents = resp.data;
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
        
        this.events.set(messengerEvents);
        const { length, pageIndex, pageSize, pages } = resp.pagination;
        this.searchParam.pagination = {
          length: +length,
          pageIndex: +pageIndex,
          pageSize: +pageSize,
          pages: +pages,
        };
        if (previousLength !== this.searchParam.pagination.length)
          this.searchParam.pagination.pageIndex = 0;
      });
  }

  previousPage() {
    const pageIndex = this.searchParam.pagination!.pageIndex;
    if (pageIndex > 0) {
      this.searchParam.pagination!.pageIndex--;
    }
    this.loadData();
  }

  nextPage() {
    const pageIndex = this.searchParam.pagination!.pageIndex;
    if (pageIndex < this.searchParam.pagination!.pages) {
      this.searchParam.pagination!.pageIndex++;
    }
    this.loadData();
  }

  viewInvoices(invoices: InvoiceEvent[]) {
    const dialogRef = this.dialog.open(ViewInvoicesEventComponent, {
      data: { invoices },
    });

    dialogRef.afterClosed().subscribe(() => {
      // if (result) {
      //   const { action } = result;
      //   this.actionNewEditEvent = action;
      //   if (action === 'save') {
      //     this.loadMessengerEvents();
      //   }
      // }
    });
  }
}
