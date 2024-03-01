import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DashboardService } from '../../../dashboard/dashboard.service';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../pedido.service';
import { Pedido, PedidoDetalle } from '../../interfaces/pedido.interface';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { WebsocketService } from '@shared/services/websocket.service';
import { EventSocket } from '@shared/models/event-socket.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-separacion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './separacion.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SeparacionComponent implements OnInit, OnDestroy {
  public dashboardService = inject(DashboardService);
  private webSocketService = inject(WebsocketService);
  public pedidoService = inject(PedidoService);

  private router = inject(Router);

  public orden: string = '';

  public pedido = signal<Pedido | null>(null);
  public message = signal<string>('');

  public pendientes = signal<PedidoDetalle[]>([]);
  public separados = signal<PedidoDetalle[]>([]);
  public pedidosFinalizados = computed(() =>
    this.pedidoService.pedidosFinalizados()
  );

  // public isExit = true;
  constructor() {
    this.dashboardService.displayMenu.set(false);
  }
  
  ngOnDestroy(): void {
    this.dashboardService.displayMenu.set(true);
  }
  ngOnInit(): void {
    initFlowbite();
    this.emitSocketFinalizados();
    // this.webSocketService.emit('pedidos-finalizados');
  }
  
  emitSocketFinalizados() {
    this.webSocketService.emit(EventSocket.GET_PEDIDOS_FINALIZADOS);
  }

  emitSocketReset() {
    this.webSocketService.emit(EventSocket.RESET_PEDIDOS);
  }

  // loadPedidosFinalizados() {
  //   this.pedidoService.getFinalizados().subscribe((data: any) => this.pedidosFinalizados.set(data));
  // }

  exit() {
    
    this.router.navigateByUrl('/dashboard/pedidos');
  }

  searchPedido() {
    const orden =
      this.orden.length < 10
        ? `OP${'0'.repeat(8 - this.orden.length)}${this.orden}`
        : this.orden;
    this.pedidoService.getByOrden(orden).subscribe((resp: any) => {
      if (resp) {
        const pedido: Pedido = resp;
        this.loadPedido(pedido);
      }
    });
  }

  loadPedido(pedido: Pedido) {
    this.message.set('');
    this.pendientes.set([]);
    this.separados.set([]);

   
    if (pedido.estado !== 'V') {
      let estado = '';
      switch (pedido.estado) {
        case 'A': {
          estado = 'Anulado';
          break;
        }
        case 'F': {
          estado = 'Facturado';
          break;
        }
        case 'N': {
          estado = 'Facturando';
          break;
        }
        case 'P': {
          estado = 'Pendiente';
          break;
        }
        case 'V': {
          estado = 'Verificación';
          break;
        }
        case 'E': {
          estado = 'Elaboración';
          break;
        }
        case 'Z': {
          estado = 'Finalizado';
          break;
        }
        default: {
          estado = 'Con error';
          break;
        }
      }
      this.message.set(
        `No es posible separar pedido se encuentra en estado ${estado}`
      );
    } else {
      this.pendientes.set(pedido.pedidoDetalles!);
      this.pendientes().sort(this.orderDetalles);
    }
    this.webSocketService.emit(EventSocket.SELECT_PEDIDO_FINALIZADO, { pedidoSelected: pedido, pedidoActual: this.pedido() });
    this.pedido.set(pedido);
  }

  toSeparado(item: PedidoDetalle) {
    const index = this.pendientes().findIndex(
      (i) => i.pedidodetalleId === item.pedidodetalleId
    );
    this.pendientes.update((arr: PedidoDetalle[]) => {
      arr.splice(index, 1);
      return arr.slice(0);
    });
    this.separados.update((arr: PedidoDetalle[]) => {
      arr.push(item);
      return arr.slice(0);
    });

    this.pendientes().sort(this.orderDetalles);
    this.separados().reverse();

    if (this.pendientes().length === 0) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Se separaron todos los productos pendientes. Desea finalizar la separación del pedido?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((resutl) => {
        if (resutl.isConfirmed) {
          
          this.sendPedido()
        }
      });
    }
  }

  toPendiente(item: PedidoDetalle) {
    const index = this.separados().findIndex(
      (i) => i.pedidodetalleId === item.pedidodetalleId
    );
    this.separados.update((arr: PedidoDetalle[]) => {
      arr.splice(index, 1);
      return arr.slice(0);
    });
    this.pendientes.update((arr: PedidoDetalle[]) => {
      arr.push(item);
      return arr.slice(0);
    });

    this.pendientes().sort(this.orderDetalles);
    this.separados().sort(this.orderDetalles);
  }

  orderDetalles(a: PedidoDetalle, b: PedidoDetalle) {
    // Primero ordena por marca
    if (a.producto.marca.nombre < b.producto.marca.nombre) return -1;
    if (a.producto.marca.nombre > b.producto.marca.nombre) return 1;

    // Si las marcas son iguales, ordena por descripción
    if (a.producto.descripcion < b.producto.descripcion) return -1;
    if (a.producto.descripcion > b.producto.descripcion) return 1;

    return 0; // Son igualesrdenar por nombre
  }

  sendPedido() {
    if (this.pedido()) {
      if (this.pendientes().length === 0 && this.pedido()?.estado === 'V') {
        this.webSocketService.emit(EventSocket.SEND_TO_VERIFICATION, { pedido: this.pedido() });
        this.pedido.set(null);
        this.separados.set([]);
        this.orden = '';
        Swal.fire('Pedido separado','El pedido ha sido separado correctamente','success');
      } else {
        Swal.fire('No es posible enviar a verificación','Tiene productos pendientes de separación','warning'); 
      } 
    } else 
      Swal.fire('No es posible enviar a verificación','Debe seleccionar un pedido','warning');
    
  }


}
