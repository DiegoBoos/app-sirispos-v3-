import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  LOCALE_ID,
  OnInit,
  Optional,
  Output,
  inject,
  signal,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { FormsModule } from '@angular/forms';
import { CustomerPaymentService } from '../../customer-payment.service';
import { VPagoCliDetalle } from '../../models/v-pagocli-detalle.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

registerLocaleData(localeEs);

@Component({
  selector: 'app-search-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './search-payments.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SearchPaymentsComponent implements OnInit {
  
  public customerPaymentService = inject(CustomerPaymentService);

  public customerPayments = signal<VPagoCliDetalle[]>([]);
  public term: string = '';

  isHidden = true;

  // #customerSelect = signal<VCliente>(new VCliente());
  // public customerSelect = computed(() => this.#customerSelect());
  @Output()
  public customerPaymentsSelect = new EventEmitter<VPagoCliDetalle[]>();

  public clienteId!: string;

  totalDiscounts: number = 0;

  selectedPayments: any[] = [];

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10000,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
  };

  constructor(
    public dialogRef: MatDialogRef<SearchPaymentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any,
  ) {

    const { data } = obj;
    this.clienteId = data || '0';
  }

  ngOnInit(): void {
    this.loadData();
  }



  loadData() {
    this.searchParam.term = this.term;
    let previousLength: number = this.searchParam.pagination!.length;
    this.customerPaymentService
      .searchCustomerPaymentsByClient(this.clienteId, this.searchParam)
      .subscribe((resp) => {

        const customerPaymentsWithDiscount: VPagoCliDetalle[] =
          resp.data.filter((i) => i.descuento > 0);

          customerPaymentsWithDiscount.map ( i=>i.isSelected = false);
 
        this.customerPayments.set(customerPaymentsWithDiscount);
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

  openModal() {
    // Lógica para abrir el modal
    this.isHidden = false;
  }

  closeDialog(): void {
    
    this.dialogRef.close({ event: 'Cancel', data: this.selectedPayments });
  }



  selectCustomerPayments() {
    this.customerPaymentsSelect.emit(this.selectedPayments);
    this.closeDialog();
  }

  toggleSelection(payment: any) {
    if (payment.isSelected) {
      this.selectedPayments.push(payment);
    } else {
      this.selectedPayments = this.selectedPayments.filter((p) => p !== payment);
    }

    this.totalDiscounts = 0;
    this.selectedPayments.map(i => this.totalDiscounts += Number(i.descuento));
  }

}
