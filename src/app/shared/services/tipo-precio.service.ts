import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { TipoPrecio } from '@shared/models/tipo-precio.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPrecioService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #tiposPrecio = signal<TipoPrecio[]>([]);
  public tiposPrecio = computed(() => this.#tiposPrecio());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/tipo-precio`;

    return this.http.get<TipoPrecio[]>(url)
    .pipe(
      map((tipoPrecio) => { this.#tiposPrecio.set(tipoPrecio) }),
      catchError(() => []),
    )
  }

}
