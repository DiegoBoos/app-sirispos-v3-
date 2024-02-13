import { Injectable, signal } from '@angular/core';
import { PositionInfo } from './interfaces/postion-info-interface';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public positionInfo = signal<PositionInfo[]>([]);

  constructor() { }

}
