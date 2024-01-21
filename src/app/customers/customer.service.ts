import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, of } from 'rxjs';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationCustomer } from './interfaces/pagination-customer.interface';
import { VCliente } from './models/v-cliente.model';
import { Cliente } from './models/cliente-model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() { }

  searchCustomers(searchParam: SearchParam): Observable<PaginationCustomer> {

    const { pagination, term = '' } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/customer/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}`;

    return this.http.get<PaginationCustomer>(url)
      .pipe(
        catchError(() => of()),
      )

  }

  findById(id: string) {
    const url = `${this.apiUrl}/customer/${id}`;

    return this.http.get<Cliente>(url)
      .pipe(
        catchError(() => of()),
      )
  }


}
