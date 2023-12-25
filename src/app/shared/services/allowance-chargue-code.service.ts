import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { AllowanceChargueCode } from '@shared/models/allowance-chargue-code.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllowanceChargueCodeService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #AllowanceChargueCodes = signal<AllowanceChargueCode[]>([]);
  public AllowanceChargueCodes = computed(() => this.#AllowanceChargueCodes());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/allowance-chargue-code`;

    return this.http.get<AllowanceChargueCode[]>(url)
    .pipe(
      map((AllowanceChargueCodes) => { this.#AllowanceChargueCodes.set(AllowanceChargueCodes) }),
      catchError(() => []),
    )
  }

}
