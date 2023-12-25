import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { InvoiceType } from '@shared/models/invoice-type.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceTypeService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #invoiceTypes = signal<InvoiceType[]>([]);
  public invoiceTypes = computed(() => this.#invoiceTypes());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/invoice-type`;

    return this.http.get<InvoiceType[]>(url)
    .pipe(
      map((invoiceTypes) => {
        // Se filtra por el requerimiento de esos documentos únicamente se hace para las Notas por el momento
        const filterInvoiceTypes: InvoiceType[] = invoiceTypes.filter(i => i.code === '91' || i.code === '92');
        return this.#invoiceTypes.set(filterInvoiceTypes)
      }),
      catchError(() => []),
    )
  }

}
