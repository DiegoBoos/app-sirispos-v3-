import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { VConfig } from './models/v-config.model';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  #seeting = signal<VConfig>(new VConfig());
  public seeting = computed(() =>this.#seeting());


  constructor() {
    this.findOne().subscribe();
   }

  findOne(): Observable<any | VConfig> {

    const url = `${this.apiUrl}/setting`;

    return this.http.get<VConfig>(url)
      .pipe(
        map((data) => this.#seeting.set(data)),
        catchError(() => of()),
      )

  }

}
