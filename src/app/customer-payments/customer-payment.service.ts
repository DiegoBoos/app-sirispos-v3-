import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, finalize, of } from 'rxjs';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationCustomer } from './interfaces/pagination-customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerPaymentService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  #isLoading = signal<boolean>(true);
  public isLoading = computed(() => this.#isLoading());

  constructor() { }

  searchCustomerPaymentsByClient(id: string, searchParam: SearchParam): Observable<PaginationCustomer> {

    this.#isLoading.set(true);
    const { pagination, term = '' } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/customer-payment/find-by-client-term/${id}?limit=${pageSize}&page=${pageIndex}&term=${term}`;

    return this.http.get<PaginationCustomer>(url)
      .pipe(
        catchError(() => of()),
        finalize(() => this.#isLoading.set(false)) 
      )

  }


}
