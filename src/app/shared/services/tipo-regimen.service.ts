import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { TipoRegimen } from '@shared/models/tipo-regimen.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoRegimenService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #tiposRegimen = signal<TipoRegimen[]>([]);
  public tiposRegimen = computed(() => this.#tiposRegimen());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/tipo-regimen`;

    return this.http.get<TipoRegimen[]>(url)
    .pipe(
      map((paymentMean) => { this.#tiposRegimen.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
