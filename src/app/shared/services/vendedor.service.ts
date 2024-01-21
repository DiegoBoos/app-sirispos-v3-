import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Vendedor } from '@shared/models/vendedor.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #vendedores = signal<Vendedor[]>([]);
  public vendedores = computed(() => this.#vendedores());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/vendedor`;

    return this.http.get<Vendedor[]>(url)
    .pipe(
      map((vendedor) => { this.#vendedores.set(vendedor) }),
      catchError(() => []),
    )
  }

}
