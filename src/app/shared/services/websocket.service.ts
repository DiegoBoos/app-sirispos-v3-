import { Injectable, computed, inject, signal } from '@angular/core';
import { EventSocket } from '@shared/models/event-socket.model';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Pedido } from '../../pedidos/interfaces/pedido.interface';
import { PedidoService } from '../../pedidos/pedido.service';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  
  private router = inject(Router);
  private socket = inject(Socket);
  private pedidoService = inject(PedidoService);


  #isSocketConnected = signal<boolean>(true);

  public isSocketConnected = computed<boolean>( () => this.#isSocketConnected() );

  constructor() { 
    this.checkStatus();
    this.listen();
    this.listenPedidosFinalizados();
  }

  private checkStatus() {

    const token = localStorage.getItem('token-app-spv3');

    this.socket.on(EventSocket.CONNECT, () => {
      this.#isSocketConnected.set(true);
      // if (token?.trim() === '') this.emit(EventSocket.LOGGED, token);
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

  private listenPedidosFinalizados() {
    this.socket.on(EventSocket.GET_PEDIDOS_FINALIZADOS, (data: any) => {
      const { payload } = data;
      const pedidos: Pedido[] = payload;
      this.pedidoService.pedidosFinalizados.set(pedidos);
    })
  }
  
  emit( event: string, payload?: any, callback?: Function): void {
    this.socket.emit(event, payload, callback)
  }
  
  logout(): void {
    // if ( this.router.url !== '/auth/side-login' ) localStorage.setItem('route-app-spv3', this.router.url);
    localStorage.removeItem('token-app-spv3');
    localStorage.removeItem('user-app-spv3');
    this.router.navigateByUrl('/auth/side-login');
    Swal.fire('Error', 'No es posible iniciar sesión. Ya hay una sesión Activa.', 'error' );
  }


}
