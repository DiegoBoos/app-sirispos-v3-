import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Pedido } from '../pedidos/interfaces/pedido.interface';
import { User } from '../auth/interfaces/user.interface';

@Component({
  selector: 'app-geolocation',
  standalone: true,
  imports: [CommonModule, MapViewComponent, RouterModule],
  templateUrl: './geolocation.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GeolocationComponent implements OnInit {
  private location = inject(Location);

  public pedido?: Pedido;
  public user?: User;

  ngOnInit(): void {

    const location: any = this.location.getState();
    const { pedido } = location;

    if (pedido) {
      this.user = pedido.user;
      this.pedido = pedido;
    }

    // this.route.queryParams.subscribe(params => {

    //   const { pedido } = params;
    //   if (pedido) {
    //     const serializedPedido = params['pedido'];
    //     const pedido = JSON.parse(decodeURIComponent(serializedPedido));
    //     console.log(pedido); // Aquí puedes acceder al objeto 'user'

    //   }
    // });
   
  }
}
