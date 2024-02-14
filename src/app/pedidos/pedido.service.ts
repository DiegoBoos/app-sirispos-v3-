import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { PedidoSearchParam } from './interfaces/pedido-search-param.interface';
import { PaginationPedido } from './interfaces/pagination-pedido.interface';
import { Observable, catchError, finalize, of } from 'rxjs';
import { downloadBlob } from '@utils/download-blob';
import Swal from 'sweetalert2';
import { SearchParam } from '@shared/interfaces/search-param.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public isLoading = signal<boolean>(false);

  constructor() { }

  searchDocuments(
    searchPedidoDto: PedidoSearchParam
  ): Observable<PaginationPedido> {
    const { searchParam } = searchPedidoDto;

    const { pagination, term, dateFrom, dateTo, anuladas = false, } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/pedidos/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&anuladas=${anuladas}`;

    this.isLoading.set(true);
    return this.http.get<PaginationPedido>(url)
      .pipe(
        catchError(() => of()),
        finalize(() => this.isLoading.set(false))  
      );
  }

  getPedidoReport(id: number) {
    const url = `${this.apiUrl}/pedidos/print/${id}`;
    this.isLoading.set(true);
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(() => of()),
      finalize(() => this.isLoading.set(false))
    );
  }

  getByOrden(orden: string) {
    const url = `${this.apiUrl}/pedidos/by-orden/${orden}`;
    this.isLoading.set(true);
    return this.http.get(url).pipe(
      catchError(() => of()),
      finalize(() => this.isLoading.set(false))
    );
  }

  getReportExcelBase64(searchParam: SearchParam) {
    const { term, dateFrom, dateTo, anuladas } = searchParam;

    const url = `${this.apiUrl}/pedidos/export-excel?term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&anuladas=${anuladas}`;
    this.isLoading.set(true);
    return this.http
      .get(url, { responseType: 'blob', observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          downloadBlob(response);
          this.isLoading.set(false);
        },
        error: (resp: HttpErrorResponse) => {
          this.isLoading.set(false);
          const message =
            resp.status === 404
              ? 'La consulta no retornó datos'
              : 'Error desconocido';
          Swal.fire('No hay datos', message, 'warning');
        },
      });
  }

}
