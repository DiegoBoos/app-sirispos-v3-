import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { PaymentMethod } from '@shared/models/payment-method.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #paymentMethods = signal<PaymentMethod[]>([]);
  public paymentMethods = computed(() => this.#paymentMethods());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/payment-method`;

    return this.http.get<PaymentMethod[]>(url)
    .pipe(
      map((paymentMethod) => { this.#paymentMethods.set(paymentMethod) }),
      catchError(() => []),
    )
  }

}
