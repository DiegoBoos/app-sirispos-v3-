import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { PedidoSearchParam } from './interfaces/pedido-search-param.interface';
import { PaginationPedido } from './interfaces/pagination-pedido.interface';
import { Observable, catchError, finalize, of } from 'rxjs';

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

}
