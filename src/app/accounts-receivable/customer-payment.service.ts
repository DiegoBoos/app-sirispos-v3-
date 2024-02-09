import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, finalize, of } from 'rxjs';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationCustomer } from './interfaces/pagination-customer.interface';
import { MonthValue } from '../statistics/interfaces/month-value.interface';
import { PaginationCustomerMaster } from './interfaces/pagination-customer-master.interface';
import { TransacCustomerParams } from './interfaces/transac-customer-params.interface';
import { VTransacCli } from './models/v-transaccli.model';
import { PagoCli } from './models/pagocli.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerPaymentService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  #isLoading = signal<boolean>(true);
  public isLoading = computed(() => this.#isLoading());

  constructor() { }

  payRegister(pagoCli: PagoCli) {
    const url = `${this.apiUrl}/customer-payment`;

    return this.http
      .post<PagoCli>(url, pagoCli)
      .pipe(catchError(() => of(false)));
  }


  searchCustomerPaymentsByClient(id: string, searchParam: SearchParam): Observable<PaginationCustomer> {

    this.#isLoading.set(true);
    const { pagination, term = '', dateFrom = '', dateTo = '' } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/customer-payment/find-by-client-term/${id}?limit=${pageSize}&page=${pageIndex}&term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}`;

    return this.http.get<PaginationCustomer>(url)
      .pipe(
        catchError(() => of()),
        finalize(() => this.#isLoading.set(false)) 
      )

  }

  searchCustomerPayments(searchParam: SearchParam): Observable<PaginationCustomerMaster> {

    this.#isLoading.set(true);
    const { pagination, term = '', dateFrom = '', dateTo = '', anuladas = false } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/customer-payment/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&anuladas=${anuladas}`;
    
    return this.http.get<PaginationCustomerMaster>(url)
      .pipe(
        catchError(() => of()),
        finalize(() => this.#isLoading.set(false)) 
      )

  }

  getStatisticsNoDocumentEmit(dateFrom: string, dateTo: string): Observable<MonthValue[]> {

    this.#isLoading.set(true);
   
    const url = `${this.apiUrl}/customer-payment/statistics?dateFrom=${dateFrom}&dateTo=${dateTo}`;

    return this.http.get<MonthValue[]>(url)
      .pipe(
        catchError(() => of()),
        finalize(() => this.#isLoading.set(false)) 
      )

  }

  findTransacByClient(id: string, transacCustomerParams: TransacCustomerParams): Observable<VTransacCli[]> {

    this.#isLoading.set(true);
    const { isSaldo, includeAnulado } = transacCustomerParams;

    const url = `${this.apiUrl}/customer-payment/find-transac-by-client/${id}?isSaldo=${isSaldo}&includeAnulado=${includeAnulado}`;

    return this.http.get<VTransacCli[]>(url)
      .pipe(
        catchError(() => of()),
        finalize(() => this.#isLoading.set(false)) 
      )

  }

  cancel(id: number, observation: any) {
    const url = `${this.apiUrl}/customer-payment/cancel/${id}`;

    return this.http.patch(url, observation)
      .pipe(
        catchError(() => of()),
      )
  }

  getPayReport(id: number) {
    const url = `${this.apiUrl}/customer-payment/print/${id}`;
    return this.http.get(url, { responseType: 'text' });
  }

}
