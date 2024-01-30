import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { initFlowbite } from 'flowbite';
import { CustomerPaymentService } from '../../customer-payment.service';
import { VPagoCli } from '../../models/v-pagocli.model';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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

  private customerPaymentService = inject(CustomerPaymentService);

  public customerPayments = signal<VPagoCli[]>([]);
  public maxDate: Date = new Date();
  public dateFrom: string = format(
    new Date(new Date().getFullYear(), 0, 1),
    'yyyy-MM-dd'
  );
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');
  public term: string = '';

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
  }

  ngOnInit(): void {
    this.loadData();
    initFlowbite()
  }

  loadData() {

    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
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

}
