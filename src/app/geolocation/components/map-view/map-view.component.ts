import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  signal,
} from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker,
  MapMarkerClusterer,
} from '@angular/google-maps';
import { PositionInfo } from '../../interfaces/postion-info-interface';
import { User } from '../../../auth/interfaces/user.interface';
import { Pedido } from '../../../pedidos/interfaces/pedido.interface';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMap,
    MapMarker,
    MapMarkerClusterer,
    MapInfoWindow,
  ],
  templateUrl: './map-view.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 0.82753, lng: -77.65633 };
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions = signal<google.maps.LatLngLiteral[]>([]);

  positionsInfo = signal<PositionInfo[]>([]);
  userInfo = signal<User>({
    user_id: '0',
    email: '',
    nombre: '',
    activo: 0,
  });
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

  @Input() pedido?: Pedido;

  ngAfterViewInit(): void {
    if (this.pedido) {
      this.positionsInfo.update((arr: PositionInfo[]) => {
        this.zoom = 20;
        this.center = { lat: this.pedido?.lat!, lng: this.pedido?.lng! };
        arr.push({
          user: this.pedido?.user!,
          position: this.center,
        });
        return arr.slice(0);
      });
    } else {
      this.positionsInfo.update((arr: PositionInfo[]) => {
        arr.push({
          user: {
            user_id: '13',
            email: '',
            nombre: 'Juan Pablo Villota',
            activo: 0,
          },
          position: { lat: 0.88272, lng: -77.70085 },
        });
        arr.push({
          user: {
            user_id: '38',
            email: '',
            nombre: 'Juan Carlos Bastidas',
            activo: 0,
          },
          position: { lat: 0.96012, lng: -77.62847 },
        });
        arr.push({
          user: {
            user_id: '12',
            email: '',
            nombre: 'Cristian Calvache',
            activo: 0,
          },
          position: { lat: 1.06911, lng: -77.65762 },
        });
        arr.push({
          user: {
            user_id: '7',
            email: '',
            nombre: 'Alvaro Diaz',
            activo: 0,
          },
          position: { lat: 0.82753, lng: -77.65633 },
        });
        return arr.slice(0);
      });
    }
  }

  positionInfo(position: MapMarker, info: PositionInfo) {
    this.userInfo.set(info.user);
    this.infoWindow!.open(position);
  }
}
