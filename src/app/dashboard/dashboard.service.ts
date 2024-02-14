import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public displayMenu = signal<boolean>(true);

  constructor() { }

}
