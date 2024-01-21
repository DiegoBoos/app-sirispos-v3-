import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { ReteFuente } from '@shared/models/retefuente.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReteFuenteService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #retefuentes = signal<ReteFuente[]>([]);
  public retefuentes = computed(() => this.#retefuentes());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/retefuente`;

    return this.http.get<ReteFuente[]>(url)
    .pipe(
      map((retefuente) => { this.#retefuentes.set(retefuente) }),
      catchError(() => []),
    )
  }

}
