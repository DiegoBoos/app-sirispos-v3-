import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { TaxScheme } from '@shared/models/tax-scheme.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxSchemeService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #taxSchemes = signal<TaxScheme[]>([]);
  public taxSchemesItems = computed(() => this.#taxSchemes().filter(i=>i.identifier === '04' || i.identifier === '01' ));
  public taxSchemesGenerics = computed(() => this.#taxSchemes().filter(i=>i.identifier === '05' || i.identifier === '06' || i.identifier === '07' || i.identifier === 'RF' ));

  #taxAllSchemes = signal<TaxScheme[]>([]);
  public taxAllSchemes = computed(() => this.#taxAllSchemes());

  constructor() {
    this.getAll().subscribe();
    this.getAllSchemes().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/tax-scheme`;

    return this.http.get<TaxScheme[]>(url)
    .pipe(
      map((taxSchemes) => { this.#taxSchemes.set(taxSchemes) }),
      catchError(() => []),
    )
  }

  getAllSchemes() {
    const url = `${this.apiUrl}/tax-scheme/all-schemes`;

    return this.http.get<TaxScheme[]>(url)
    .pipe(
      map((taxAllSchemes) => { this.#taxAllSchemes.set(taxAllSchemes) }),
      catchError(() => []),
    )
  }
  

}
