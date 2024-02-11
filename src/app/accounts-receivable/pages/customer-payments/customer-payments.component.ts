import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { initFlowbite } from 'flowbite';
import { CustomerPaymentService } from '../../customer-payment.service';
import { VPagoCli } from '../../models/v-pagocli.model';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BlockUIModule,
    MatDialogModule,
  ],
  templateUrl: './customer-payments.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomerPaymentsComponent implements OnInit {
  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  private customerPaymentService = inject(CustomerPaymentService);
  private dialog = inject(MatDialog);

  public customerPayments = signal<VPagoCli[]>([]);

  public isLoading = computed(() => {    
    if (this.customerPaymentService.isLoading()) {
      this.blockUILoadData!.start('Consultando datos ...');
    } else {
      this.blockUILoadData!.stop();
    }
    return this.customerPaymentService.isLoading()
  })

  public maxDate: Date = new Date();
  public dateFrom: string = format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');
  public term: string = '';
  public anuladas: boolean = false;

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
    anuladas: false,
  };

  ngOnInit(): void {
    this.loadData();
    initFlowbite();
  }

  loadData() {
    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    this.searchParam.anuladas = this.anuladas;
    let previousLength: number = this.searchParam.pagination!.length;

    this.customerPaymentService
      .searchCustomerPayments(this.searchParam)
      .subscribe((resp) => {
        this.customerPayments.set(resp.data);
        const { length, pageIndex, pageSize, pages } = resp.pagination;
        this.searchParam.pagination = {
          length: +length,
          pageIndex: +pageIndex,
          pageSize: +pageSize,
          pages: +pages,
        };
        if (previousLength !== this.searchParam.pagination.length) {
          this.searchParam.pagination.pageIndex = 0;
        }
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

  cancelPayment(id: number) {
    Swal.fire({
      title: 'Está seguro de anular?',
      text: 'Debe registrar una observación.',
      icon: 'question',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular!',
      cancelButtonText: 'Cancelar',
      preConfirm: (text) => {
        if (text === '') {
          Swal.showValidationMessage('No se aceptan valores vacíos.');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerPaymentService
          .cancel(id, { observation: result.value })
          .subscribe((resp: any) => {
            if (resp.ok) {
              Swal.fire(
                'Transacción exitosa',
                'Registro de pagos anulado correctamente',
                'success'
              );
              this.loadData();
            }
          });
      }
    });
  }

  printPayment(id: number, dcto: string) {
    // this.blockUILoadData!.start('Generando comprobante ...');
    this.customerPaymentService.getPayReport(id).subscribe((data) => {
      const base64 = data;
      const fileName = `${dcto}`;
      // this.blockUILoadData!.stop();
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        data: { base64, fileName }, disableClose: true,
      });
      dialogRef.afterClosed().subscribe(() => {});
    });
  }

  listDocumentDownload() {
    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    this.searchParam.anuladas = this.anuladas;
    this.customerPaymentService.getReportExcelBase64(this.searchParam);
  }

  listDetailDocumentDownload() {
    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    this.customerPaymentService.getReportDetailExcelBase64(this.searchParam);
  }

}
