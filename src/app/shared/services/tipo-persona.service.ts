import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { TipoPersona } from '@shared/models/tipo-persona.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #tiposPersona = signal<TipoPersona[]>([]);
  public tiposPersona = computed(() => this.#tiposPersona());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/tipo-persona`;

    return this.http.get<TipoPersona[]>(url)
    .pipe(
      map((paymentMean) => { this.#tiposPersona.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
