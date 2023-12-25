import { Injectable, computed, inject, signal } from '@angular/core';
import { EventSocket } from '@shared/models/event-socket.model';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  
  private router = inject(Router);
  private socket = inject(Socket);
  // private authService = inject(AuthService);


  #isSocketConnected = signal<boolean>(true);

  public isSocketConnected = computed<boolean>( () => this.#isSocketConnected() );

  constructor() { 
    this.checkStatus();
    this.listen();
  }

  private checkStatus() {

    const token = localStorage.getItem('token-app-spv3');

    this.socket.on(EventSocket.CONNECT, () => {
      this.#isSocketConnected.set(true);
      if (token?.trim() === '') this.emit(EventSocket.LOGGED, token);
    });
    
    this.socket.on(EventSocket.DISCONNECT, () => {
      this.#isSocketConnected.set(false);
    });
  }

  private listen() {
    this.socket.on(EventSocket.FAILED_AUTH, () => {
      this.logout();
    });
  }
  
  emit( event: string, payload?: any, callback?: Function): void {
    this.socket.emit(event, payload, callback)
  }
  
  logout(): void {
    // if ( this.router.url !== '/auth/side-login' ) localStorage.setItem('route-app-spv3', this.router.url);
    localStorage.removeItem('token-app-spv3');
    localStorage.removeItem('user-app-spv3');
    this.router.navigateByUrl('/auth/side-login');
    // Swal.fire('Error', 'No es posible iniciar sesión. Ya hay una sesión Activa.', 'error' );
  }


}
