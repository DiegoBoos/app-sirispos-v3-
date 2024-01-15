import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { VMunicipio } from '@shared/models/v-municipio.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VMunicipioService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #municipios = signal<VMunicipio[]>([]);
  public municipios = computed(() => this.#municipios());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/municipio`;

    return this.http.get<VMunicipio[]>(url)
    .pipe(
      map((paymentMean) => { this.#municipios.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
