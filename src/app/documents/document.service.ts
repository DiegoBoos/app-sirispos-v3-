import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { DocumentEmit } from './interfaces/document.interface';
import { Observable, catchError, of } from 'rxjs';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationCustomer } from '../customers/interfaces/pagination-customer.interface';
import { PaginationDocument } from './interfaces/document-customer.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() { }

  createDocument(documentEmit: DocumentEmit) {

    const url = `${this.apiUrl}/invoices/`;

    return this.http.post<DocumentEmit>(url, documentEmit)
      .pipe(
        catchError(() => of()),
      )


  }

  searchDocuments(searchParam: SearchParam): Observable<PaginationDocument> {

    const { pagination, term = '' } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/invoices/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}`;

    return this.http.get<PaginationDocument>(url)
      .pipe(
        catchError(() => of()),
      )

  }

  emitDocument(documentId: string) {

    const url = `${this.apiUrl}/taxxa/emit/${documentId}`;

    return this.http.post<DocumentEmit>(url, {})
      .pipe(
        catchError(() => of(false)),
      )

  }

  getDocument(cufe: string): void {

    const url = `https://api.taxxa.co/documentGet_pdf.dhtml?hash=${cufe}`;

    const options = 'width=800,height=600';

    window.open(url, 'Representacion Gráfica', options);

  }
  

}
