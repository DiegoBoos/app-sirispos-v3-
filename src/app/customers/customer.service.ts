import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, of } from 'rxjs';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationCustomer } from './interfaces/pagination-customer.interface';
import { VCliente } from './models/v-cliente.model';
import { Cliente } from './models/cliente-model';
import { Customer } from './interfaces/customer.interface';
import { id } from 'date-fns/locale';
import { downloadBlob } from '@utils/download-blob';
import Swal from 'sweetalert2';

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

  create(customer: Customer) {

    const url = `${this.apiUrl}/customer/`;

    return this.http.post(url, customer)
      .pipe(
        catchError(() => of()),
      )
  }

  update(customer: Customer) {
    const url = `${this.apiUrl}/customer/${customer.id}`;

    return this.http.patch(url, customer)
      .pipe(
        catchError(() => of()),
      )
  }

  getReportExcelBase64(){
   
    const url = `${this.apiUrl}/customer/export-excel`;

    return this.http.get(url, { responseType: 'blob', observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          downloadBlob(response);
        },
        error: (resp: HttpErrorResponse) => {
          const message = resp.status === 404? 'La consulta no retornó datos': 'Error desconocido';
          Swal.fire('No hay datos', message, 'warning')
        }
      })
  }


}
