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
import { IndexedDbService } from '@shared/services/indexed-db.service';
import { SeparationPedido } from '../../interfaces/separation-pedido.interface';
import { AuthService } from '../../../auth/services/auth.service';

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
  private indexedDbService = inject(IndexedDbService);
  public pedidoService = inject(PedidoService);
  public authService = inject(AuthService);

  private router = inject(Router);

  public orden: string = '';

  public pedido = signal<Pedido | null>(null);
  public message = signal<string>('');

 
  public pedidosFinalizados = computed(() =>
    this.pedidoService.pedidosFinalizados()
  );

  public execTransaction = computed(() =>
    this.indexedDbService.execTransaction()
  );

  constructor() {
    this.dashboardService.displayMenu.set(false);
  }

  ngOnDestroy(): void {
    this.dashboardService.displayMenu.set(true);
  }
  ngOnInit(): void {
    initFlowbite();
    this.emitSocketFinalizados();

    const storePedido = localStorage.getItem('separation-selected-pedido-spv3');
    if (storePedido) {
      const pedido = JSON.parse(storePedido);
      this.loadPedido(pedido);
    }
  }

  async loadData(pedido: Pedido) {
    const pedidoIDB = await this.indexedDbService.getPedido(pedido.pedidoId);

    if (!pedidoIDB) {
      await this.indexedDbService.savePedido(pedido);
    } else {
      this.pedido.set(pedidoIDB);
    }
  }

  emitSocketFinalizados() {
    this.webSocketService.emit(EventSocket.GET_PEDIDOS_FINALIZADOS);
  }

  emitSocketReset() {
    this.webSocketService.emit(EventSocket.RESET_PEDIDOS);
  }

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

  async loadPedido(pedido: Pedido) {
    this.message.set('');

    const pedidoIDB = await this.indexedDbService.getPedido(pedido.pedidoId);

    if (!pedidoIDB) {
      pedido.pendientes = pedido.pedidoDetalles;
      pedido.separados = [];
      await this.indexedDbService.savePedido(pedido);

      const separationPedido : SeparationPedido = {
        separationUserId: this.authService.currentUser()!.user_id
      }
      this.pedidoService.startSeparation(pedido.pedidoId, separationPedido).subscribe();
      this.pedido.set(pedido);
    } else {
      this.pedido.set(pedidoIDB);
      this.pedido()?.pendientes!.sort(this.orderDetalles);
    }
    localStorage.setItem(
      'separation-selected-pedido-spv3',
      JSON.stringify(pedido)
    );

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
    }
    this.webSocketService.emit(EventSocket.SELECT_PEDIDO_FINALIZADO, {
      pedidoSelected: pedido,
      pedidoActual: this.pedido(),
    });
  }

  async toSeparado(item: PedidoDetalle) {
    const index = this.pedido()?.pendientes!.findIndex(
      (i) => i.pedidodetalleId === item.pedidodetalleId
    );
    this.pedido.update((pedido: Pedido | null) => {
      pedido?.pendientes!.splice(index!, 1);
      pedido?.separados!.push(item);
      return pedido;
    });

    this.pedido()?.pendientes!.sort(this.orderDetalles);
    this.pedido()?.separados!.reverse();

    await this.indexedDbService.savePedido(this.pedido());

    if (this.pedido()?.pendientes!.length === 0) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Se separaron todos los productos pendientes. Desea finalizar la separación del pedido?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((resutl) => {
        if (resutl.isConfirmed) {
          this.sendPedido();
        }
      });
    }
  }

  async toPendiente(item: PedidoDetalle) {
    const index = this.pedido()?.separados!.findIndex(
      (i) => i.pedidodetalleId === item.pedidodetalleId
    );
    this.pedido.update((pedido: Pedido | null) => {
      pedido?.separados!.splice(index!, 1);
      pedido?.pendientes!.push(item);
      return pedido;
    });
    this.pedido()?.pendientes!.sort(this.orderDetalles);
    this.pedido()?.separados!.sort(this.orderDetalles);
    await this.indexedDbService.savePedido(this.pedido());
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
      if (this.pedido()?.pendientes!.length === 0 && this.pedido()?.estado === 'V') {
        this.webSocketService.emit(EventSocket.SEND_TO_VERIFICATION, {
          pedido: this.pedido(),
        });
        this.pedidoService.endSeparation(this.pedido()?.pedidoId!, {}).subscribe();
        this.indexedDbService.removePedido(this.pedido()?.pedidoId!);
        this.pedido.set(null);
        this.orden = '';
        localStorage.removeItem('separation-selected-pedido-spv3');
        Swal.fire(
          'Pedido separado',
          'El pedido ha sido separado correctamente',
          'success'
        );
      } else {
        Swal.fire(
          'No es posible enviar a verificación',
          'Tiene productos pendientes de separación',
          'warning'
        );
      }
    } else
      Swal.fire(
        'No es posible enviar a verificación',
        'Debe seleccionar un pedido',
        'warning'
      );
  }
}
