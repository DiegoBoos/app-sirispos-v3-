import { Injectable, inject, signal } from '@angular/core';
import { PositionInfo } from './interfaces/postion-info-interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { UbicacionInterface } from './interfaces';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public positionInfo = signal<PositionInfo[]>([]);

  constructor() { }

  getGeolocation(fecha: string) {
    const url = `${this.apiUrl}/geolocation/${fecha}`;
    return this.http.get<UbicacionInterface>(url).pipe(catchError(() => of()));
  }
 
}
