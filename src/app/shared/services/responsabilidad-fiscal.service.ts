import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { ResponsabilidadFiscal } from '@shared/models/responsabilidad-fiscal.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsabilidadFiscalService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #responsabilidadesFiscales = signal<ResponsabilidadFiscal[]>([]);
  public responsabilidadesFiscales = computed(() => this.#responsabilidadesFiscales());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/responsabilidad-fiscal`;

    return this.http.get<ResponsabilidadFiscal[]>(url)
    .pipe(
      map((paymentMean) => { this.#responsabilidadesFiscales.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
