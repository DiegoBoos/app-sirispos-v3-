import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { TipoDocumento } from '@shared/models/tipo-documento.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #tiposDocumento = signal<TipoDocumento[]>([]);
  public tiposDocumento = computed(() => this.#tiposDocumento());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/tipo-documento`;

    return this.http.get<TipoDocumento[]>(url)
    .pipe(
      map((paymentMean) => { this.#tiposDocumento.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
