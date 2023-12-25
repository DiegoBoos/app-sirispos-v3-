import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import { WebsocketService } from '@shared/services/websocket.service';
import { EventSocket } from '@shared/models/event-socket.model';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private websocketService = inject(WebsocketService);

  #currentUser = signal<User | null>(null);
  #authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this.#currentUser());
  public authStatus = computed(() => this.#authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
    
  }
  
  
  private setAuthentication(user: User, token: string): boolean {

    this.#currentUser.set(user);
    
    this.#authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token-app-spv3', token);
    localStorage.setItem('user-app-spv3', JSON.stringify(user));

    this.websocketService.emit(EventSocket.LOGGED, token);

    return true;
  }

  login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({ user, token }) => this.setAuthentication(user, token)),
        catchError(err => throwError(() => err.error.message))
      );
  }

  checkAuthStatus(): Observable<boolean> {

    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token-app-spv3') || null;
    const userLocalStorage = localStorage.getItem('user-app-spv3');

    if (!token) {
      this.logout();
      return of(false);
    }

    if (this.router.url !== '/') {
      
      return this.http.get<CheckTokenResponse>(url)
        .pipe(
          map(({ user, token }) => this.setAuthentication(user, token)),
          catchError((err) => {
            this.#authStatus.set(AuthStatus.notAuthenticated);
            this.websocketService.emit(EventSocket.LOGGED, token);
            return of(false);
          })
        );
    } else {
      this.#authStatus.set(AuthStatus.inLogin);
      const user = JSON.parse(userLocalStorage!)  
      this.#currentUser.set(user);
    }
    return of(true);


  }

  logout(): void {
    const token = localStorage.getItem('token-app-spv3');
    if ( this.router.url !== '/auth/side-login' ) localStorage.setItem('route-app-spv3', this.router.url);
    localStorage.removeItem('token-app-spv3');
    localStorage.removeItem('user-app-spv3');
    this.#currentUser.set(null);
    this.#authStatus.set(AuthStatus.notAuthenticated);
    this.websocketService.emit(EventSocket.LOGOUT, token);

  }

}
