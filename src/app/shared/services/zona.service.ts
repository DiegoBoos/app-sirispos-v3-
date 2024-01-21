import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Zona } from '@shared/models/zona.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #zonas = signal<Zona[]>([]);
  public zonas = computed(() => this.#zonas());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/zona`;

    return this.http.get<Zona[]>(url)
    .pipe(
      map((zona) => { this.#zonas.set(zona) }),
      catchError(() => []),
    )
  }

}
