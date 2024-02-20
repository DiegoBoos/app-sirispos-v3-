import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { SearchParam } from '@shared/interfaces/search-param.interface';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../../pipes/pipes.module';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PopupInfoComponent } from '@shared/components/popup-info/popup-info.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { format } from 'date-fns';
import { InvoiceTypeService } from '@shared/services/invoice-type.service';
import { InvoiceType } from '@shared/models/invoice-type.model';

import { RouterModule } from '@angular/router';
import { MessengerService } from '../messenger.service';
import { Messenger } from '../../models/messenger.model';
import { NewEditMessengerComponent } from '../../components/new-edit-messenger/new-edit-messenger.component';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-messengers-query',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './messengers-query.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MessengersQueryComponent implements OnInit {
  @BlockUI() blockUI?: NgBlockUI;

  private messengerService = inject(MessengerService);

  private dialog = inject(MatDialog);

  public messengers = signal<Messenger[]>([]);

  public term: string = '';

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
  };

  ngOnInit(): void {
    this.loadData();
    initFlowbite();
  }

  loadData() {
    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.term = this.term;
    let previousLength: number = this.searchParam.pagination!.length;

    this.messengerService
      .searchMessengers(this.searchParam)
      .subscribe((resp) => {
        this.messengers.set(resp.data);
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

  newMessenger(): void {

    const dialogRef = this.dialog.open(NewEditMessengerComponent, { data: { action: 'add' } });

    dialogRef.afterClosed().subscribe((result) => {
     
      if (result) {
        this.loadData();

      }
    });
  }


  editMessenger(messenger: Messenger) {

    const dialogRef = this.dialog.open(NewEditMessengerComponent, { data: { action: 'update', messenger } });

    dialogRef.afterClosed().subscribe((result) => {
     
      this.loadData();
      // if (result) {
      //   this.loadData();
      // }
    });
  }

  licenseMessenger(messenger: Messenger) {
    this.messengerService.getLicense(messenger.id!).subscribe((data) => {
      const base64 = data;
      const fileName = `Carnet_${messenger.name}`;
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        data: { base64, fileName }, disableClose: true,
      });
      dialogRef.afterClosed().subscribe(() => {});
    });
  }

  listMessengerDownload() {
    this.searchParam.term = this.term;

    // this.messengerService.getReportExcelBase64(this.messengerSearchParam);
  }
}
