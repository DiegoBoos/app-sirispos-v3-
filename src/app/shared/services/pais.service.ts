import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Pais } from '@shared/models/pais.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #paises = signal<Pais[]>([]);
  public paises = computed(() => this.#paises());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/pais`;

    return this.http.get<Pais[]>(url)
    .pipe(
      map((paymentMean) => { this.#paises.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
