import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, catchError, finalize, map, of } from 'rxjs';

import { Messenger } from '../models/messenger.model';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { PaginationMessenger } from '../interfaces/pagination-messenger.interface';
import { MessengerEvent } from '../models/messenger-event.model';
import { Pedido } from '../../pedidos/interfaces/pedido.interface';
import { PaginationEvent } from '../interfaces/pagination-event.interface';
import { EventSearchParam } from '../interfaces/event-search-param.interface';
import { downloadBlob } from '@utils/download-blob';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  private readonly apiUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public isLoading = signal<boolean>(false);

  #messengers = signal<Messenger[]>([]);
  public messengers = computed(() => this.#messengers());

  constructor() {
    this.getAll().subscribe();
  }

  getAll() {
    const url = `${this.apiUrl}/messengers`;

    return this.http.get<Messenger[]>(url)
    .pipe(
      map((messengers) => {
        return this.#messengers.set(messengers)
      }),
      catchError(() => []),
    )
  }

  searchByIdentification(identification: string): Observable<Messenger> {
    const url = `${this.apiUrl}/messengers/find-by-identification/${identification}`;

    return this.http.get<Messenger>(url).pipe(catchError(() => of()));
  }

  saveMessenger(messenger: Messenger): Observable<Messenger | boolean> {
    const url = `${this.apiUrl}/messengers`;
    const { id } = messenger;

    const requestObservable =
      id === null
        ? this.http.post(url, messenger)
        : this.http.patch(`${url}/${id}`, messenger);

    return requestObservable.pipe(
      map((data: any) => {
        return data;
      }),
      catchError(() => of(false))
    );
  }

  saveMessengerEvent(messengerEvent: MessengerEvent): Observable<MessengerEvent | boolean> {
    const url = `${this.apiUrl}/messengers/event`;
    const { id } = messengerEvent;

    const requestObservable =
      id === null
        ? this.http.post(url, messengerEvent)
        : this.http.patch(`${url}/${id}`, messengerEvent);

    return requestObservable.pipe(
      map((data: any) => {
        return data;
      }),
      catchError(() => of(false))
    );
  }

  saveEndEvent(messengerEvent: MessengerEvent): Observable<MessengerEvent | boolean> {
    const url = `${this.apiUrl}/messengers/event/end-event`;
    const { id } = messengerEvent;

    const requestObservable = this.http.patch(`${url}/${id}`, messengerEvent);

    return requestObservable.pipe(
      map((data: any) => {
        return data;
      }),
      catchError(() => of(false))
    );
  }

  deleteMessenger(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/messengers/${id}`;
    const requestObservable = this.http.delete(url);
    return requestObservable.pipe(
      map(() => {
        return true;
      }),
      catchError(() => of(false))
    );
  }

  searchMessengers(searchParam: SearchParam): Observable<PaginationMessenger> {
    const { pagination, term } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/messengers/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}`;

    return this.http.get<PaginationMessenger>(url).pipe(catchError(() => of()));
  }

  searchEvents(eventSearchParam: EventSearchParam): Observable<PaginationEvent> {

    const { searchParam, messengerId } = eventSearchParam;

    const { pagination, term, dateFrom, dateTo } = searchParam;

    const { pageIndex = 1, pageSize = 10 } = pagination!;

    const url = `${this.apiUrl}/messengers/event/find-by-term?limit=${pageSize}&page=${pageIndex}&term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&messengerId=${messengerId}`;

    this.isLoading.set(true);
    return this.http.get<PaginationEvent>(url).pipe(catchError(() => of()),finalize(() => this.isLoading.set(false)));
  }

  getLicense(id: string) {
    const url = `${this.apiUrl}/messengers/license/${id}`;
    this.isLoading.set(true);
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(() => of()),
      finalize(() => this.isLoading.set(false))
    );
  }

  getEventsByDateByMessenger(id: string, date: string) {
    const url = `${this.apiUrl}/messengers/find-by-date-messenger/${id}/${date}`;
    this.isLoading.set(true);
    return this.http.get<MessengerEvent[]>(url).pipe(
      catchError(() => of()),
      finalize(() => this.isLoading.set(false))
    );
  }

  getInvoice(invoiceNumber: string) {
    const url = `${this.apiUrl}/pedidos/find-by-invoice-number/${invoiceNumber}`;
    this.isLoading.set(true);
    return this.http.get<Pedido>(url).pipe(
      catchError(() => of()),
      finalize(() => this.isLoading.set(false))
    );
  }

  getReportExcelBase64(eventSearchParam: EventSearchParam) {
    
    const { searchParam, messengerId } = eventSearchParam;

    const { term, dateFrom, dateTo } = searchParam;

    const url = `${this.apiUrl}/messengers/export-excel?term=${term}&dateFrom=${dateFrom}&dateTo=${dateTo}&messengerId=${messengerId}`;
    this.isLoading.set(true);
    return this.http
      .get(url, { responseType: 'blob', observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          downloadBlob(response);
          this.isLoading.set(false);
        },
        error: (resp: HttpErrorResponse) => {
          this.isLoading.set(false);
          const message =
            resp.status === 404
              ? 'La consulta no retornó datos'
              : 'Error desconocido';
          Swal.fire('No hay datos', message, 'warning');
        },
      });
  }
}
