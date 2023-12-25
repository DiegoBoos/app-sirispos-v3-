import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { PaymentMean } from '@shared/models/payment-mean.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentMeanService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #paymentMeans = signal<PaymentMean[]>([]);
  public paymentMeans = computed(() => this.#paymentMeans());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/payment-mean`;

    return this.http.get<PaymentMean[]>(url)
    .pipe(
      map((paymentMean) => { this.#paymentMeans.set(paymentMean) }),
      catchError(() => []),
    )
  }

}
