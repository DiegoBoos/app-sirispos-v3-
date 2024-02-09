import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { DocumentEmit } from './interfaces/document.interface';
import { Observable, catchError, of } from 'rxjs';
import { PaginationDocument } from './interfaces/document-customer.interface';
import { DocumentSearchParam } from './components/document-items/interfaces/document-search-param.interface';
import { downloadBlob } from '@utils/download-blob';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() {}

  createDocument(documentEmit: DocumentEmit) {
    const url = `${this.apiUrl}/invoices/`;

    return this.http
      .post<DocumentEmit>(url, documentEmit)
      .pipe(catchError(() => of()));
  }

  searchDocuments(
    searchDocumentDto: DocumentSearchParam
  ): Observable<PaginationDocument> {
    const { searchParam, status, documentTypeCode } = searchDocumentDto;

    const { pagination, term, dateFrom, dateTo } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/invoices/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}&documentTypeCode=${documentTypeCode}`;

    return this.http.get<PaginationDocument>(url).pipe(catchError(() => of()));
  }

  getReportExcelBase64(searchDocumentDto: DocumentSearchParam) {
    const { searchParam, status, documentTypeCode, isDocumentItems } =
      searchDocumentDto;

    const { term, dateFrom, dateTo } = searchParam;

    const url = `${this.apiUrl}/invoices/export-excel?term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}&documentTypeCode=${documentTypeCode}&isDocumentItems=${isDocumentItems}`;

    return this.http
      .get(url, { responseType: 'blob', observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          downloadBlob(response);
        },
        error: (resp: HttpErrorResponse) => {
          const message =
            resp.status === 404
              ? 'La consulta no retornó datos'
              : 'Error desconocido';
          Swal.fire('No hay datos', message, 'warning');
        },
      });
  }

  emitDocument(documentId: string) {
    const url = `${this.apiUrl}/taxxa/emit/${documentId}`;

    return this.http
      .post<DocumentEmit>(url, {})
      .pipe(catchError(() => of(false)));
  }

  getDocument(cufe: string): void {
    const url = `https://api.taxxa.co/documentGet_pdf.dhtml?hash=${cufe}`;

    const options = 'width=800,height=600';

    window.open(url, 'Representacion Gráfica', options);
  }
}
