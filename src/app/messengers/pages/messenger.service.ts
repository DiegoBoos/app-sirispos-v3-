import {
  HttpClient,
} from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, catchError, finalize, map, of } from 'rxjs';

import { Messenger } from '../models/messenger.model';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationMessenger } from '../interfaces/pagination-messenger.interface';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public isLoading = signal<boolean>(false);

  constructor() {}

  saveMessenger(messenger: Messenger): Observable<Messenger | boolean> {
    const url = `${this.apiUrl}/messengers`;
    const { id } = messenger;

    const requestObservable = id === null
      ? this.http.post(url, messenger)
      : this.http.patch(`${url}/${id}`, messenger);

    return requestObservable.pipe(
      map( (data: any) => {
        return data
      }),
      catchError(() => of(false))
    );
  }

  deleteMessenger(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/messengers/${id}`;
    const requestObservable = this.http.delete(url);
    return requestObservable.pipe(
      map(() => {
        return true
      }),
      catchError(() => of(false))
    );
  }

  searchMessengers(
    searchParam: SearchParam
  ): Observable<PaginationMessenger> {
   
    const { pagination, term } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/messengers/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}`;

    return this.http.get<PaginationMessenger>(url).pipe(catchError(() => of()));
  }

  getLicense(id: string) {
    const url = `${this.apiUrl}/messengers/license/${id}`;
    this.isLoading.set(true);
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(() => of()),
      finalize(() => this.isLoading.set(false))
    );
  }

}
