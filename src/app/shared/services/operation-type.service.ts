import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { OperationType } from '@shared/models/operation-type.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {

  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  #operationTypes = signal<OperationType[]>([]);
  public operationTypes = computed(() => this.#operationTypes());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/operation-type`;

    return this.http.get<OperationType[]>(url)
    .pipe(
      map((operationTypes) => {
        // Se filtra por el requerimiento de esos documentos
        const filterOperationTypes: OperationType[] = operationTypes.filter(i => i.code === '91' || i.code === '92');
        return this.#operationTypes.set(filterOperationTypes)
      }),
      catchError(() => []),
    )
  }

}
