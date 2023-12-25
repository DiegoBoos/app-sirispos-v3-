import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { DiscrepancyResponse } from '@shared/models/discrepancy-response.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscrepancyResponseService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #discrepancyResponses = signal<DiscrepancyResponse[]>([]);
  public discrepancyResponses = computed(() => this.#discrepancyResponses());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/discrepancy-response`;

    return this.http.get<DiscrepancyResponse[]>(url)
    .pipe(
      map((discrepancyResponse) => { this.#discrepancyResponses.set(discrepancyResponse) }),
      catchError(() => []),
    )
  }

}
