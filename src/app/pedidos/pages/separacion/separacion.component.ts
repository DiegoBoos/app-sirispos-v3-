import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DashboardService } from '../../../dashboard/dashboard.service';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../pedido.service';
import { Pedido, PedidoDetalle } from '../../interfaces/pedido.interface';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

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
export default class SeparacionComponent implements OnInit {
  public dashboardService = inject(DashboardService);
  private pedidoService = inject(PedidoService);

  private router = inject(Router);

  public orden: string = '';

  public pedido = signal<Pedido | null>(null);
  public message = signal<string>('');

  public pendientes = signal<PedidoDetalle[]>([]);
  public separados = signal<PedidoDetalle[]>([]);

  constructor() {
    this.dashboardService.displayMenu.set(false);
  }
  ngOnInit(): void {
    initFlowbite();
  }

  exit() {
    this.dashboardService.displayMenu.set(true);
    this.router.navigateByUrl('/dashboard/pedidos');
  }

  searchPedido() {
    this.pedido.set(null);
    this.message.set('');
    this.pendientes.set([]);
    this.separados.set([]);
    const orden =
      this.orden.length < 10
        ? `OP${'0'.repeat(8 - this.orden.length)}${this.orden}`
        : this.orden;
    this.pedidoService.getByOrden(orden).subscribe((resp: any) => {
      if (resp) {
        const pedido: Pedido = resp;
        this.pedido.set(pedido);
        if (pedido.estado !== 'Z') {
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
          this.pendientes.set(this.pedido()?.pedidoDetalles!);
          this.pendientes().sort(this.orderDetalles);
        }
      }
    });
  }

  toSeparado(item: PedidoDetalle) {
    const index = this.pendientes().findIndex(i=>i.pedidodetalleId === item.pedidodetalleId)
    this.pendientes.update((arr: PedidoDetalle[]) => {
      arr.splice(index,1);
      return arr.slice(0);
    });
    this.separados.update((arr: PedidoDetalle[]) => {
      arr.push(item);
      return arr.slice(0);
    });

    this.pendientes().sort(this.orderDetalles);
    this.separados().sort(this.orderDetalles);
  }

  toPendiente(item: PedidoDetalle) {
    const index = this.separados().findIndex(i=>i.pedidodetalleId === item.pedidodetalleId)
    this.separados.update((arr: PedidoDetalle[]) => {
      arr.splice(index,1);
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
}
