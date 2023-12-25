import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { UnitCode } from '@shared/models/unit-code.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitCodeService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #unitCodes = signal<UnitCode[]>([]);
  public unitCodes = computed(() => this.#unitCodes());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/unit-code`;

    return this.http.get<UnitCode[]>(url)
    .pipe(
      map((paymentMean) => { this.#unitCodes.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
